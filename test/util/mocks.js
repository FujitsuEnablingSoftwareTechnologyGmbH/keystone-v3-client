var proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  mixin = require('../../lib/util/mixin');

module.exports = {
  mockedKeystoneApi          : function (name) {
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
  },
  mockedKeystoneServer       : (function () {
    var nock = require('nock');
    return function (opt) {
      var headers = opt.headers || {};
      headers = mixin({
        'X-Auth-Token': headers.token || opt.token,
        'Content-Type': 'application/json'
      }, headers);

      return nock(opt.url, {reqheaders: headers})
        .defaultReplyHeaders({
          'x-openstack-request-id': 'req-be3d0c18bbf44379b2b797c63c9d0e74',
          'Keep-Alive'            : 'timeout=5, max=100',
          'Vary'                  : 'X-Auth-Token'
        })
        .replyDate(new Date())
        .replyContentLength();
    };
  }()),
  getResponseBodyForErrorCase: function (errorCode, contextName) {
    return {
      error: {
        message: contextName + ' :: I made an error using code ' + errorCode,
        code   : errorCode,
        title  : contextName + ' :: An error title'
      }
    };
  }
};
