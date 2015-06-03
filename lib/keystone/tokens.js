var mixin = require('../utils').mixin,
  uris = require('../util/uris'),
  request = require('../util/request'),
  uri = uris.tokens;

/**
 * @memberof keystone
 */
module.exports = TokensApi;

// API
mixin(TokensApi.prototype, {
  /**
   * TokensApi.prototype.authenticate - creates request to authenticate with tokens API
   *
   * There are two authentication methods: <b>token, password</b>.
   * The request body (i.e conf.data) depends on the one being chosen.
   * Check examples to get familiar with usage of API.
   *
   * @param conf {object} configuration object for the requests
   * @param conf.data {object}
   *
   * @returns {Promise} success handler will resolve with data response, failure with Error
   * @instance
   * @function
   * @memberof TokensApi
   * @see [Official documentation]{@link http://developer.openstack.org/api-ref-identity-v3.html#authenticate}
   *
   * @example <caption>authentication with token</caption>
   * tokensApi.authenticate({
   *   data: {
   *    "auth" :{
   *      "identity": {
   *        "methods": ["token"],
   *        "token": "d8df78062d2343659774363214280600"
   *       }
   *     }
   *   }
   * })
   * @example <caption>authentication with password</caption>
   * tokensApi.authenticate({
   *   data: {
   *     "auth": {
   *         "identity": {
   *          "methods" : [
   *               "password"
   *           ],
   *           "password": {
   *               "user": {
   *                   "id"      : "4af0bfb3227b4f11900366454ef4c6f4",
   *                   "password": "admin"
   *               }
   *           }
   *        }
   *     }
   *   }
   * })
   */
  authenticate: request.noParamRequest(request.method.POST, uri),
  /**
   * TokensApi.prototype.validate - creates request to validate token
   *
   * @param conf {object} configuration object for the requests
   * @param conf.headers {object} list of headers to be carried with request
   * @param conf.headers.X-Auth-Token {string} master token to access Keystone
   * @param conf.headers.X-Subject-Token {string} token to validate
   *
   * @returns {Promise} success handler will resolve with data response, failure with Error
   * @instance
   * @function
   * @memberof TokensApi
   * @see [Official documentation]{@link http://developer.openstack.org/api-ref-identity-v3.html#validateTokens}
   *
   * @example <caption>validating token</caption>
   * tokensApi
   * .validate({
   *   headers: {
   *     'X-Auth-Token'   : keystoneToken,
   *     'X-Subject-Token': keystoneToken
   *   }
   * })
   */
  validate    : request.noParamRequest(request.method.GET, uri),
  /**
   * TokensApi.prototype.check - creates request to check token/
   *
   * Similar to {@link TokensApi#validate} because in general the success
   * response means the same - <b>token is valid</b>. However {@link TokensApi#check} is
   * lean method and carries neither request nor response body. Only indication
   * of success (<b>204</b>) or failure is the HTTP response code.
   *
   * @param conf {object} configuration object for the requests
   * @param conf.headers {object} list of headers to be carried with request
   * @param conf.headers.X-Auth-Token {string} master token to access Keystone
   * @param conf.headers.X-Subject-Token {string} token to check
   *
   * @returns {Promise} success handler will resolve with data response, failure with Error
   * @instance
   * @function
   * @memberof TokensApi
   * @see [Official documentation]{@link http://developer.openstack.org/api-ref-identity-v3.html#checkTokens}
   *
   * @example <caption>checking token</caption>
   * tokensApi
   *   .check({
   *    headers: {
   *     'X-Auth-Token'   : keystoneToken,
   *     'X-Subject-Token': keystoneToken
   *    }
   * })
   */
  check       : request.noParamRequest(request.method.HEAD, uri),
  /**
   * TokensApi.prototype.revoke - revokes specified token.
   *
   * Method carries neither requests payload nor receives response body.
   * Only indication of success or failure is HTTP response code.
   *
   * @param conf {object} configuration object for the requests
   * @param conf.headers {object} list of headers to be carried with request
   * @param conf.headers.X-Auth-Token {string} master token to access Keystone
   * @param conf.headers.X-Subject-Token {string} token to revoke
   *
   * @returns {Promise} success handler will resolve with data response, failure with Error
   * @instance
   * @function
   * @memberof TokensApi
   * @see [Official documentation]{@link http://developer.openstack.org/api-ref-identity-v3.html#revokeTokens}
   *
   * @example <caption>revoking token</caption>
   * tokensApi
   *   .revoke({
   *     headers: {
   *       'X-Auth-Token'   : keystoneToken,
   *       'X-Subject-Token': keystoneToken
   *     }
   *   })
   */
  revoke      : request.noParamRequest(request.method.DELETE, uri)
});
// API

/**
 * TokensApi - creates new <b>TokensApi</b> binding
 *
 * Requires following keys to be defined in settings:
 * - url (valid url to keystone)
 *
 * Created api exposes methods defined in [credentials]{@link http://developer.openstack.org/api-ref-identity-v3.html#credentials-v3}
 *
 * @param settings  {type} settings settings object
 * @param settings.url {string} url to keystone
 * @class TokensApi
 */
function TokensApi(settings) {
  if (!(this instanceof TokensApi)) {
    return new TokensApi(settings);
  }
  this.settings = settings;
}
