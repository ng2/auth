angular.module('ng2Auth')
.config(['$httpProvider'
  , function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('AuthHTTPInterceptor');
}])

.run(['Routes', function (Routes) {
}]);