'use strict';

angular.module('fission', [
    'ui.router',
    'fission.master',
    'fission.home'
  ])
  .config(['$interpolateProvider',
    function ($interpolateProvider) {
      $interpolateProvider.startSymbol('{='); // Prevent conflicts from any other templating
      $interpolateProvider.endSymbol('=}');
    }
  ]);
