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
        // TODO add err message here
        debug('Error when initializing ' + apiKey);
        throw err;
      }

      debug('Initializing ' + apiKey + ' sub-api completed in ' + timer.end(lstart) + ' ms');
    }).
    value();
}

/**
 * validateOptions - enensured that settings for the client do not
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
