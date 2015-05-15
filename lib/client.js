var _ = require('lodash'),
  debug = require('debug')('kvn'),
  keystone = require('./keystone'),
  timer = require('./util/timer');

module.exports = KeystoneClient;

function KeystoneClient(options) {
  if (!(this instanceof KeystoneClient)) {
    return new KeystoneClient(options);
  }

  debug('Constructing Keystone client');

  options = validateOptions(options);

  var self = this,
    start = timer.start(),
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

  debug('Constructed full Keystone client in ' + timer.end(start) + ' ms');

  return self;
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

