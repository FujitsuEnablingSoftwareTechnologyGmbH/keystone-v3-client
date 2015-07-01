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

var proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  nock = require('nock'),
  should = require('should'),
  utils = require('../../lib/utils'),
  fs = require('fs');

module.exports = {
  mockedKeystoneApi          : mockedKeystoneApi,
  mockedKeystoneServer       : mockedKeystoneServer,
  getResponseBodyForErrorCase: getResponseBodyForErrorCase,
  loadRRFile                 : loadRRFile
};

function loadRRFile(file) {
  return JSON.parse(
    fs.readFileSync(file).toString()
  );
}

function mockedKeystoneServer(opt) {
  var headers = opt.headers || {};
  headers = utils.mixin({
    'X-Auth-Token': headers.token || opt.token,
    'Content-Type': 'application/json'
  }, headers);

  return nock(opt.url, {reqheaders: headers});
}

function mockedKeystoneApi(name) {
  return proxyquire('../../lib/keystone/' + name, {
    '../../util/request': {
      method        : {
        GET   : 'get',
        POST  : 'post',
        DELETE: 'delete',
        PATCH : 'patch',
        PUT   : 'put',
        HEAD  : 'head'
      },
      noParamRequest: sinon.spy(),
      paramRequest  : sinon.spy()
    }
  });
}

function getResponseBodyForErrorCase(errorCode, contextName) {
  return {
    error: {
      message: contextName + ' :: I made an error using code ' + errorCode,
      code   : errorCode,
      title  : contextName + ' :: An error title'
    }
  };
}
