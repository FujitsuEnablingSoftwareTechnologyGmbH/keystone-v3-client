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
