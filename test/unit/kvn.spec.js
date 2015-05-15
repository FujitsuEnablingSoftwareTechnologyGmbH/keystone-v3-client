var proxyquire = require('proxyquire'),
  _ = require('lodash'),
  Promise = require('bluebird'),
  should = require('should'),
  sinon = require('sinon');

describe('kvn:spec', function () {
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
    kvn = proxyquire('../../lib/kvn', {
      './keystone': apiConstructorMap
    });
    api = kvn(settings);
  });

  afterEach(function () {
    api = {};
  });

  it('should create KeystoneClient with all sub apis', function () {
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

  });

  it('should not keep global state', function () {
    var api2 = kvn(settings);
    (api2).should.not.equal(api);
  });

  it('should fail-fast if any sub-api threw error', function () {
    var localConstructorMap = _.clone(apiConstructorMap),
      api2;

    localConstructorMap.tokens = function () {
      throw new Error('Chi-Chang')
    };

    (function () {
      api2 = proxyquire('../../lib/kvn', {
        './keystone': localConstructorMap
      })(settings);
    }).should.throw();

    /*jshint expr: true*/
    should(api2).not.be.ok;
  });
});