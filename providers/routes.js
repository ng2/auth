/**
* @ngdoc service
* @name ng2Auth.providers:routesProvider
* @description
* Provider configuration docs.
*/

/**
* @ngdoc service
* @name ng2Auth.services:routes
* @description
* Service consumption docs.
*/

angular
.module('ng2Auth')
.provider('Routes', function () {
      /**
       * @name userService
       * @type {Object}
       * @propertyOf ng2Auth.providers:RoutesProvider
       * @description
       * The user service.
       */
      var userService
        , defaultUserService = 'UserService';

      /**
       * @name handlers
       * @type {Object}
       * @propertyOf ng2Auth.providers:RoutesProvider
       * @description
       * The handlers object.
       */
      var handlers = {
        loginStart: null,
        loginSuccess: null,
        logoutSuccess: null,
        locationChange: null,
      };

      /**
       * @description
       * The actual service.
       */
      return {

        $get: ['$rootScope', '$location', '$route', '$injector',
        function ($rootScope, $location, $route, $injector) {


          if(!userService) {
            userService = defaultUserService;
          }

          userService = $injector.get(userService);

          if (!userService) {
            throw new Error('ng2Auth:Routes please configure a userService');
          }

          if (!handlers.loginStart) {
            $rootScope.$broadcast('ng2auth:routes::default-method',"loginStart")
          }

          if (!handlers.loginSuccess) {
            $rootScope.$broadcast('ng2auth:routes::default-method',"loginSuccess")
          }

          if (!handlers.locationChange) {
            $rootScope.$broadcast('ng2auth:routes::default-method',"locationChange")
          }

          /**
           * @ngdoc function
           * @name handlers.loginStart
           * @propertyOf ng2Auth.providers:RoutesProvider
           * @description
           * Default login starting logic.
           */
          handlers.loginStart = handlers.loginStart || function (redirect) {
            $rootScope.$broadcast("ng2auth:routes::redirect", "/login");
            $location.path('/login');
            $location.search({
              redirect: encodeURIComponent(redirect)
            });
            return;
          };

          /**
           * @ngdoc function
           * @name handlers.loginSuccess
           * @propertyOf ng2Auth.providers:RoutesProvider
           * @description
           * This method redirects the user to the redirect search term if
           * it exists.
           */
          handlers.loginSuccess = handlers.loginSuccess || function () {
            if($location.search().redirect) {
              $rootScope.$broadcast("ng2auth:routes::redirect", $location.search().redirect);
              $location.path($location.search().redirect);
              $location.search(false);
            } else if ($location.path() === 'login'){
              $location.path('/');
            }
          };

          /**
           * @ngdoc function
           * @name handlers.loginSuccess
           * @propertyOf ng2Auth.providers:RoutesProvider
           * @description
           * This method redirects the user to the redirect search term if
           * it exists.
           */
          handlers.logoutSuccess = handlers.logoutSuccess || function () {
            $rootScope.$broadcast("ng2auth:routes::redirect", "/");
            $location.path('/');
          };

          /**
           * @ngdoc function
           * @name handlers.locationChange
           * @propertyOf ng2Auth.providers:RoutesProvider
           * @description
           * This method takes a user navigating, does a quick auth check
           * and if everything is alright proceeds.
           */
          handlers.locationChange = handlers.locationChange || function (event, next) {
            next = '/'+next.split('/').splice(3).join('/').split("?")[0];
            var route = $route.routes[next] || false;
            if(route && (route.public || route.private !== true) ) {
              $rootScope.$broadcast("ng2auth:routes::proceed", next);
            } else if (route && (route.private || route.public === false)) {
              userService.getUser().then(function (user) {
                $rootScope.$broadcast("ng2auth:routes::proceed", next);
              }, function (error) {
                $rootScope.$broadcast("ng2auth:routes::guest-access", next);
                $rootScope.$broadcast('ng2auth:routes::login-start');
                handlers.loginStart(next.substr(1));
              });
            } else {
              $rootScope.$broadcast("ng2auth:routes::error", "Route "+next+" does not exist.");
            }
          };

          /**
           * @description
           * $rootScope hookups
           */
          $rootScope.$on('$locationChangeStart', function (event, next) {
            if(!$route.current) {
              userService.getUser().then(function (user) {
                $rootScope.$broadcast("ng2auth:login::success", user);
                if(typeof handlers.locationChange === 'function') {
                  handlers.locationChange(event, next);
                }
              }, function (err) {
                $rootScope.$broadcast("ng2auth:routes::log","request failed");
                $rootScope.$broadcast("ng2auth:routes::log","proceeding as guest.");
                if(typeof handlers.locationChange === 'function') {
                  handlers.locationChange(event, next);
                }
              });
            } else {
              if(typeof handlers.locationChange === 'function') {
                handlers.locationChange(event, next);
              }
            }
          });

          $rootScope.$on('ng2auth:login::success', function (event, next) {
            if(typeof handlers.locationChange === 'function') {
              handlers.loginSuccess(event, next);
            }
          });

          $rootScope.$on('ng2auth:routes::logoutSuccess', function () {
            if(typeof handlers.logoutSuccess === 'function') {
              handlers.logoutSuccess();
            }
          })

          $rootScope.$on('ng2auth:routes::loginRequired', function () {
            $rootScope.$broadcast("ng2auth:routes::login", "required");
            $location.path('/login');
          });

          return {};
        }],

        /**
         * @ngdoc function
         * @methodOf ng2Auth.providers:RoutesProvider
         * @name setUserService
         * @param  {String} usr the user service name
         */
        setUserService: function (usr) {
          if(typeof usr !== 'string') {
            throw new Error('ng2auth:routes:: setUserService expects a service name to inject')
          }
          userService = usr;
        },

        /**
         * @ngdoc function
         * @methodOf ng2Auth.providers:RoutesProvider
         * @name setHandler
         * @param  {String} key  the handler name
         * @param  {Function} foo    the handler function
         * @description
         * Replaces one of the default handlers.
         */
        setHandler: function (key, foo) {
          if( key.substr(0,6) !== 'handle' ) {
            throw new Error('ng2auth:routes:: Expecting a handler name that starts with \'handle\'.');
          }

          if ( ! handlers.hasOwnProperty(key) ) {
            throw new Error('ng2auth:routes:: handle name '+key+' is not a valid property.');
          }

          if ( typeof foo !== 'function') {
            throw new Error('ng2auth:routes:: foo is not a function.');
          }

          handlers[key] = foo;
        }
      }
});