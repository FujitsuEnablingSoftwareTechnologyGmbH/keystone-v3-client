var proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  utils = require('../../lib/utils'),
  fs = require('fs');

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
      headers = utils.mixin({
        'X-Auth-Token': headers.token || opt.token,
        'Content-Type': 'application/json'
      }, headers);

      return nock(opt.url, {reqheaders: headers});
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
  },
  loadRRFile                 : function (file) {
    return JSON.parse(
      fs.readFileSync(file).toString()
    );
  }
};
