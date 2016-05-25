'use strict';

angular.module('fission.home', [])
  .config(['$urlRouterProvider', '$stateProvider',
    function ($urlRouterProvider, $stateProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'views/home.html',
          controller: 'HomeRod'
        });
    }
  ]);

angular.module('fission.home')
  .controller('HomeRod', ['$scope',
    function ($scope) {
    }
  ]);
