'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ui.bootstrap'
]).
config(function ($routeProvider, $locationProvider) {  
  $routeProvider.  
    when('/', {
      templateUrl: 'templates/secure.html',
      controller: 'SecureCtrl'
    }).  
    otherwise({
      templateUrl: 'templates/404.html',
      //redirectTo: '/view1'
    });

  $locationProvider.html5Mode(true);
});
