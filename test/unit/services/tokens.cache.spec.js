var sinon = require('sinon'),
  should = require('should'),
  _ = require('lodash'),
  proxyquire = require('proxyquire');

describe('tokensCache::service', function () {

  context('singleton with init', function () {
    var tokensCache;

    beforeEach(function () {
      tokensCache = require('../../../lib/services/tokens.cache');
    });

    it('should be factory function before init', function () {
      should(tokensCache).be.type('function');
    });

    it('should return object with API after init', function () {
      var initialized = tokensCache(),
        afterInitTC;

      should(initialized).be.type('object')
        .and
        .have.keys(['get', 'has', 'put', 'del']);

      should(initialized.get).be.type('function');
      should(initialized.has).be.type('function');
      should(initialized.put).be.type('function');

      afterInitTC = require('../../../lib/services/tokens.cache');
      should(afterInitTC).be.type('function'); // should be function too
    });
  });

  context('caching disabled', function () {
    var tokensCache,
      opts = {
        tokensCache: {
          cache: false // this is default
        }
      },
      memoryCache = {
        put: sinon.spy(),
        get: sinon.spy()
      };

    beforeEach(function () {
      tokensCache = proxyquire('../../../lib/services/tokens.cache', {
        'memory-cache': memoryCache
      });
      tokensCache = tokensCache(opts);
    });

    it('should not call memory-cache.put for tokensCache.put', function () {
      tokensCache.put();
      should(memoryCache.put.called).be.not.eql(true);
    });

    it('should not call memory-cache.get for tokensCache.has', function () {
      tokensCache.has();
      should(memoryCache.get.called).be.not.eql(true);
    });

    it('should not call memory-cache.get for tokensCache.get', function () {
      tokensCache.get();
      should(memoryCache.get.called).be.not.eql(true);
    });

  });

  context('caching enabled', function () {
    var tokensCache,
      memoryCache,
      opts = {
        tokensCache: {
          ttl  : 5,
          cache: true // this is default
        }
      };

    it('should call memory-cache.put for tokensCache.put', function () {
      var token = '3122142142121',
        data = {},
        defaultTTL = opts.tokensCache.ttl;

      memoryCache = {
        put: sinon.spy(),
        get: sinon.spy()
      };
      tokensCache = proxyquire('../../../lib/services/tokens.cache', {
        'memory-cache': memoryCache
      })(opts);

      tokensCache.put(token, data);

      should(memoryCache.put.called).be.eql(true);
      should(memoryCache.put.calledWith(token, data, defaultTTL)).be.eql(true);
    });

    _.forEach([false, true], function (expectedHasData) {
      it('should call memory-cache.get for tokensCache.has which returns ' + expectedHasData, function () {
        var token = '3122142142121',
          hasData;
        memoryCache = {
          put: sinon.spy(),
          get: sinon.stub().returns(expectedHasData ? {} : undefined)
        };
        tokensCache = proxyquire('../../../lib/services/tokens.cache', {
          'memory-cache': memoryCache
        })(opts);

        hasData = tokensCache.has(token);

        should(memoryCache.get.called).be.eql(true);
        should(memoryCache.get.calledWith(token)).be.eql(true);

        should(hasData).be.eql(expectedHasData);
      });
    });

    it('should call memory-cache.get for tokensCache.get', function () {
      var token = '3122142142121',
        retrievedData,
        data = {};

      memoryCache = {
        put: sinon.spy(),
        get: sinon.stub().returns(data)
      };
      tokensCache = proxyquire('../../../lib/services/tokens.cache', {
        'memory-cache': memoryCache
      })(opts);

      retrievedData = tokensCache.get(token);

      should(memoryCache.get.called).be.eql(true);
      should(memoryCache.get.calledWith(token)).be.eql(true);

      should(retrievedData).be.eql(data);
    });
  });

});
