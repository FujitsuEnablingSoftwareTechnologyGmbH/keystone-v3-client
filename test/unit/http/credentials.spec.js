describe('http:credentials', function () {
  var settings = {
    token: 'be3d0c18bbf44379b2b797c63c9d0e74',
    url  : 'http://www.keystone_instance.org/'
  };

  context('add', require('./credentials/add')(settings));
  context('all', require('./credentials/all')(settings));
  context('one', require('./credentials/one')(settings));
  context('update', require('./credentials/update')(settings));
  context('remove', require('./credentials/remove')(settings));

});
