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
      .readFileSync(__dirname + '/update.json')
      .toString()),
    errorCodes = [400, 401, 403, 405, 413, 503, 404],
    endpointId = '0ede75d9189e4d0095f7108bf404c70b';

  return function () {
    beforeEach(setUp);
    afterEach(nock.cleanAll);

    it('should correctly update endpoint', shouldUpdateEndpoint);
    _.forEachRight(errorCodes, function (errorCode) {
      it('should fail for following code ' + errorCode, shouldFailForCode(errorCode));
    });

  };

  function shouldUpdateEndpoint(done) {
    var success = sinon.spy(),
      failure = sinon.spy(),
      responseBody = dataFile.response;

    api.patch(uris.endpoints + '/' + endpointId, dataFile.request)
      .reply(200, responseBody);

    endpointsApi
      .update({
        params: {
          endpoint_id: endpointId
        },
        token : keystoneToken,
        data  : dataFile.request
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
      })
      .done(done);
  }

  function shouldFailForCode(errorCode) {
    return function (done) {
      var success = sinon.spy(),
        failure = sinon.spy(),
        responseBody = mocks.getResponseBodyForErrorCase(errorCode, 'UpdateEndpoint');

      api.patch(uris.endpoints + '/' + endpointId, dataFile.request)
        .reply(errorCode, responseBody);

      endpointsApi
        .update({
          params: {
            endpoint_id: endpointId
          },
          token : keystoneToken,
          data  : dataFile.request
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
