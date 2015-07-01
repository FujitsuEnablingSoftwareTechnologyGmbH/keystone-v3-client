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
  uri = uris.service_catalog;

module.exports = ServiceCatalogApi;

// API
mixin(ServiceCatalogApi.prototype, {
  add   : request.noParamRequest(request.method.POST, uri),
  all   : request.noParamRequest(request.method.GET, uri),
  one   : request.paramRequest(request.method.GET, uri + '/${service_id}'),
  update: request.paramRequest(request.method.PATCH, uri + '/${service_id}'),
  remove: request.paramRequest(request.method.DELETE, uri + '/${service_id}')
});
// API

function ServiceCatalogApi(settings) {
  if (!(this instanceof ServiceCatalogApi)) {
    return new ServiceCatalogApi(settings);
  }
  this.settings = settings;
}
