var mixin = require('../utils').mixin,
  uris = require('../util/uris'),
  request = require('../util/request'),
  uri = uris.credentials;


/**
 * @memberof keystone
 */
module.exports = CredentialsApi;

// API
mixin(CredentialsApi.prototype, {
  /**
   * CredentialsApi.prototype.add - creates requests that adds new credential
   *
   * @param conf {object}
   *  configuration data for request
   * @param conf.token {string}
   *  valid <b>X-Auth-Token</b> that allows to execute request.
   *  This is convenient way to specify token. It can be set also
   *  with <b>conf.headers.X-Auth-Token</b>
   * @param conf.headers {object}
   *  headers contaning <b>X-Auth-Token</b>
   * @param conf.data {object}
   *  compatible with request payload required by [Keystone].
   *  Request keys are available [here]{@link http://developer.openstack.org/api-ref-identity-v3.html#createCredential}
   *
   * @returns {Promise} success handler will resolve with data response, failure with Error
   * @instance
   * @function
   * @memberof CredentialsApi
   */
  add   : request.noParamRequest(request.method.POST, uri),
  /**
   * CredentialsApi.prototype.all - creates request that retrieves all tokens
   *
   * @param conf {object}
   *  configuration data for request
   * @param conf.token {string}
   *  valid <b>X-Auth-Token</b> that allows to execute request.
   *  This is convenient way to specify token. It can be set also
   *  with <b>conf.headers.X-Auth-Token</b>
   * @param conf.headers {object}
   *  headers contaning <b>X-Auth-Token</b>
   *
   * @returns {Promise} success handler will resolve with data response, failure with Error
   * @instance
   * @function
   * @memberof CredentialsApi
   */
  // TODO once implemented add information about optional query requests
  all   : request.noParamRequest(request.method.GET, uri),
  /**
   * CredentialsApi.prototype.one - retrieves single credential
   *
   * @param conf {object}
   *  configuration data for request
   * @param conf.token {string}
   *  valid <b>X-Auth-Token</b> that allows to execute request.
   *  This is convenient way to specify token. It can be set also
   *  with <b>conf.headers.X-Auth-Token</b>
   * @param conf.headers {object}
   *  headers contaning <b>X-Auth-Token</b>
   * @param conf.params {object} list of query parameters
   * @param conf.params.credential_id id of desired credential
   *
   * @returns {Promise} success handler will resolve with data response, failure with Error
   * @instance
   * @function
   * @memberof CredentialsApi
   */
  one   : request.paramRequest(request.method.GET, uri + '/${credential_id}'),
  /**
   * CredentialsApi.prototype.update - updates single credential
   *
   * @param conf {object}
   *  configuration data for request
   * @param conf.token {string}
   *  valid <b>X-Auth-Token</b> that allows to execute request.
   *  This is convenient way to specify token. It can be set also
   *  with <b>conf.headers.X-Auth-Token</b>
   * @param conf.headers {object}
   *  headers contaning <b>X-Auth-Token</b>
   * @param conf.params {object} list of query parameters
   * @param conf.params.credential_id id {string} of desired credential
   * @param conf.data {object}
   *  compatible with request payload required by [Keystone].
   *  Request keys are available [here]{@link http://developer.openstack.org/api-ref-identity-v3.html#updateCredential}
   *
   * @returns {Promise} success handler will resolve with data response, failure with Error
   * @instance
   * @function
   * @memberof CredentialsApi
   */
  update: request.paramRequest(request.method.PATCH, uri + '/${credential_id}'),
  /**
   * CredentialsApi.prototype.remove - removes single credential
   *
   * Method does not carry:
   * - request payload
   * Method does not receive:
   * - response body
   *
   * @param conf {object}
   *  configuration data for request
   * @param conf.token {string}
   *  valid <b>X-Auth-Token</b> that allows to execute request.
   *  This is convenient way to specify token. It can be set also
   *  with <b>conf.headers.X-Auth-Token</b>
   * @param conf.headers {object}
   *  headers contaning <b>X-Auth-Token</b>
   * @param conf.params {object} list of query parameters
   * @param conf.params.credential_id id {string} of desired credential
   *
   * @returns {Promise} success handler will resolve with data response, failure with Error
   * @instance
   * @function
   * @memberof CredentialsApi
   */
  remove: request.paramRequest(request.method.DELETE, uri + '/${credential_id}')
});
// API

/**
 * CredentialsApi - constructs new <b>Credentials</b> API binding
 *
 * Requires following keys to be defined in settings:
 * - url (valid url to keystone)
 *
 * Created api exposes methods defined in [credentials]{@link http://developer.openstack.org/api-ref-identity-v3.html#credentials-v3}
 *
 * @param  {type} settings settings object
 * @class  CredentialsApi
 */
function CredentialsApi(settings) {
  if (!(this instanceof CredentialsApi)) {
    return new CredentialsApi(settings);
  }
  this.settings = settings;
}
