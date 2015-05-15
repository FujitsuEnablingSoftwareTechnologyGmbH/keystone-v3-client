var mixin = require('../util/mixin'),
  uris = require('../util/uris'),
  request = require('../util/request');

var uri = uris.users;

module.exports = UsersApi;

// API
mixin(UsersApi.prototype, {
  add        : request.noParamRequest(request.method.POST, uri),
  all        : request.noParamRequest(request.method.GET, uri),
  one        : request.paramRequest(request.method.GET, uri + '/${user_id}'),
  update     : request.paramRequest(request.method.PATCH, uri + '/${user_id}'),
  delete     : request.paramRequest(request.method.DELETE, uri + '/${user_id}'),
  allGroups  : request.paramRequest(request.method.GET, uri + '/${user_id}/groups'),
  allProjects: request.paramRequest(request.method.GET, uri + '/${user_id}/projects')
});
// API

function UsersApi(settings) {
  if (!(this instanceof UsersApi)) {
    return new UsersApi(settings);
  }
  this.settings = settings;
}