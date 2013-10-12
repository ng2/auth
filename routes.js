angular.module('ng2Auth')
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Feel free to remove this root route :)
    .when('/auth/:provider/callback', {
      controller: 'authCallback',
      template: require('./views/auth-callback')
    });
}]);