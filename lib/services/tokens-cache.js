/*
 * Copyright 2015 FUJITSU LIMITED
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

var clone = require('lodash/lang/clone'),
  defaults = require('lodash/object/defaults'),
  noop = require('lodash/utility/noop'),
  constant = require('lodash/utility/constant'),
  utils = require('../utils'),
  /**
   * @class defaultOpts
   * @private
   * @type {object}
   * @memberof module:services/tokens-cache
   *
   * @property {number} ttl
   * Default to 3600000ms=1h, means how long token should be cached,
   * this value has lowest priority
   * @property {boolean} cache
   * By default caching is disabled
   */
  defaultOpts = (function defaultOpts(){
    return {
      ttl  : 3600000,
      cache: false
    };
  }());

/**
 * @module
 */
module.exports = tokensCacheFactoryFn;

/**
 * @typedef TokenCacheAPI
 * @type {object}
 * @property {function}  put  inserts new token into cache
 * @property {function}  has  checks if tokens is in cache
 * @property {function}  get  retries token from cache
 * @property {function}  del  removes token from cache
 */

/**
 * tokensCacheFactoryFn - factory for token cache.
 *
 * @param  {object} opts configuration object
 * @param  {object} opts.tokensCache non-default values for tokensCache
 * @return {TokenCacheAPI} tokensCache API
 *
 * @function
 * @public
 */
function tokensCacheFactoryFn(opts) {
  var service,
    tokenOpts,
    memoryCache;

  /* istanbul ignore next */
  opts = opts || {};

  tokenOpts = defaults(
    clone(opts.tokensCache || {}),
    defaultOpts
  );

  if (tokenOpts.cache) {
    memoryCache = require('memory-cache');  // require only if needed

    service = {
      /**
       * Inserts token along with provided data into the cache.
       * TTL for token can take one of the following values
       * - default TTL eql to defaultOpts.ttl
       * - TTL specified when initializing cache via settings.tokenCache.ttl, where
       * settings is passed from the application that uses keystone-v3-client
       * - TTL calculated by this method if provided data contains > "expires_at" < key,
       * this value comes from keystone itself and informs how long token is valid, therefore how
       * long it'd be cached
       *
       * @param token token to be cached
       * @param data arbitrary data to store along with cached token
       * @optional callback function to be called for expired entry
       */
      put: function (token, data) {
        var cacheFor = getCacheFor(data),
          hasCallback = arguments.length === 3 && typeof arguments[2] === 'function';

        /* cache for 10 seconds less in order to retrieve new token using the
         * one which is about to expire
         */
        if (hasCallback) {
          memoryCache.put(token, data, cacheFor - 10000, arguments[2]);
        } else {
          memoryCache.put(token, data, cacheFor);
        }
      },
      /**
       * Evaluates if token has been cached.
       *
       * @param token to be checked.
       * @returns {*|boolean}
       */
      has: function (token) {
        return !!this.get(token);
      },
      /**
       * Retrieves token arbitrary data from cache or returns null is such
       * is not present there
       *
       * @param token to be checked.
       * @returns {object} data associated with <b>token</b>
       */
      get: memoryCache.get,
      /**
       * Deletes token from cache.
       *
       * Please note that token will be removed only if token has expired,
       * as defined by TTL calculated for it in {@link service.put}.
       *
       * What's more timeout is cleared if this method would return false.
       *
       * @param token to be checked.
       * @returns {boolean} true if deleted, false otherwise
       */
      del: memoryCache.del
    };

  } else {
    service = {
      put: noop,
      get: noop,
      del: noop,
      has: constant(false)
    };
  }

  // after init lets redefine what we exported
  module.exports = constant(service);

  return service;

  function getCacheFor(data) {
    return ('expires_at' in data && calculateTTL(data.expires_at)) || tokenOpts.ttl;
  }
}

function calculateTTL(expiresAt) {
  var diff;

  expiresAt = utils.parseISO8601Date(expiresAt);
  diff = utils.dateDiff(new Date(), expiresAt);

  return diff > 0 ? diff : undefined;
}
