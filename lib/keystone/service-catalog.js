var mixin = require('../utils').mixin,
  uris = require('../util/uris'),
  request = require('../util/request'),
  uri = uris.service_catalog;

module.exports = ServiceCatalogApi;

// API
mixin(ServiceCatalogApi.prototype, {
  add   : request.noParamRequest(request.method.POST, uri),
  all   : request.noParamRequest(request.method.GET, uri),
  one   : request.paramRequest(request.method.GET, uri + '/${service_id}'),
  update: request.paramRequest(request.method.PATCH, uri + '/${service_id}'),
  remove: request.paramRequest(request.method.DELETE, uri + '/${service_id}')
});
// API

function ServiceCatalogApi(settings) {
  if (!(this instanceof ServiceCatalogApi)) {
    return new ServiceCatalogApi(settings);
  }
  this.settings = settings;
}
