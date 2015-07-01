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
    credentialsApi,
    server,
    dataFile = JSON.parse(require('fs')
      .readFileSync(__dirname + '/add.json')
      .toString()),
    errorCodes = [
      400, 401, 403, 405, 413, 503, 404
    ];

  return function () {
    beforeEach(setUp);
    afterEach(nock.cleanAll);

    it('should add new credential', shouldAddNewCredential);
    _.forEachRight(errorCodes, function (errorCode) {
      it('should fail for following code ' + errorCode, shouldFailForCode(errorCode));
    });
  };

  function shouldAddNewCredential(done) {
    var success = sinon.spy(),
      failure = sinon.spy();

    server.post(uris.credentials, dataFile.request)
      .reply(201, dataFile.response);

    credentialsApi
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

        should(server.isDone()).be.eql(true);
      })
      .done(done);
  }

  function shouldFailForCode(errorCode) {
    return function (done) {
      var success = sinon.spy(),
        failure = sinon.spy(),
        responseBody = mocks.getResponseBodyForErrorCase(errorCode, 'AddCredentials');

      server.post(uris.credentials, dataFile.request)
        .reply(errorCode, responseBody);

      credentialsApi
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
