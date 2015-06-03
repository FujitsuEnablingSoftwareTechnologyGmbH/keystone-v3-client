var memoryCache = require('memory-cache'),
  ttl = 360000;

/**
 * @module
 */
module.exports = {
  /**
   * Returns API binding from cache or creates new one and places it in cache.
   *
   * @param ctrFn constructor function
   * @param settings configuration to be passed as the argument into ctrFn
   * @returns instantiated API binding [from cache or fresh]
   *
   * @static
   * @function
   */
  getApi: getApi
};

function getApi(ctrFn, settings) {
  var api = memoryCache.get(ctrFn);
  if (!api) {
    api = ctrFn(settings);
    memoryCache.put(ctrFn, api, ttl);
  }
  return api;
}
