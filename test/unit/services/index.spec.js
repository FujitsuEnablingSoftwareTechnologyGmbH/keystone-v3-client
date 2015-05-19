var forEach = require('lodash/collection/forEachRight'),
  keys = require('lodash/object/keys'),
  should = require('should');

describe('index:services', function () {

  var services = ['tokens'],
    index;

  beforeEach(function () {
    index = require('../../../lib/services');
  });

  it('should exports following services ' + services.toString(), function () {
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
