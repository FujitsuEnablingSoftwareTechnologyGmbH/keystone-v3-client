var mixin = require('../util/mixin'),
  uris = require('../util/uris'),
  request = require('../util/request');

module.exports = ProjectsApi;

var uri = uris.projects;

// API
mixin(ProjectsApi.prototype, {
  add   : request.noParamRequest(request.method.POST, uri),
  all   : request.noParamRequest(request.method.GET, uri),
  one   : request.paramRequest(request.method.GET, uri + '/${project_id}'),
  update: request.paramRequest(request.method.PATCH, uri + '/${project_id}'),
  delete: request.paramRequest(request.method.DELETE, uri + '/${project_id}'),
  user  : {
    allRoles  : request.paramRequest(request.method.GET, uri + '/${project_id}/users/${user_id}/roles'),
    grantRole : request.paramRequest(request.method.PUT, uri + '/${project_id}/users/${user_id}/roles/${role_id}'),
    checkRole : request.paramRequest(request.method.HEAD, uri + '/${project_id}/users/${user_id}/roles/${role_id}'),
    revokeRole: request.paramRequest(request.method.DELETE, uri + '/${project_id}/users/${user_id}/roles/${role_id}')
  },
  group : {
    allRoles  : request.paramRequest(request.method.GET, uri + '/${project_id}/groups/${group_id}/roles'),
    grantRole : request.paramRequest(request.method.PUT, uri + '/${project_id}/groups/${group_id}/roles/${role_id}'),
    checkRole : request.paramRequest(request.method.HEAD, uri + '/${project_id}/groups/${group_id}/roles/${role_id}'),
    revokeRole: request.paramRequest(request.method.DELETE, uri + '/${project_id}/groups/${group_id}/roles/${role_id}')
  }
});
// API

function ProjectsApi(settings) {
  if (!(this instanceof ProjectsApi)) {
    return new ProjectsApi(settings);
  }
  var self = this;
  self.settings = settings;
}