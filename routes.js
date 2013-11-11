angular.module('ng2-auth')
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/auth/:provider/callback', {
      controller: 'authCallback',
      template: require('./views/auth-callback')
    });
}]);