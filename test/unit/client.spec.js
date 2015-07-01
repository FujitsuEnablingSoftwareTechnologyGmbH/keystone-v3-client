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
    _ = require('lodash'),
    should = require('should');

describe('lib/client', function () {

    context('creation', function () {
        var apiConstructorMap = {
                tokens         : MockSubApiCtr,
                service_catalog: MockSubApiCtr,
                endpoints      : MockSubApiCtr,
                domains        : MockSubApiCtr,
                projects       : MockSubApiCtr,
                users          : MockSubApiCtr,
                groups         : MockSubApiCtr,
                credentials    : MockSubApiCtr,
                roles          : MockSubApiCtr,
                policies       : MockSubApiCtr
            },
            settings = {
                url: 'http://www.example.org' // required
            },
            kvn,
            api = {};

        function MockSubApiCtr(settings) {
            // better to hide new even here, this is how sub api are going to be written anyway
            if (!(this instanceof MockSubApiCtr)) {
                return new MockSubApiCtr(settings);
            }
            this._created = true;
            this.settings = settings;
        }

        beforeEach(function () {
            kvn = proxyquire('../../lib/client', {
                './keystone': apiConstructorMap
            });
            api = kvn(settings);
        });

        afterEach(function () {
            api = {};
        });

        it('should create KeystoneClient with all sub apis', function (done) {
            var size = _(api).size(),
                expectedSize = _(apiConstructorMap).size();

            (size).should.equal(expectedSize);
            _.forEachRight(api, function (instance) {
                (instance).should.be.type('object');
                (instance).should.be.an.instanceof(MockSubApiCtr);

                // just check if Ctr kicked off
                (instance).should.have.property('_created', true);
                (instance).should.have.property('settings');
            });

            done();
        });

        it('should not keep global state', function (done) {
            var api2 = kvn(settings);
            (api2).should.not.equal(api);

            done();
        });

        it('should fail-fast if any sub-api threw error', function (done) {
            var localConstructorMap = _.clone(apiConstructorMap),
                api2;

            localConstructorMap.tokens = function () {
                throw new Error('Chi-Chang');
            };

            (function () {
                api2 = proxyquire('../../lib/kvn', {
                    './keystone': localConstructorMap
                })(settings);

                /*jshint expr: true*/
                should(api2).not.be.ok;
            }).should.throw();

            done();
        });
    });

    context('error checkup', function () {
        it('should fail if settings.username but !settings.password', function (done) {
            (function () {
                var settings = {
                    username: 'test'
                };

                proxyquire('../../lib/client', {
                    './keystone': {}
                })(settings);
            }).should.throw('If username is provided you also need to provide password');

            done();
        });

        it('should fail for !settings.url', function (done) {
            (function () {
                var settings = {};

                proxyquire('../../lib/client', {
                    './keystone': {}
                })(settings);
            }).should.throw('Url to keystone is missing');

            done();
        });

        it('should log & rethrow error if such happened in API init', function (done) {

            var settings = {
                    url: 'http://keystone.url'
                },
                error = new Error('1234'),
                mockApiName = 'test',
                mockApi = {};

            mockApi[mockApiName] = function ErrorCtr() {
                if (!(this instanceof ErrorCtr)) {
                    return new ErrorCtr();
                }
                throw error;
            };

            (function () {
                proxyquire('../../lib/client', {
                    './keystone': mockApi
                })(settings);
            }).should.throw('Error when initializing ' + mockApiName);

            done();
        });
    });

});
