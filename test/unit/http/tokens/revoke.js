var _ = require('lodash'),
  sinon = require('sinon'),
  should = require('should'),
  nock = require('nock'),
  uris = require('../../../../lib/util/uris'),
  mocks = require('../../../util/mocks');

module.exports = function (settings) {
  var keystoneUrl = settings.url,
    keystoneToken = settings.token,
    tokensApiSettings = {
      url: keystoneUrl
    },
    tokensApi,
    api;

  return function () {
    beforeEach(function () {
      tokensApi = require('../../../../lib/keystone').tokens(tokensApiSettings);
      api = mocks.mockedKeystoneServer({
        url    : keystoneUrl,
        headers: {
          'X-Auth-Token'   : keystoneToken,
          'X-Subject-Token': keystoneToken
        }
      });
    });
    afterEach(nock.cleanAll);

    var errorCodes = [400, 401, 403, 405, 413, 503, 404];

    it('should successfully delete token', function (done) {
      // set up
      var success = sinon.spy(),
        failure = sinon.spy();
      // set up

      // prepare server
      api.delete(uris.tokens)
        .reply(204);
      // prepare server

      // check it out
      tokensApi
        .revoke({
          headers: {
            'X-Auth-Token'   : keystoneToken,
            'X-Subject-Token': keystoneToken
          }
        })
        .then(success, failure)
        .finally(function () {
          should(success.called).be.eql(true);
          should(failure.called).be.eql(false);

          should(success.calledWith({
            statusCode: 204,
            headers   : {}
          })).be.eql(true);

          should(api.isDone()).be.eql(true);
          done();
        });

      // not finished here
      should(api.isDone()).be.eql(false);
    });

    _.forEachRight(errorCodes, function (errorCode) {
      it('should fail for following code ' + errorCode, function (done) {
        var success = sinon.spy(),
          failure = sinon.spy();

        api.delete(uris.tokens)
          .reply(errorCode);

        tokensApi
          .revoke({
            headers: {
              'X-Auth-Token'   : keystoneToken,
              'X-Subject-Token': keystoneToken
            }
          })
          .then(success, failure)
          .finally(function () {
            should(success.called).be.eql(false);
            should(failure.called).be.eql(true);

            should(failure.calledWith({
              headers: {},
              statusCode: errorCode
            })).be.eql(true);

            should(api.isDone()).be.eql(true);
            nock.cleanAll();
            done();
          });
      });
    });
  };

};