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

var forEach = require('lodash/forEachRight'),
  keys = require('lodash/keys'),
  should = require('should');

describe('index:services', function () {

  var services = ['tokens'],
    index;

  beforeEach(function () {
    index = require('../../../lib/services');
  });

  it('should export following services ' + services.toString(), function () {
    should(index).have.keys(services);
  });

  it('should be able to instantiate following services ' + services.toString(), function () {
    var settings = {
        url: 'mocked url'
      },
      instance;
    forEach(index, function (ctr) {
      instance = ctr(settings);
      should(instance).be.type('object');
      should(instance).have.properties(['api', 'settings']);
    });
  });

});
