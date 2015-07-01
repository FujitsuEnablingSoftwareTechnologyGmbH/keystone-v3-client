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
  should = require('should');

describe('keystone:index', function () {
  var keystone,
    apis = [
      'tokens', 'service_catalog', 'endpoints',
      'domains', 'projects', 'users',
      'groups', 'credentials', 'roles',
      'policies'
    ];

  beforeEach(function () {
    keystone = require('../../../lib/keystone');
  });

  it('should export following APIs: ' + apis.toString(), function () {
    /*jshint expr: true*/
    should(keystone).be.ok;
    should(keystone).have.keys(apis);
  });

  it('should wrap all APIs as function constructors', function () {
    var instanceOfVal;
    _.forEach(keystone, function (val, key) {
      (val).should.be.type('function', key + ' does not have related constructor function');
      (val).should.not.have.property('settings', key + ' should not have settings before instantiating');

      // for sub-api created with fn() it should have settings property
      instanceOfVal = val();
      (instanceOfVal).should.have.property('settings');

      // for sub-api created with new fn() it should have settings property
      instanceOfVal = new val();
      (instanceOfVal).should.have.property('settings');
    });
  });
});
