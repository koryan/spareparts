'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  });
angular.module('adminApp.filters', []).
  filter('xmlSuxess', function (version) {
    return function (bool) {
      return bool ? 'Ok':'Fail';
    };
  });