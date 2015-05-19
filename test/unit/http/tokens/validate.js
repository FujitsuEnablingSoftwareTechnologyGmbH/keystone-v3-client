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

    var dataFile = JSON.parse(require('fs')
        .readFileSync(__dirname + '/validate.json')
        .toString()),
      responseBody = dataFile.response,
      errorCodes = [400, 401, 403, 405, 413, 503, 404];

    it('should validate token correctly', function (done) {
      // set up
      var success = sinon.spy(),
        failure = sinon.spy();
      // set up

      // prepare server
      api.get(uris.tokens)
        .reply(200, responseBody);
      // prepare server

      tokensApi
        .validate({
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
            data      : responseBody,
            statusCode: 200,
            headers   : {
              'content-type': 'application/json'
            }
          })).be.eql(true);

          should(api.isDone()).be.eql(true);
          done();
        });
    });

    _.forEachRight(errorCodes, function (errorCode) {
      it('should fail for following code ' + errorCode, function (done) {
        var success = sinon.spy(),
          failure = sinon.spy(),
          responseBody = mocks.getResponseBodyForErrorCase(errorCode, 'Validate');

        api.get(uris.tokens).reply(errorCode, JSON.stringify(responseBody));

        tokensApi
          .validate({
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
              data      : responseBody,
              statusCode: errorCode,
              headers   : {}
            })).be.eql(true);

            should(api.isDone()).be.eql(true);
            nock.cleanAll();

            done();
          });
      });
    });
  };

};
