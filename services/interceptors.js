/**
 * @ngdoc service
 * @name ng2Auth.servicesAuthHTTPInterceptor
 * @description
 * Makes sure there's a valid session and emit
 * ng2Auth:login::begin on 403
 */
angular.module('ng2Auth')
.factory('AuthHTTPInterceptor', ['$rootScope', function ($rootScope) {
  return {
    request: function(config) {
      //console.log(config);
      return config || $q.when(config);
    },

    requestError: function(rejection) {
      //console.log(rejection);
      if (canRecover(rejection)) {
        return responseOrNewPromise
      }
      return $q.reject(rejection);
    },

    response: function(response) {
      //console.log(response);
      return response || $q.when(response);
    },

    responseError: function(rejection) {
      //console.log(rejection);
      if (canRecover(rejection)) {
        return responseOrNewPromise
      }
      return $q.reject(rejection);
    }
  };
}]);