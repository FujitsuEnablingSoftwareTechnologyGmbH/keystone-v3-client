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

// all API are exported with the respect of a root of natural REST URIs
/*
 Note that these exports are factory functions (to be exact ptr to these functions)
 In order to use any of it such API must be instantiated with object literal
 that will contain all required properties.

 Explanation:
 - helps to avoid keeping global state across sub-modules
 - makes it easy to unit-test code, API is separated between sub-groups similarly
 to next chunks of path in Keystone Identity API
 */

 /**
  * @module keystone
  * @description
  *   Exposes API binding to keystone in shape of a single module.
  *   API can be accessed then using <b>dot</b> notation:
  *
  * @example <code>require('lib/keystone').tokens</code>
  */

module.exports.tokens = require('./tokens');
module.exports.service_catalog = require('./service-catalog');
module.exports.endpoints = require('./endpoints');
module.exports.domains = require('./domains');
module.exports.projects = require('./projects');
module.exports.users = require('./users');
module.exports.groups = require('./groups');
module.exports.credentials = require('./credentials');
module.exports.roles = require('./roles');
module.exports.policies = require('./policies');
// all API are exported with the respect of a root of natural REST URIs
