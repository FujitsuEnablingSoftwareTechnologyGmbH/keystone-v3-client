var mixin = require('../utils').mixin,
  uris = require('../util/uris'),
  request = require('../util/request'),
  uri = uris.policies;

module.exports = PoliciesApi;

// API
mixin(PoliciesApi.prototype, {
  add   : request.noParamRequest(request.method.POST, uri),
  all   : request.noParamRequest(request.method.GET, uri),
  one   : request.paramRequest(request.method.GET, uri + '/${policy_id}'),
  update: request.paramRequest(request.method.PATCH, uri + '/${policy_id}'),
  remove: request.paramRequest(request.method.DELETE, uri + '/${policy_id}')
});
// API

function PoliciesApi(settings) {
  if (!(this instanceof PoliciesApi)) {
    return new PoliciesApi(settings);
  }
  this.settings = settings;
}
