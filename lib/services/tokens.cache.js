var clone = require('lodash/lang/clone'),
  defaults = require('lodash/object/defaults'),
  noop = require('lodash/utility/noop'),
  constant = require('lodash/utility/constant'),
  utils = require('../utils'),
  defaultOpts = {
    /**
     * Default to 3600000ms=1h, means how long token should be cached,
     * this value has lowest priority
     */
    ttl  : 3600000,
    /**
     * By default caching is disabled
     */
    cache: false
  };

module.exports = tokensCacheFactoryFn;

function tokensCacheFactoryFn(opts) {
  var service,
    tokenOpts,
    memoryCache;

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
       * Retrieves token arbitrary data from cache or returns undefined is such
       * is not present there
       *
       * @param token to be checked.
       * @returns {*}
       */
      get: memoryCache.get,
      /**
       * Deletes token from cache.
       *
       * @param token to be checked.
       * @returns {*}
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
    return ('expires_in' in data && calculateTTL(data.expires_at)) || tokenOpts.ttl;
  }
}

function calculateTTL(expiresAt) {
  var diff;

  expiresAt = new Date(expiresAt);
  diff = utils.dateDiff(new Date(), expiresAt);

  return diff > 0 ? diff : undefined;
}
