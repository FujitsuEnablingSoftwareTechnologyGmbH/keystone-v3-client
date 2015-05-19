var should = require('should');

describe('uris:spec', function () {

  var uris = require('../../../lib/util/uris');

  it('should have all endpoints uris defined', function () {
    var expectedEndpoints = [
      'info',
      'tokens',
      'service_catalog',
      'endpoints',
      'domains',
      'projects',
      'users',
      'groups',
      'credentials',
      'roles',
      'policies'
    ];

    /*jshint expr: true*/
    should(uris).have.keys(expectedEndpoints);
  });

});
