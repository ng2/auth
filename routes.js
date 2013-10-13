angular.module('ng2Auth')
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/auth/:provider/callback', {
      controller: 'authCallback',
      template: require('./views/auth-callback')
    });
}]);