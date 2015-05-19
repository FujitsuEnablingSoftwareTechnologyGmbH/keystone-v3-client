var sinon = require('sinon'),
  should = require('should'),
  _ = require('lodash'),
  Promise = require('bluebird'),
  proxyquire = require('proxyquire'),
  crypto = require('crypto');

describe('tokens:service', function () {
  var CACHE_ENABLED = true,
    CACHE_DISABLED = false;

  describe('without caching', testSuite(CACHE_DISABLED));
  describe('with caching', testSuite(CACHE_ENABLED));

  function testSuite(cacheEnabled) {
    return function () {
      var tokenCache,
        TokenService, // constructor
        tokenService, // and baby instance
        servicesUtil,
        tokens = {
          authToken   : 'be3d0c18bbf44379b2b797c63c9d0e74',
          subjectToken: 'be3d0c18bbf44379b2b797c63c9d0e74'
        },
        settings = {
          url        : 'http://www.keystone.spec.org/',
          tokensCache: {
            cache: cacheEnabled
          }
        },
        tokensApi;

      beforeEach(setUp);
      afterEach(tearDown);

      context('isTokenExpired::cache[' + cacheEnabled + ']', isTokenExpired);
      context('validateToken::cache[' + cacheEnabled + ']', validateToken);
      context('refreshToken::cache[' + cacheEnabled + ']', refreshToken);

      function refreshToken() {
        var authenticateStub,
          randomToken;

        beforeEach(function () {
          authenticateStub = sinon.stub(tokensApi, 'authenticate');
          randomToken = '32423423423423423';
        });
        afterEach(function () {
          authenticateStub.restore();
        });

        it('should reject immediately if token has not been authenticated/validated', function (done) {
          var getStub = tokenCache.get.returns(undefined),
            errorSpied = sinon.spy();

          tokenService
            .refreshToken(randomToken)
            .error(errorSpied)
            .finally(function () {
              var error;

              should(errorSpied.called).be.eql(true);

              error = errorSpied.getCall(0).args[0];

              should(error)
                .be.type('object')
                .and.have.property('message');

              should(error.message).be.eql('Cannot refresh token ' +
                randomToken +
                ', either validate or authenticate it first');
            })
            .done(function () {
              getStub.restore();
              done();
            });

        });

        it('should try to refresh token if token in cache', function (done) {
          var tokenData = {},
            getStub = tokenCache.get.returns(tokenData);

          authenticateStub.returns(Promise.reject());

          tokenService
            .refreshToken(randomToken)
            .finally(function () {
              should(authenticateStub.called).be.eql(true);
            })
            .done(function () {
              getStub.restore();
              done();
            });
        });

        it('should remove old token and put new token if successfully refreshed', function (done) {
          var newToken = '33333333333333',
            newTokenData = {},
            getStub,
            fullfilledHandler = sinon.spy(),
            response = {
              headers: {
                'X-Subject-Token': newToken
              },
              data   : {
                token: newTokenData
              }
            };

          // setup stubs
          getStub = tokenCache.get.returns(randomToken);
          authenticateStub.returns(Promise.resolve(response));

          tokenService
            .refreshToken(randomToken)
            .then(fullfilledHandler)
            .finally(function () {

              should(fullfilledHandler.called).be.eql(true);
              should(fullfilledHandler.calledWith(newToken)).be.eql(true);

              should(tokenCache.del.called).be.eql(true);
              should(tokenCache.del.calledWith(randomToken)).be.eql(true);

              should(tokenCache.put.called).be.eql(true);
              should(tokenCache.put.calledWith(newToken, newTokenData, sinon.match.any)).be.eql(true);
            })
            .done(function () {
              getStub.restore();
              done();
            });

        });
      }

      function validateToken() {
        // in progress
      }

      function isTokenExpired() {
        var fakeResponse,
          fakeData,
          fakeHeaders,
          isTokenExpiredCB,
          checkStub;

        beforeEach(function () {
          checkStub = sinon.stub(tokensApi, 'check');
        });

        afterEach(function () {
          checkStub.restore();
        });

        it('should resolve with false if token not expired', function (done) {
          isTokenExpiredCB = sinon.spy();
          fakeResponse = {
            headers   : fakeHeaders,
            data      : fakeData,
            statusCode: 204
          };

          checkStub.returns(Promise.resolve(fakeResponse));

          tokenService
            .isTokenExpired(tokens.authToken, tokens.subjectToken)
            .then(isTokenExpiredCB)
            .finally(checkSpies)
            .finally(checkTokenCache)
            .done(done);

          function checkSpies() {
            should(isTokenExpiredCB.called).be.eql(true);
            should(isTokenExpiredCB.calledWith(false)).be.eql(true);
          }

          function checkTokenCache() {
            should(tokenCache.put.called).be.eql(false);
            should(tokenCache.get.called).be.eql(false);
            should(tokenCache.has.called).be.eql(false);
            should(tokenCache.del.called).be.eql(false);
          }

        });

        it('should resolve with true if token has expired', function (done) {
          isTokenExpiredCB = sinon.spy();

          fakeResponse = new Error();
          fakeResponse.statusCode = 404;

          checkStub.returns(Promise.reject(fakeResponse));

          tokenService
            .isTokenExpired(tokens.authToken, tokens.subjectToken)
            .then(isTokenExpiredCB)
            .finally(checkSpies)
            .finally(checkTokenCache)
            .done(done);

          function checkSpies() {
            should(isTokenExpiredCB.called).be.eql(true);
            should(isTokenExpiredCB.calledWith(true)).be.eql(true);
          }

          function checkTokenCache() {
            should(tokenCache.put.called).be.eql(false);
            should(tokenCache.get.called).be.eql(false);
            should(tokenCache.has.called).be.eql(false);
            should(tokenCache.del.called).be.eql(true); // token expired in this case so this will be true
          }
        });
      }

      function setUp() {
        // spy tokenCache
        tokenCache = _.clone(require('../../../lib/services/tokens.cache')(settings));
        sinon.stub(tokenCache);

        // stub getApi to always retrieve fresh version of tokensApi
        servicesUtil = require('../../../lib/util/services');
        sinon.stub(servicesUtil, 'getApi', function () {
          return tokensApi = require('../../../lib/keystone/tokens')(settings);
        });

        TokenService = proxyquire('../../../lib/services/tokens', {
          '../util/services': servicesUtil,
          './tokens.cache'  : _.constant(tokenCache) // spied tokenCache into TokenService
        });
        tokenService = TokenService(settings);
      }

      function tearDown() {
        servicesUtil.getApi.restore();
      }
    };

  }

});
