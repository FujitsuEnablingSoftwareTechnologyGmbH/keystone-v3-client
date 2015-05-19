var memoryCache = require('memory-cache'),
  ttl = 360000;

module.exports = {
  /**
   * Returns API binding from cache or creates new one and places it in cache.
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
