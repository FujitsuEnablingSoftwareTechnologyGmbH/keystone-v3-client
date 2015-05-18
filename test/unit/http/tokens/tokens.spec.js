var _ = require('lodash'),
  should = require('should'),
  sinon = require('sinon'),
  uris = require('../../../../lib/util/uris'),
  mocks = require('../../../util/mocks');

describe('http:tokens', function () {
  var settings = {
    token: 'be3d0c18bbf44379b2b797c63c9d0e74',
    url  : 'http://www.keystone_instance.org/'
  };

  context('authenticate', require('./authenticate')(settings));
  context('validate', require('./validate')(settings));
  context('check', require('./check')(settings));
  context('revoke', require('./revoke')(settings));

});
