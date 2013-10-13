# auth
> Strategy-based auth module for AngularJS

## Installation

`component install ng2/auth`

Then require it in your `index.html` and add it as a dependency:

```js
require('ng2-auth');
//...
angular.module('myApp',['ng2Auth']);
```

## Usage

`ng2/auth` comes only with `OAuth2` support for the moment. The `OAuth2` module requires a `UserService` to be present, and by default it will look for a service with that name. This `UserService` will be your custom `login`, `getUser` and `logout` logic, plus some other sugar you might want to add on top of it.

Here's how you configure the `OAuth2` provider to use your `UserService`:

```js
.config( function (OAuth2Provider) {
  // by default it will look for 'UserService'
  // but you can always specify others
  OAuth2Provider.setUserService('namespaced.UserService');
});
```

Later you can inject the `OAuth2` service to `login` or `logout` from any provider:

```js
.controller( function ($scope, OAuth2) {
  OAuth2.login('strategy-name');
});
```

Also the `OAuth2` provider will also register:

* `HTTP Interceptors`, and broadcast events for you to hook up to (See Issue #3)
* `$routeChange*`, so you can easily check for auth upon pushState routing (See Issue #4)

## Strategies

Strategies are, inspired from `passport.js`, pretty much drop-ins. If you wanted to add `Facebook Login`, you would do as with any other module

* Install it.
* Require it.
* Inject it.

But then configuration is very simple:

```js
.config( function (OAuth2FacebookProvider) {
  OAuth2FacebookProvider.configure({
    client_id: 'yourCliendId'
  });
});
```

And that's about it. You can start the facebook login process by calling `OAuth2.login('facebook')` from anywhere the `OAuth2` service has been injected.

This are the strategies available:

* [Facebook](https://github.com/ng2/auth-facebook)

If you feel like giving this a go, fork the [Facebook Strategy](https://github.com/ng2/auth-facebook) and adapt it to your preferred OAuth2 service.