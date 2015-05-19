var _ = require('lodash'),
  should = require('should');

describe('keystone:index', function () {
  var keystone,
    apis = [
      'tokens', 'service_catalog', 'endpoints',
      'domains', 'projects', 'users',
      'groups', 'credentials', 'roles',
      'policies'
    ];

  beforeEach(function () {
    keystone = require('../../../lib/keystone');
  });

  it('should export following APIs: ' + apis.toString(), function () {
    /*jshint expr: true*/
    should(keystone).be.ok;
    should(keystone).have.keys(apis);
  });

  it('should wrap all APIs as function constructors', function () {
    var instanceOfVal;
    _.forEach(keystone, function (val, key) {
      (val).should.be.type('function', key + ' does not have related constructor function');
      (val).should.not.have.property('settings', key + ' should not have settings before instantiating');

      // for sub-api created with fn() it should have settings property
      instanceOfVal = val();
      (instanceOfVal).should.have.property('settings');

      // for sub-api created with new fn() it should have settings property
      instanceOfVal = new val();
      (instanceOfVal).should.have.property('settings');
    });
  });
});
