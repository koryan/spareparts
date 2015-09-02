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
  filter('countActive', function (version) {
    return function (array) {
      var result = 0;
      for(var i in array){if(!array[i].isBlocked)result++}
      return result;
    };
  });