/*
 * Copyright 2015 FUJITSU LIMITED
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

var mixin = require('../utils').mixin,
  uris = require('../util/uris'),
  request = require('../util/request'),
  uri = uris.users;

/**
 * @memberof keystone
 */
module.exports = UsersApi;

// API
mixin(UsersApi.prototype, {
  /**
   * UsersApi.prototype.add - creates request to add new user
   *
   * @param conf {object} configuration object for the requests
   * @param conf.headers {object} request headers
   * @param conf.headers.X-Auth-Token {string} token to authenticate with keystone
   * @param conf.data {object} check example
   *
   * @returns {Promise} success handler will resolve with data response, failure with Error
   * @instance
   * @function
   * @memberof UsersApi
   * @see [Official documentation]{@link http://developer.openstack.org/api-ref-identity-v3.html#createUser}
   */
  add        : request.noParamRequest(request.method.POST, uri),
  /**
   * UsersApi.prototype.all - creates request to retrieve all users
   *
   * @param conf {object} configuration object for the requests
   * @param conf.headers {object} request headers
   * @param conf.headers.X-Auth-Token {string} token to authenticate with keystone
   *
   * @returns {Promise} success handler will resolve with data response, failure with Error
   * @instance
   * @function
   * @memberof UsersApi
   * @see [Official documentation]{@link http://developer.openstack.org/api-ref-identity-v3.html#listUsers}
   */
  all        : request.noParamRequest(request.method.GET, uri),
  /**
   * UsersApi.prototype.one - creates request to retrieve single user
   *
   * @param conf {object} configuration object for the requests
   * @param conf.headers {object} request headers
   * @param conf.headers.X-Auth-Token {string} token to authenticate with keystone
   * @param conf.param {object} param for the query
   * @param conf.params.user_id desired user id
   *
   * @returns {Promise} success handler will resolve with data response, failure with Error
   * @instance
   * @function
   * @memberof UsersApi
   * @see [Official documentation]{@link http://developer.openstack.org/api-ref-identity-v3.html#getUser}
   */
  one        : request.paramRequest(request.method.GET, uri + '/${user_id}'),
  /**
   * UsersApi.prototype.update - creates request to update single user
   *
   * @param conf {object} configuration object for the requests
   * @param conf.headers {object} request headers
   * @param conf.headers.X-Auth-Token {string} token to authenticate with keystone
   * @param conf.param {object} param for the query
   * @param conf.params.user_id desired user id
   *
   * @returns {Promise} success handler will resolve with data response, failure with Error
   * @instance
   * @function
   * @memberof UsersApi
   * @see [Official documentation]{@link http://developer.openstack.org/api-ref-identity-v3.html#updateUser}
   */
  update     : request.paramRequest(request.method.PATCH, uri + '/${user_id}'),
  /**
   * UsersApi.prototype.remove - creates request to remove single user
   *
   * @param conf {object} configuration object for the requests
   * @param conf.headers {object} request headers
   * @param conf.headers.X-Auth-Token {string} token to authenticate with keystone
   * @param conf.param {object} param for the query
   * @param conf.params.user_id desired user id
   *
   * @returns {Promise} success handler will resolve with data response, failure with Error
   * @instance
   * @function
   * @memberof UsersApi
   * @see [Official documentation]{@link http://developer.openstack.org/api-ref-identity-v3.html#deleteUser}
   */
  remove     : request.paramRequest(request.method.DELETE, uri + '/${user_id}'),
  /**
   * UsersApi.prototype.allGroups - creates request to retrieve all groups user is in
   *
   * @param conf {object} configuration object for the requests
   * @param conf.headers {object} request headers
   * @param conf.headers.X-Auth-Token {string} token to authenticate with keystone
   * @param conf.param {object} param for the query
   * @param conf.params.user_id desired user id
   *
   * @returns {Promise} success handler will resolve with data response, failure with Error
   * @instance
   * @function
   * @memberof UsersApi
   * @see [Official documentation]{@link http://developer.openstack.org/api-ref-identity-v3.html#listUserGroups}
   */
  allGroups  : request.paramRequest(request.method.GET, uri + '/${user_id}/groups'),
  /**
   * UsersApi.prototype.allGroups - creates request to retrieve all projects user is in
   *
   * @param conf {object} configuration object for the requests
   * @param conf.headers {object} request headers
   * @param conf.headers.X-Auth-Token {string} token to authenticate with keystone
   * @param conf.param {object} param for the query
   * @param conf.params.user_id desired user id
   *
   * @returns {Promise} success handler will resolve with data response, failure with Error
   * @instance
   * @function
   * @memberof UsersApi
   * @see [Official documentation]{@link http://developer.openstack.org/api-ref-identity-v3.html#listUserProjects}
   */
  allProjects: request.paramRequest(request.method.GET, uri + '/${user_id}/projects')
});
// API


/**
 * UsersApi - creates new <b>UsersApi</b> binding.
 *
 * @param {object} settings settings object
 * @param {object} settings.url keystone URL
 * @class UsersApi
 */
function UsersApi(settings) {
  if (!(this instanceof UsersApi)) {
    return new UsersApi(settings);
  }
  this.settings = settings;
}
