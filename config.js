angular.module('ng2-auth')
.config(['$httpProvider'
  , function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('AuthHTTPInterceptor');
}])

.run(['Routes', function (Routes) {
}]);