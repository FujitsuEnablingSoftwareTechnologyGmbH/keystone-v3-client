var mixin = require('../util/mixin'),
  uris = require('../util/uris'),
  request = require('../util/request');

var uri = uris.domains;

module.exports = DomainsApi;

// API
mixin(DomainsApi.prototype, {
  add   : request.noParamRequest(request.method.POST, uri),
  all   : request.noParamRequest(request.method.GET, uri),
  one   : request.paramRequest(request.method.GET, uri + '/${domain_id}'),
  update: request.paramRequest(request.method.PATCH, uri + '/${domain_id}'),
  delete: request.paramRequest(request.method.DELETE, uri + '/${domain_id}'),
  user  : {
    allRoles  : request.paramRequest(request.method.GET, uri + '/${domain_id}/users/${user_id}/roles'),
    grantRole : request.paramRequest(request.method.PUT, uri + '/${domain_id}/users/${user_id}/roles/${role_id}'),
    checkRole : request.paramRequest(request.method.HEAD, uri + '/${domain_id}/users/${user_id}/roles/${role_id}'),
    revokeRole: request.paramRequest(request.method.DELETE, uri + '/${domain_id}/users/${user_id}/roles/${role_id}')
  },
  group : {
    allRoles  : request.paramRequest(request.method.GET, uri + '/${domain_id}/groups/${group_id}'),
    grantRole : request.paramRequest(request.method.PUT, uri + '/${domain_id}/groups/${group_id}/roles/${role_id}'),
    checkRole : request.paramRequest(request.method.HEAD, uri + '/${domain_id}/groups/${group_id}/roles/${role_id}'),
    revokeRole: request.paramRequest(request.method.DELETE, uri + '/${domain_id}/groups/${group_id}/roles/${role_id}')
  }
});
// API

function DomainsApi(settings) {
  if (!(this instanceof DomainsApi)) {
    return new DomainsApi(settings);
  }
  this.settings = settings;
}