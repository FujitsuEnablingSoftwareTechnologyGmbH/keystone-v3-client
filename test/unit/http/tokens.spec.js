describe('http:tokens', function () {
  var settings = {
    token: 'be3d0c18bbf44379b2b797c63c9d0e74',
    url  : 'http://www.keystone_instance.org/'
  };

  context('authenticate', require('./tokens/authenticate')(settings));
  context('validate', require('./tokens/validate')(settings));
  context('check', require('./tokens/check')(settings));
  context('revoke', require('./tokens/revoke')(settings));

});
