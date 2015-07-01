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

/**
 * List of all URIs as specified by the {@link http://developer.openstack.org/api-ref-identity-v3.html}.
 *
 * @type {object}
 * @global
 * @static
 */
var uris = module.exports = {
  info           : '/v3',
  tokens         : '/v3/auth/tokens',
  service_catalog: '/v3/services',
  endpoints      : '/v3/endpoints',
  domains        : '/v3/domains',
  projects       : '/v3/projects',
  users          : '/v3/users',
  groups         : '/v3/groups',
  credentials    : '/v3/credentials',
  roles          : '/v3/roles',
  policies       : '/v3/policies'
};
