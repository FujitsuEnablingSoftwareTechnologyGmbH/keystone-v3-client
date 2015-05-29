var _ = require('lodash'),
  sinon = require('sinon'),
  should = require('should'),
  nock = require('nock'),
  uris = require('../../../../lib/util/uris'),
  mocks = require('../../../util/mocks');

module.exports = function (settings) {
  var keystoneUrl = settings.url,
    keystoneToken = settings.token,
    credentialId = '06a050f20a7d0e8ce128f8c43cdeaaaa0f7ee7f67b4c8e51fed10726919b44f5',
    credentialsApi,
    server,
    errorCodes = [
      400, 401, 403, 405, 413, 503, 404
    ];

  return function () {
    beforeEach(setUp);
    afterEach(nock.cleanAll);

    it('should remove single credential correctly', shouldRemoveOne);
    _.forEachRight(errorCodes, function (errorCode) {
      it(
        'should fail for following code ' + errorCode,
        shouldFailForCode(errorCode)
      );
    });
  };

  function shouldRemoveOne(done) {
    var success = sinon.spy(),
      failure = sinon.spy();

    server
      .delete(uris.credentials + '/' + credentialId)
      .reply(204);

    credentialsApi
      .remove({
        token : keystoneToken,
        params: {
          credential_id: credentialId
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

        should(server.isDone()).be.eql(true);
      })
      .done(done);
  }

  function shouldFailForCode(errorCode) {
    return function (done) {
      var success = sinon.spy(),
        failure = sinon.spy();

      server
        .delete(uris.credentials + '/' + credentialId)
        .reply(errorCode);

      credentialsApi
        .remove({
          token : keystoneToken,
          params: {
            credential_id: credentialId
          }
        })
        .then(success, failure)
        .finally(function () {
          should(success.called).be.eql(false);
          should(failure.called).be.eql(true);

          should(failure.calledWith({
            statusCode: errorCode,
            headers   : {}
          })).be.eql(true);

          should(server.isDone()).be.eql(true);
        })
        .done(done);
    };
  }

  function setUp() {
    credentialsApi = require('../../../../lib/keystone').credentials(settings);
    server = mocks.mockedKeystoneServer({
      url    : keystoneUrl,
      headers: {
        'X-Auth-Token': keystoneToken
      }
    });
  }
};
