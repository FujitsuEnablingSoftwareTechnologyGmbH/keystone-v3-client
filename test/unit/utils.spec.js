var sinon = require('sinon'),
    should = require('should');

describe('lib/utils', function () {

    var utils;

    before(function () {
        utils = require('../../lib/utils');
    });

    context('dateDiff', function () {
        it('should return dateDiff as number', function (done) {
            var now = new Date(Date.now()),
                after;

            setTimeout(function () {
                after = new Date(Date.now());

                should(utils.dateDiff(now, after)).be.instanceof(Number);
                done();
            }, 100);
        });

        it('should dateDiff be symmetric', function (done) {
            var now = new Date(Date.now()),
                after,
                nowAfter,
                afterNow;
            setTimeout(function () {
                after = new Date(Date.now());

                nowAfter = utils.dateDiff(now, after);
                afterNow = utils.dateDiff(after, now);

                should(nowAfter).be.above(0);
                should(afterNow).be.below(0);

                should(afterNow + nowAfter).be.eql(0);

                done();
            }, 100);
        });
    });

    context('ISO8601', function () {
        it('should parse ISO8601', function (done) {
            var input = '2015-06-22T09:31:59.999999Z',
                result;

            result = utils.parseISO8601Date(input);

            should(result).be.instanceof(Date);
            should(result).have.property('getTime');

            done();
        });

        it('should return undefined for undefined input', function (done) {
            should(utils.parseISO8601Date(undefined)).eql(undefined);
            done();
        });

        it('should return undefined for non string input', function (done) {
            should(utils.parseISO8601Date({})).eql(undefined);
            should(utils.parseISO8601Date(true)).eql(undefined);
            should(utils.parseISO8601Date(121)).eql(undefined);
            done();
        });
    });

    context('mixin', function () {
        it('should properly mixin two objects', function (done) {
            var source = {
                    a: 1,
                    b: 2
                },
                target = {
                    c: 3
                },
                expectedKeys = ['a', 'b', 'c'],
                result;

            result = utils.mixin(target, source);

            should(result).have.keys(expectedKeys);
            should(result).not.be.eql(source);
            should(result).be.eql(target);

            done();
        });

        it('should override target property from source', function (done) {
            var source = {
                    a: 1
                },
                target = {
                    a: undefined
                };

            target = utils.mixin(target, source);

            should(target).have.property('a', source.a);
            done();
        });

        it('should fail for undefined target, defined source', function () {
            (function () {
                utils.mixin(undefined, {a: 1});
            }).should.throw();
        });

        it('should not fail for undefined target, undefined source', function () {
            (function () {
                utils.mixin(undefined, undefined);
            }).should.not.throw();
        });
    });
});
