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
  uri = uris.roles;

module.exports = RolesApi;

// API
mixin(RolesApi.prototype, {
  add        : request.noParamRequest(request.method.POST, uri),
  all        : request.noParamRequest(request.method.GET, uri),
  assignments: request.paramRequest(request.method.GET, '/v3/role_assignments')
});
// API

function RolesApi(settings) {
  if (!(this instanceof RolesApi)) {
    return new RolesApi(settings);
  }
  this.settings = settings;
}
