var _ = require('lodash'),
  sinon = require('sinon'),
  should = require('should'),
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
    afterEach(function () {
      require('nock').cleanAll();
    });

    var errorCodes = [400, 401, 403, 405, 413, 503, 404];

    it('should successfully check token', function () {
      // set up
      var success = sinon.spy(),
        failure = sinon.spy();
      // set up

      // prepare server
      api.head(uris.tokens)
        .reply(204);
      // prepare server

      // check it out
      tokensApi
        .check({
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
            statusCode: 204
          })).be.eql(true);

          should(api.isDone()).be.eql(true);
        });

      // not finished here
      should(api.isDone()).be.eql(false);
    });

    _.forEachRight(errorCodes, function (errorCode) {
      it('should fail for following code ' + errorCode, function () {
        var success = sinon.spy(),
          failure = sinon.spy();

        api.head(uris.tokens)
          .reply(errorCode);

        tokensApi
          .check({
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

              statusCode: errorCode
            })).be.eql(true);

            should(api.isDone()).be.eql(true);
            require('nock').cleanAll();
          });
      });
    });
  };

};
