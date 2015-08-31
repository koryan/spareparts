'use strict';

// Declare app level module which depends on filters, and services

angular.module('adminApp', [
  'adminApp.controllers',
  'adminApp.filters',
  'adminApp.services',
  'adminApp.directives',
  'ui.bootstrap'

]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
  	when('/', {
      templateUrl: '../templates/admin/index.html',
      controller: 'IndexCtrl'
    }).    
    when('/userslist', {
      templateUrl: '../templates/admin/usersList.html',
      controller: 'UsersListCtrl'
    }).
    when('/logs', {
      templateUrl: '../templates/admin/logs.html',
      controller: 'LogsCtrl'
    }).
    when('/xml', {
      templateUrl: '../templates/admin/xml.html',
      controller: 'XmlCtrl'
    }).
    otherwise({
      templateUrl: '../templates/404.html',
      //controller: 'MyCtrl2'
      //redirectTo: '/view1'
    });

  $locationProvider.html5Mode(true);
});
