/**
 * @ngdoc service
 * @name ng2Auth.servicesAuthHTTPInterceptor
 * @description
 * Makes sure there's a valid session and emit
 * ng2Auth:login::begin on 403
 */
angular.module('ng2Auth')
.factory('AuthHTTPInterceptor', ['$rootScope', '$q'
, function ($rootScope, $q) {
  return {
    request: function(config) {
      $rootScope.$broadcast('AuthHTTPInterceptor:request',config);
      return config || $q.when(config);
    },

    requestError: function(rejection) {
      $rootScope.$broadcast('AuthHTTPInterceptor:requestError',rejection);
      //console.log(rejection);
      // if (canRecover(rejection)) {
      //   return responseOrNewPromise
      // }
      return $q.reject(rejection);
    },

    response: function(response) {
      $rootScope.$broadcast('AuthHTTPInterceptor:response',response);
      //console.log(response);
      return response || $q.when(response);
    },

    responseError: function(rejection) {
      $rootScope.$broadcast('AuthHTTPInterceptor:responseError',rejection);
      //console.log(rejection);
      // if (canRecover(rejection)) {
      //   return responseOrNewPromise
      // }
      return $q.reject(rejection);
    }
  };
}]);