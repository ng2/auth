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
      });

      // bind listeners!
      $rootScope.$on('ng2auth:oauth2::success', function (event, data) {
        $rootScope.$broadcast('ng2auth:login::begin');
        userService
          .login(data)
          .then(function (res) {
            $rootScope.$broadcast('ng2auth:login::success', res);
          }, function (error) {
            $rootScope.$broadcast('ng2auth:login::failure', error);
          })
      });

      $rootScope.$on('ng2auth:oauth2::expired', function (event, data) {
        $rootScope.$broadcast('ng2auth:oauth2::renew', data);
        userService
          .renewSession(data)
          .then(function (res) {
            $rootScope.$broadcast('ng2auth:login::success', res);
          }, function (error) {
            $rootScope.$broadcast('ng2auth:login::error', error);
          });
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
        /**
         * getStrategy
         * @param  {String} strategy a strategy name
         * @return {Object}          the strategy with that name
         */
        getStrategy: function (strategy) {
          return findStrategy(strategy)
        },

        /**
         * passToken
         * @param  {Object} opts the strategy and other vars
         */
        passToken: function (opts) {
          $rootScope.$broadcast('ng2auth:oauth2::callback', opts);
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
              deferred.resolve(res);
            }, function (error) {
              deferred.reject(error);
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
          $rootScope.$broadcast('ng2auth:oauth2::begin',strategy);
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
          $rootScope.$broadcast('ng2auth:logout::begin');
          userService
            .logout()
            .then(function (user) {
              // yay some data!
              $rootScope.$broadcast('ng2auth:logout::success', user);
              deferred.resolve(user);
            }, function (error) {
              // ooops
              $rootScope.$broadcast('ng2auth:logout::failure', error);
              deferred.reject(error);
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