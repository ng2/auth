/**
* @ngdoc service
* @name ng2Auth.providers:OAuth2Provider
* @description
* Provider configuration docs.
*/

/**
* @ngdoc service
* @name ng2Auth.services:OAuth2
* @description
* Service consumption docs.
*/

angular
.module('ng2Auth')
.provider('OAuth2', function () {
  /**
   * @name strategies
   * @type {Object}
   * @propertyOf ng2Auth.providers:OAuth2Provider
   * @description
   * The strategies to be used.
   */
  var strategies = {}
    , strategiesName = []

  /**
   * @name userService
   */
    , userService
    , defaultUserService = 'UserService';

  /**
   * @description
   * The actual service.
   */
  return {

    /**
     * Inject services used within your service here
     */
    $get: ['$rootScope', '$q', '$injector'
    , function ($rootScope, $q, $injector) {

      if(!userService) {
        userService = defaultUserService;
      }

      userService = $injector.get(userService);

      strategiesName.forEach(function (strategy) {
        // inject strategies!
        if(typeof strategy !== 'string') {
          strategies[strategy.name] = $injector.get(strategy.service);
        } else {
          strategies[strategy] = $injector.get(strategy);
        }

        // bind listeners!
        $rootScope.$on('ng2auth:login-end::'+(strategy.name || strategy)
        , function (event, data) {
          console.log("status", data);
        })
      });

      /**
       * @name findStrategy
       * @param  {String or Object} strategy  the strategy to find
       * @return {Object}          a strategy or undefined
       */
      var findStrategy = function (strategy) {
        var result;
        if(typeof strategy === 'string') {
          result = strategies[strategy];
        } else if (typeof strategy === 'object' && strategy.provider === 'string') {
          result = strategy[strategy.provider];
        }
        return result;
      }

      return {
        getStrategy: function (strategy) {
          return findStrategy(strategy)
        },

        /**
         * passToken
         * @param  {Object} opts the strategy and other vars
         */
        passToken: function (opts) {
          $rootScope.$broadcast('ng2auth:callback::'+opts.strategy, opts);
        },

        /**
         * @name getUser
         * @ngdoc function
         * @methodOf ng2Auth.services:OAuth2
         * @return {Promise}
         */
        getUser: function () {
          var deferred = $q.defer();
          userService
            .getUser()
            .then(function (res) {
              // yay some data!
              // deferred.resolve(user);
            }, function (error) {
              // ooops
              // deferred.reject(error);
            });
          return deferred.promise;
        },

        /**
         * @name login
         * @ngdoc function
         * @methodOf ng2Auth.services:OAuth2
         * @return {Promise}
         */
        login: function (strategy) {
          $rootScope.$broadcast('ng2auth:login:begin::'+strategy);
          findStrategy(strategy)
            .getAccessToken();
        },

        /**
         * @name logout
         * @ngdoc function
         * @methodOf ng2Auth.services:OAuth2
         * @return {Promise}
         */
        logout: function () {
          var deferred = $q.defer();
          $rootScope.$broadcast('ng2auth:logout:begin::*');
          userService
            .logout()
            .then(function (res) {
              // yay some data!
              // deferred.resolve(user);
              $rootScope.$broadcast('ng2auth:logout:end::*', user);
            }, function (error) {
              // ooops
              // deferred.reject(error);
              $rootScope.$broadcast('ng2auth:logout:end::*', error);
            });
          return deferred.promise;
        }
      }
    }],

    setUserService: function (UserService) {
      userService = UserService || defaultUserService;
    },

    addStrategy: function (Strategy) {
      strategiesName.push(Strategy);
    }
  };
});