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
  proxyquire = require('proxyquire'),
  should = require('should'),
  sinon = require('sinon'),
  Promise = require('bluebird');

describe('util:request', function () {

  context('noParamRequest', function () {
    var request,
      testApi,
      method,
      uri = '/a/b',
      restler,
      restRequestStub;

    beforeEach(function () {
      restler = _.cloneDeep(require('restler'));
      restRequestStub = sinon.stub(restler, 'request');

      request = _.cloneDeep(proxyquire('../../../lib/util/request', {
        'restler': restler
      }));
      sinon.spy(request, 'noParamRequest');

      method = request.method.GET;
    });

    afterEach(function () {
      request = undefined;
      restRequestStub = undefined;
      restler.request.restore();
    });

    function TestApi() {
      this.settings = {
        url: 'http://test.org'
      };
    }

    beforeEach(function () {
      TestApi.prototype = {
        foo: request.noParamRequest(method, uri)
      };
      testApi = new TestApi();
      sinon.spy(testApi, 'foo');
    });

    afterEach(function () {
      testApi = undefined;
    });

    it('should properly manufacture method', function () {
      var requestMethod = request.noParamRequest(method, uri);

      // check noParamRequest
      should(request.noParamRequest.calledWith(method, uri)).eql(true);

      // check if we got a function
      should(requestMethod).be.type('function');
    });

    it('should execute correctly for valid params', function () {
      var eventToMethod = {},
        successOnPromise = sinon.spy(),
        failureOnPromise = sinon.spy();
      restRequestStub
        .returns({
          on: function (event, method) {
            eventToMethod[event] = method;
            return this;
          }
        });

      var promise = testApi.foo({
        headers: {
          'X-Auth-Token': 'A token'
        }
      });

      // returned value is a promise
      should(promise).be.an.instanceOf(Promise);
      promise.then(successOnPromise, failureOnPromise);

      // collected 3 listeners to be transformed into promises
      should(eventToMethod).have.properties(['success', 'fail', 'error']);
      _.forEachRight(eventToMethod, function (method) {
        should(method).be.type('function');
      });

    });
  });

  context('paramRequest', function () {
    var request,
      testApi,
      method,
      url = '/a/${param_1}/b/${param_2}',
      restler,
      restRequestStub;

    beforeEach(function () {
      restler = _.cloneDeep(require('restler'));
      restRequestStub = sinon.stub(restler, 'request');

      request = _.cloneDeep(proxyquire('../../../lib/util/request', {
        'restler': restler
      }));
      sinon.spy(request, 'paramRequest');

      method = request.method.GET;
    });

    afterEach(function () {
      request = undefined;
      restRequestStub = undefined;
      restler.request.restore();
    });

    function TestApi() {
      this.settings = {
        url: 'http://test.org'
      };
    }

    beforeEach(function () {
      TestApi.prototype = {
        foo: request.paramRequest(method, url)
      };
      testApi = new TestApi();
      sinon.spy(testApi, 'foo');
    });

    afterEach(function () {
      testApi = undefined;
    });

    it('should properly manufacture method', function () {
      var requestMethod = request.paramRequest(method, url);

      // check noParamRequest
      should(request.paramRequest.calledWith(method, url)).eql(true);

      // check if we got a function
      should(requestMethod).be.type('function');
    });

    it('should throw error for missing params key in data', function () {
      (function () {
        testApi.foo({});
      }).should.throw('Detected that method specify URI params, but failed to find any in data.params');
    });

    it('should throw error for missing params in data.params', function () {
      (function () {
        testApi.foo({
          params: {
            param_1: 1
          }
        });
      }).should.throw('param_2 not found in data.params although specified in URI');
    });

    it('should execute correctly for valid params', function () {
      var eventToMethod = {},
        successOnPromise = sinon.spy(),
        failureOnPromise = sinon.spy();
      restRequestStub
        .returns({
          on: function (event, method) {
            eventToMethod[event] = method;
            return this;
          }
        });

      var promise = testApi.foo({
        params : {
          param_1: 1,
          param_2: 2
        },
        headers: {
          'X-Auth-Token': 'A token'
        }
      });

      // returned value is a promise
      should(promise).be.an.instanceOf(Promise);
      promise.then(successOnPromise, failureOnPromise);

      // collected 3 listeners to be transformed into promises
      should(eventToMethod).have.properties(['success', 'fail', 'error']);
      _.forEachRight(eventToMethod, function (method) {
        should(method).be.type('function');
      });

    });
  });

  context('paramParsing', function () {
    var request;

    beforeEach(function () {
      request = _.cloneDeep(require('../../../lib/util/request'));
      sinon.spy(request, 'noParamRequest');
      sinon.spy(request, 'paramRequest');
    });

    afterEach(function () {
      request = undefined;
    });

    it('should properly extract param names from URI', function () {
      var testUri = '/this/is/test/${uri}/from/${source}/${long_uri}',
        expectedUriNames = ['uri', 'source', 'long_uri'];

      var uriNames = request.uriParams(testUri);

      should(expectedUriNames).be.eql(uriNames);
    });

  });

});