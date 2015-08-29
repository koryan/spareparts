'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, $http) {

    $http({
      method: 'GET',
      url: '/api/name'
    }).
    success(function (data, status, headers, config) {
      $scope.name = data.name;
    }).
    error(function (data, status, headers, config) {
      $scope.name = 'Error!';
    });

  }).
  controller('MyCtrl1', function ($scope) {
    // write Ctrl here
    alert("zxccv")

  }).
  controller('SecureCtrl', function ($scope) {
    // write Ctrl here
    $scope.name = "user";
  });

angular.module('adminApp.controllers', []).
  controller('AdminCtrl', function ($scope, $routeParams) {
    
    $scope.mainMenu = [["Сводка", ""],["Управление пользователями", "userslist"],["Логи", "logs"], ["Загрузка XML", "xml"]];
    

  }).
  controller('IndexCtrl', function ($scope, $http) {
    $http.post("/api/getSummaryS").success(function(data) {
      $scope.summary = data
    });

  }).
  controller('LogsCtrl', function ($scope) {
    // write Ctrl here

  }).controller('UsersListCtrl', function ($scope, $http) {
    $http.post("/api/getUsersListS").success(function(data) {
      $scope.usersList = data
    });


  });
