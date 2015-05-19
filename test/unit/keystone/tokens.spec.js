var should = require('should'),
  mocks = require('../../util/mocks');

describe('keystone:api:tokens', function () {

  var tokensApi;

  beforeEach(function () {
    tokensApi = mocks.mockedKeystoneApi('tokens');
  });

  context('prototype:check', function () {
    var expectedMethods = ['authenticate', 'validate', 'check', 'revoke'];

    it('should provide 4 methods > ' + expectedMethods.toString(), function () {
      (tokensApi.prototype).should.have.keys(expectedMethods);
    });
  });

  context('functionality:check', function () {

    it('without new', function () {
      var instance = tokensApi();

      /*jshint expr: true*/
      (instance).should.be.ok;
      (instance).should.be.type('object');
      (instance).should.have.property('settings');
    });

    it('with new', function () {
      var instance = new tokensApi();

      /*jshint expr: true*/
      (instance).should.be.ok;
      (instance).should.be.type('object');
      (instance).should.have.property('settings');
    });
  });

});
