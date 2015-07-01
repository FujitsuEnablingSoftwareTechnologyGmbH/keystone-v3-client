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

var _ = require('lodash'),
  debug = require('debug')('kvn'),
  timer = require('./utils').timer;

/**
 * @module client
 */
module.exports = KeystoneClient;

/**
 * KeystoneClient - initializes <b>KeystoneClient</b>.
 *
 * At this point <b>options</b> must be combined from
 * settings for all dependent modules (bindings, services, caches);
 *
 * @param {object} options literal object.
 * @class KeystoneClient
 */
function KeystoneClient(options) {
  var start;

  if (!(this instanceof KeystoneClient)) {
    return new KeystoneClient(options);
  }

  debug('Constructing Keystone client');

  start = timer.start();
  options = validateOptions(options);

  initBinding.bind(this)(options);
  initTokenCache.bind(this)(options);

  debug('Constructed full Keystone client in ' + timer.end(start) + ' ms');
}


/**
 * initTokenCache - initializes tokensCache
 *
 * Options argument must contain <b>tokensCache</b> key
 *
 * @param  {object} options settings object
 *
 * @function
 * @private
 * @static
 */
function initTokenCache(options) {
  var tokensCache = require('./services/tokens-cache');
  if (_.isFunction(tokensCache)) {
    tokensCache(options);
  }
}

/**
 * initBinding - initializes API binding to keystone
 *
 * Initializes each API binding defined in [keystone]{@link module:lib/keystone}
 *
 * @param  {object} options settings object
 *
 * @function
 * @private
 * @static
 */
function initBinding(options) {
  var self = this,
    keystone = require('./keystone'),
    lstart;

  _.chain(keystone)
    .keys()
    .compact()
    .forEachRight(function (apiKey) {
      debug('Initializing ' + apiKey + ' sub-api...');

      lstart = timer.start();

      try {
        self[apiKey] = keystone[apiKey](options);
      } catch (err) {
        debug('Error when initializing ' + apiKey);
        var errorInInit = new Error('Error when initializing ' + apiKey);
        errorInInit.captured = err;
        throw errorInInit;
      }

      debug('Initializing ' + apiKey + ' sub-api completed in ' + timer.end(lstart) + ' ms');
    }).
    value();
}

/**
 * validateOptions - ensured that settings for the client do not
 * contain any error or are inconsistent.
 *
 * @param  {object} options settings object
 * @return {object} validated options
 *
 * @function
 * @private
 * @static
 */
function validateOptions(options) {
  options = options || {};

  if (options.username && !options.password) {
    throw new Error('If username is provided you also need to provide password');
  }
  if (!options.url) {
    throw new Error('Url to keystone is missing');
  }

  return options;
}
