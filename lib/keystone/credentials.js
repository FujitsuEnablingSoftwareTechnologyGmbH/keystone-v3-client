var mixin = require('../utils').mixin,
  uris = require('../util/uris'),
  request = require('../util/request'),
  uri = uris.credentials;

module.exports = CredentialsApi;

// API
mixin(CredentialsApi.prototype, {
  add   : request.noParamRequest(request.method.POST, uri),
  all   : request.noParamRequest(request.method.GET, uri),
  one   : request.paramRequest(request.method.GET, uri + '/${credential_id}'),
  update: request.paramRequest(request.method.PATCH, uri + '/${credential_id}'),
  remove: request.paramRequest(request.method.DELETE, uri + '/${credential_id}')
});
// API

function CredentialsApi(settings) {
  if (!(this instanceof CredentialsApi)) {
    return new CredentialsApi(settings);
  }
  this.settings = settings;
}
