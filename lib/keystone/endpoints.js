var mixin = require('../util/mixin'),
  uris = require('../util/uris'),
  request = require('../util/request');

var uri = uris.endpoints;

module.exports = EndpointApi;

// API
mixin(EndpointApi.prototype, {
  add   : request.noParamRequest(request.method.POST, uri),
  all   : request.noParamRequest(request.method.GET, uri),
  update: request.paramRequest(request.method.PATCH, uri + '/${endpoint_id}'),
  delete: request.paramRequest(request.method.DELETE, uri + '/${endpoint_id}')
});
// API

function EndpointApi(settings) {
  if (!(this instanceof EndpointApi)) {
    return new EndpointApi(settings);
  }
  this.settings = settings;
}