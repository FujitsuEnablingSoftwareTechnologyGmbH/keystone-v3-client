var mixin = require('../utils').mixin,
  uris = require('../util/uris'),
  request = require('../util/request'),
  uri = uris.roles;

module.exports = RolesApi;

// API
mixin(RolesApi.prototype, {
  add        : request.noParamRequest(request.method.POST, uri),
  all        : request.noParamRequest(request.method.GET, uri),
  assignments: request.paramRequest(request.method.GET, '/v3/role_assignments')
});
// API

function RolesApi(settings) {
  if (!(this instanceof RolesApi)) {
    return new RolesApi(settings);
  }
  this.settings = settings;
}
