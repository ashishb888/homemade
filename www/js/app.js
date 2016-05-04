// Server values would be prod for production, dev for dev, uat for uat and local for localhost server.
var env = "local";
var envLs = {
  prod: "prod",
  uat: "uat",
  dev: "dev",
  local: "local"
};

/* Global URLs for all environments */
var urls = {
  prod: "http://ws.sweet.payin.mobi/sweet/web/public/index.php",
  uat: "http://ws.sweet.payin.mobi/sweet/web/public/index.php",
  dev: "http://dev.sweet.merce.co",
  local: "http://10.1.1.167",
  tcUrl: "http://static.sweet.payin.mobi/support/Terms_and_conditions.html",
  prodStaticResUrl: "http://static.sweet.payin.mobi/sweet/web/public",
  devStaticResUrl: "http://dev.sweet.merce.co",
  uatStaticResUrl: "http://ws.sweet.payin.mobi/sweet/web/public/index.php"
};

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var starter = angular.module('starter', ['ionic', 'ngCordova']);

starter.run(function($ionicPlatform, utilService, dbService) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    // Inialize the database
    dbService.initDB();
  });
});

starter.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider, $logProvider, $sceDelegateProvider) {
  console.debug("config() start");
  console.debug("env: " + env);
  var urlWhiteListSuffix = "/**";
  var urlWhiteList = ["self"];

  /* Depending upon env it Enables/disables debug statements */
  switch (env) {
    case envLs.prod:
      $logProvider.debugEnabled(false);
      break;
    case envLs.uat:
      $logProvider.debugEnabled(false);
      break;
    case envLs.dev:
      $logProvider.debugEnabled(true);
      break;
    case envLs.local:
      $logProvider.debugEnabled(true);
      break;
    default:
      $logProvider.debugEnabled(false);
  }

  /* Depending upon env it sets backend URLs */
  switch (env) {
    case envLs.prod:
      urlWhiteList.push(urls.prod + urlWhiteListSuffix);
      break;
    case envLs.uat:
      urlWhiteList.push(urls.uat + urlWhiteListSuffix);
      break;
    case envLs.dev:
      urlWhiteList.push(urls.dev + urlWhiteListSuffix);
      break;
    case envLs.local:
      urlWhiteList.push(urls.local + urlWhiteListSuffix);
      break;
    default:
      urlWhiteList.push(urls.prod + urlWhiteListSuffix);
  }

  /* Whitelists URLs */
  $sceDelegateProvider.resourceUrlWhitelist(urlWhiteList);

  // Satellizer configuration that specifies which API
  // route the JWT should be retrieved from

  // Redirect to the auth state if any other states
  // are requested other than users

  $urlRouterProvider.otherwise(function($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("home");
  });

  /* Interceptors pool */
  $httpProvider.interceptors.push(
    loadingInterceptor,
    loggerInterceptor,
    errorHandlerInterceptor
  );

  function errorHandlerInterceptor($rootScope, $q) {
    return {
      request(req) {
        return req;
      },

      response(resp) {
        return resp;
      },

      responseError(respErr) {
        if (respErr.config !== undefined || respErr.config !== null) {
          if (respErr.config.url.endsWith("/login")) {
            return $q.reject(respErr);
          }

          if (urlCheck(respErr.config.url)) {
            $rootScope.$broadcast('errorHandler', respErr);
          }
        }
        return $q.reject(respErr);
      }
    };
  }

  /* Loads/hides ionicLoading for every request */
  function loadingInterceptor($rootScope, $q) {
    return {
      request(req) {
        if (req !== undefined || req !== null) {
          if (urlCheck(req.url)) {
            $rootScope.$broadcast("loadingShow");
          }
        }
        return req;
      },

      response(resp) {
        if (resp.config !== undefined || resp.config !== null) {
          if (urlCheck(resp.config.url)) {
            $rootScope.$broadcast("loadingHide");
          }
        }
        return resp;
      },

      responseError(respErr) {
        if (respErr.config !== undefined || respErr.config !== null) {
          if (urlCheck(respErr.config.url)) {
            $rootScope.$broadcast("loadingHide");
          }
        }
        return $q.reject(respErr);
      }
    };
  }

  /* Logs every request's req & resp */
  function loggerInterceptor($rootScope, $q) {
    return {
      request(req) {
        if (req !== undefined || req !== null) {
          if (urlCheck(req.url)) {
            //console.debug("loggerInterceptor: req: " + JSON.stringify(req.data));
            $rootScope.$broadcast("logReqResp", req.data, "req");
          }
        }
        return req;
      },

      response(resp) {
        if (resp.config !== undefined || resp.config !== null) {
          if (urlCheck(resp.config.url)) {
            // console.debug("loggerInterceptor: resp: " + JSON.stringify(resp.data));
            $rootScope.$broadcast("logReqResp", resp.data, "resp");
          }
        }
        return resp;
      },

      responseError(respErr) {
        if (respErr.config !== undefined || respErr.config !== null) {
          if (urlCheck(respErr.config.url)) {
            // console.debug("loggerInterceptor: respErr: " + JSON.stringify(respErr));
            $rootScope.$broadcast("logReqResp", respErr, "respErr");
          }
        }
        return $q.reject(respErr);
      }
    };
  }

  /* Checks if URL start with HTTP or HTTPS */
  function urlCheck(url) {
    url = url.toLowerCase();
    if (url.startsWith("http:") || url.startsWith("https:") || url.startsWith("/api")) {
      return true;
    }
    return false;
  }

  // To disable caching of views
  $ionicConfigProvider.views.maxCache(0);

  $stateProvider
    .state("home", {
      url: "/home",
      templateUrl: "app/home/home.html",
      controller: "HomeCtrl as homeCtrl"
    })
    .state("signin", {
      url: "/signin",
      templateUrl: "app/signin/signin.html",
      controller: "SigninCtrl as signinCtrl"
    })
    .state("signup", {
      url: "/signup",
      templateUrl: "app/signup/signup.html",
      controller: "SignupCtrl as signupCtrl"
    })
    .state("forgotpassword", {
      url: "/forgotpassword",
      templateUrl: "app/forgotpassword/forgotpassword.html",
      controller: "ForgotPasswordCtrl as fpCtrl"
    })
    .state('menu', {
      url: '/menu',
      abstract: true,
      templateUrl: 'app/menu/menu.html'
    })
    .state('menu.account', {
      url: '/account',
      views: {
        'menuContent': {
          templateUrl: 'app/account/account.html'
        }
      }
    })
    .state('menu.placeorder', {
      url: '/placeorder',
      views: {
        'menuContent': {
          templateUrl: 'app/orders/place-order.html'
        }
      }
    })
    .state('menu.prevorders', {
      url: '/prevorders',
      views: {
        'menuContent': {
          templateUrl: 'app/orders/prev-orders.html'
        }
      }
    })
    .state('menu.help', {
      url: '/help',
      views: {
        'menuContent': {
          templateUrl: 'app/help/help.html'
        }
      }
    })
    .state('menu.signout', {
      url: '/signout',
      views: {
        'menuContent': {
          templateUrl: 'app/signout/signout.html'
        }
      }
    })
    .state('menu.tc', {
      url: '/tc',
      views: {
        'menuContent': {
          templateUrl: 'app/tc/tc.html'
        }
      }
    })
    .state('address', {
      url: '/address',
      templateUrl: 'app/address/address.html',
      controller: "AddressCtrl as addressCtrl"
    });

    $urlRouterProvider.otherwise('/signin');
  console.debug("config() end");
});
