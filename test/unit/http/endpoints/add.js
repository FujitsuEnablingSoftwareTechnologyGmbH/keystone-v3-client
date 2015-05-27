var _ = require('lodash'),
  sinon = require('sinon'),
  should = require('should'),
  nock = require('nock'),
  uris = require('../../../../lib/util/uris'),
  mocks = require('../../../util/mocks');

module.exports = function (settings) {
  var keystoneUrl = settings.url,
    keystoneToken = settings.token,
    apiSettings = {
      url: keystoneUrl
    },
    endpointsApi,
    api,
    dataFile = JSON.parse(require('fs')
      .readFileSync(__dirname + '/add.json')
      .toString()),
    errorCodes = [
      400, 401, 403, 405, 413, 503, 404
    ];

  return function () {
    beforeEach(setUp);
    afterEach(nock.cleanAll);

    it('should add new endpoint', shouldAddNewEndpoint);
    _.forEachRight(errorCodes, function (errorCode) {
      it('should fail for following code ' + errorCode, shouldFailForCode(errorCode));
    });

  };

  function shouldFailForCode(errorCode) {
    return function (done) {
      var success = sinon.spy(),
        failure = sinon.spy(),
        responseBody = mocks.getResponseBodyForErrorCase(errorCode, 'AddEndpoint');

      api.post(uris.endpoints, dataFile.request)
        .reply(errorCode, responseBody);

      endpointsApi
        .add({
          token: keystoneToken,
          data : dataFile.request
        })
        .then(success, failure)
        .finally(function () {
          should(success.called).be.eql(false);
          should(failure.called).be.eql(true);

          should(failure.calledWith({
            data      : responseBody,
            statusCode: errorCode,
            headers   : {
              'content-type': 'application/json'
            }
          })).be.eql(true);

          should(api.isDone()).be.eql(true);
        })
        .done(done);
    };
  }

  function shouldAddNewEndpoint(done) {
    var success = sinon.spy(),
      failure = sinon.spy();

    api.post(uris.endpoints, dataFile.request)
      .reply(201, dataFile.response);

    endpointsApi
      .add({
        token: keystoneToken,
        data : dataFile.request
      })
      .then(success, failure)
      .finally(function () {
        should(success.called).be.eql(true);
        should(failure.called).be.eql(false);

        should(success.calledWith({
          data      : dataFile.response,
          statusCode: 201,
          headers   : {
            'content-type': 'application/json'
          }
        })).be.eql(true);

        should(api.isDone()).be.eql(true);
      })
      .done(done);
  }

  function setUp() {
    endpointsApi = require('../../../../lib/keystone').endpoints(apiSettings);
    api = mocks.mockedKeystoneServer({
      url    : keystoneUrl,
      headers: {
        'X-Auth-Token': keystoneToken
      }
    });
  }
};
