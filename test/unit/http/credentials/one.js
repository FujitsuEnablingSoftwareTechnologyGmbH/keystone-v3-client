/*
 * Copyright 2015 FUJITSU LIMITED
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

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
    dataFile = mocks.loadRRFile(__dirname + '/one.json'),
    errorCodes = [
      400, 401, 403, 405, 413, 503, 404
    ];

  return function () {
    beforeEach(setUp);
    afterEach(nock.cleanAll);

    it('should retrieve single credential correctly', shouldGetOne);
    _.forEachRight(errorCodes, function (errorCode) {
      it(
        'should fail for following code ' + errorCode,
        shouldFailForCode(errorCode)
      );
    });
  };

  function shouldGetOne(done) {
    var success = sinon.spy(),
      failure = sinon.spy();

    server
      .get(uris.credentials + '/' + credentialId)
      .reply(200, dataFile.response);

    credentialsApi
      .one({
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
          data      : dataFile.response,
          statusCode: 200,
          headers   : {
            'content-type': 'application/json'
          }
        })).be.eql(true);

        should(server.isDone()).be.eql(true);
      })
      .done(done);
  }

  function shouldFailForCode(errorCode) {
    return function (done) {
      var success = sinon.spy(),
        failure = sinon.spy(),
        responseBody = mocks.getResponseBodyForErrorCase(errorCode, 'SingleCredential');

      server
        .get(uris.credentials + '/' + credentialId)
        .reply(errorCode, responseBody);

      credentialsApi
        .one({
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
            data      : responseBody,
            statusCode: errorCode,
            headers   : {
              'content-type': 'application/json'
            }
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
