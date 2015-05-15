var mixin = require('../util/mixin'),
  uris = require('../util/uris'),
  request = require('../util/request');

var uri = uris.tokens;

module.exports = TokensApi;

// API
mixin(TokensApi.prototype, {
  authenticate: request.noParamRequest(request.method.POST, uri),
  validate    : request.noParamRequest(request.method.GET, uri),
  check       : request.noParamRequest(request.method.HEAD, uri),
  revoke      : request.noParamRequest(request.method.DELETE, uri)
});
// API

function TokensApi(settings) {
  if (!(this instanceof TokensApi)) {
    return new TokensApi(settings);
  }
  this.settings = settings;
}