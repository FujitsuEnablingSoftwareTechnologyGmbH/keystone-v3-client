var _ = require('lodash'),
  debug = require('debug')('kvn'),
  keystone = require('./keystone'),
  timer = require('./utils').timer;

module.exports = KeystoneClient;

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

function initTokenCache(options) {
  var tokensCache = require('./services/tokens.cache');
  if (_.isFunction(tokensCache)) {
    tokensCache(options);
  }
}

function initBinding(options) {
  var self = this,
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

// private part
function validateOptions(options) {
  options = options || {};

  if (options.username) {
    if (!options.password && !options.apiKey) {
      throw new Error('If username is provided you also need to provide password or apiKey');
    }
  }
  if (!options.url) {
    throw new Error('Url to keystone is missing');
  }

  return options;
}
