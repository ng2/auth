angular.module('ng2Core')
.config(['$httpProvider'
  , function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}]);