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
        url  : settings.url,
        token: settings.url
      });
    });
    afterEach(function () {
      require('nock').cleanAll();
    });

    var dataFile = JSON.parse(require('fs')
        .readFileSync(__dirname + '/authenticate.json')
        .toString()),
      requestBody = dataFile.request,
      responseBody = dataFile.response,
      errorCodes = [400, 401, 403, 405, 413, 503, 404];

    it('should authenticate user for password authentication', function () {
      // set up
      var success = sinon.spy(),
        failure = sinon.spy();
      // set up

      // prepare server
      api.post(uris.tokens, requestBody)
        .reply(201, responseBody);
      // prepare server

      // check it out
      tokensApi
        .authenticate({
          token: keystoneToken,
          data : requestBody
        })
        .then(success, failure)
        .finally(function () {
          should(success.called).be.eql(true);
          should(failure.called).be.eql(false);

          should(success.calledWith({
            data      : responseBody,
            statusCode: 201
          })).be.eql(true);

          should(api.isDone()).be.eql(true);
        });

      // not finished here
      should(api.isDone()).be.eql(false);
    });

    _.forEachRight(errorCodes, function (errorCode) {
      it('should fail for following code ' + errorCode, function () {
        var success = sinon.spy(),
          failure = sinon.spy(),
          responseBody = mocks.getResponseBodyForErrorCase(errorCode, 'Authenticate');

        var tmpApi = api.post(uris.tokens, requestBody);
        if (errorCode / 500 >= 1.0) {
          tmpApi.replyWithError(JSON.stringify(responseBody));
        } else {
          tmpApi.reply(errorCode, JSON.stringify(responseBody));
        }

        tokensApi
          .authenticate({
            token: keystoneToken,
            data : requestBody
          })
          .then(success, failure)
          .finally(function () {
            should(success.called).be.eql(false);
            should(failure.called).be.eql(true);

            should(failure.calledWith({
              data      : responseBody,
              statusCode: errorCode
            })).be.eql(true);

            should(api.isDone()).be.eql(true);
            require('nock').cleanAll();
          });
      });
    });
  };

};
