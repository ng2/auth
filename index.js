// auto-exports //

var app = angular.module('ng2Auth', ['ngRoute']);

require('./providers/oauth2');
require('./controllers/auth-callback');
require('./routes.js');

module.exports = app;