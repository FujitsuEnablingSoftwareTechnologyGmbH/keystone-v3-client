var proxyquire = require('proxyquire'),
    _ = require('lodash'),
    should = require('should');

describe('index', function () {
    var mockedClient = {
        someProperty: true
    };

    it('main file should export client', function (done) {
        var index = proxyquire('../../index', {
            './lib/client': mockedClient
        });

        should(index).be.eql(mockedClient);
        done();
    });
});
