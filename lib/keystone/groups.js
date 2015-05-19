var mixin = require('../utils').mixin,
  uris = require('../util/uris'),
  request = require('../util/request'),
  uri = uris.groups;

module.exports = GroupsApi;

// API
mixin(GroupsApi.prototype, {
  add   : request.noParamRequest(request.method.POST, uri),
  all   : request.noParamRequest(request.method.GET, uri),
  one   : request.paramRequest(request.method.GET, uri + '/${group_id}'),
  update: request.paramRequest(request.method.PATCH, uri + '/${group_id}'),
  remove: request.paramRequest(request.method.DELETE, uri + '/${group_id}'),
  user  : {
    all     : request.paramRequest(request.method.GET, uri + '/${group_id}/users'),
    add     : request.paramRequest(request.method.PUT, uri + '/${group_id}/users/${user_id}'),
    remove: request.paramRequest(request.method.DELETE, uri + '/${group_id}/users/${user_id}'),
    isMember: request.paramRequest(request.method.HEAD, uri + '/${group_id}/users/${user_id}')
  }
});
// API

function GroupsApi(settings) {
  if (!(this instanceof GroupsApi)) {
    return new GroupsApi(settings);
  }
  this.settings = settings;
}
