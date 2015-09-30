'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  });
angular.module('adminApp.filters', []).
  filter('xmlTryStatus', function (version) {
    return function (bool) {
      return bool ? 'успешно':'сломалося';
    };
  }).
  filter('logType', function (version) {
    return function (logType) {
      var res = "";
      switch(logType){
        case "search":
          res = "поиск";
          break;
        case "send":
          res = "запрос";
          break;
        case "login":
          res = "вход";
          break;
        case "youShallNotPass":
          res = "заблокированная попытка входа";
          break;
      }
      return res;
    };
  }).
  filter('countActive', function (version) {
    return function (array) {
      var result = 0;
      for(var i in array){if(!array[i].isBlocked)result++}
      return result;
    };
  });