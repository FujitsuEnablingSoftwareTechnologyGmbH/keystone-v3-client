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
    apiSettings = {
      url: keystoneUrl
    },
    endpointsApi,
    api,
    errorCodes = [400, 401, 403, 405, 413, 503, 404],
    endpointId = '0ede75d9189e4d0095f7108bf404c70b';

  return function () {
    beforeEach(setUp);
    afterEach(nock.cleanAll);

    it('should correctly remove endpoint', shouldRemoveEndpoint);
    _.forEachRight(errorCodes, function (errorCode) {
      it('should fail for following code ' + errorCode, shouldFailForCode(errorCode));
    });

  };

  function shouldRemoveEndpoint(done) {
    var success = sinon.spy(),
      failure = sinon.spy();

    api.delete(uris.endpoints + '/' + endpointId).reply(204);

    endpointsApi
      .remove({
        params: {
          endpoint_id: endpointId
        },
        token : keystoneToken
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
      })
      .done(done);
  }

  function shouldFailForCode(errorCode) {
    return function (done) {
      var success = sinon.spy(),
        failure = sinon.spy();

      api.delete(uris.endpoints + '/' + endpointId)
        .reply(errorCode);

      endpointsApi
        .remove({
          params: {
            endpoint_id: endpointId
          },
          token : keystoneToken
        })
        .then(success, failure)
        .finally(function () {
          should(success.called).be.eql(false);
          should(failure.called).be.eql(true);

          should(failure.calledWith({
            statusCode: errorCode,
            headers   : {}
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
