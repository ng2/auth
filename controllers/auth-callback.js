/**
 * @name ng2Auth.controllers:authCallback
 */
angular.module('ng2Auth')
  .controller('authCallback',['$scope', '$location', '$routeParams', 'OAuth2'
  , function ($scope, $location, $routeParams, OAuth2) {

    var hash = {};

    $location.hash().split('&').forEach(function (param) {
      param = param.split('=');
      hash[param[0]] = param[1];
    });

    window.opener.angular.element(window.opener.document)
    .injector().get('OAuth2').passToken(angular.extend({
        strategy: $routeParams.provider
      }, hash));

    $location.search();
    $location.hash(false);
    window.close();
  }]);