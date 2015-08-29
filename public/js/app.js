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
      templateUrl: 'templates/index.html',
      controller: 'MyCtrl1'
    }).
    when('/secure', {
      templateUrl: 'templates/secure.html'
    }).

    when('/view1', {
      templateUrl: 'partials/partial1',
      controller: 'MyCtrl1'
    }).
    when('/view2', {
      templateUrl: 'partials/partial2',
      controller: 'MyCtrl2'
    }).
    otherwise({
      templateUrl: 'templates/404.html',
      //redirectTo: '/view1'
    });

  $locationProvider.html5Mode(true);
});
