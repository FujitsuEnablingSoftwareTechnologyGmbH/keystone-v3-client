describe('http:roles', function () {
  var settings = {
    token: 'be3d0c18bbf44379b2b797c63c9d0e74',
    url  : 'http://www.keystone_instance.org/'
  };

  context('add', require('./roles/add')(settings));
  context('all', require('./roles/all')(settings));
  context('assignments', require('./roles/assignments')(settings));

});
