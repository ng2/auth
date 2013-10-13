// auto-exports //

var app = angular.module('ng2Auth', ['ngRoute']);

require('./providers/oauth2');
require('./providers/routes');
require('./services/interceptors');
require('./controllers/auth-callback');
require('./config.js');
require('./routes.js');

module.exports = app;