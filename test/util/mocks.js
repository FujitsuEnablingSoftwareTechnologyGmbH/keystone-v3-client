var proxyquire = require('proxyquire'),
  sinon = require('sinon');

module.exports = {
  mockedKeystoneApi: function (name) {
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
    })
  }
};