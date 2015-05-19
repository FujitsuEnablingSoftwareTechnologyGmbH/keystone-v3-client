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
