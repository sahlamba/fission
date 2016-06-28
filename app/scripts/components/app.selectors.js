'use strict';

angular.module('fission.selectors', [])
  .config(['$urlRouterProvider', '$stateProvider',
    function ($urlRouterProvider, $stateProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('selectors', {
          url: '/selectors/',
          templateUrl: 'views/selectors.html',
          controller: 'SelectorRod'
        });
    }
  ]);

angular.module('fission.selectors')
  .controller('SelectorRod', ['$rootScope', '$scope',
    function ($rootScope, $scope) {

      $rootScope.application = {
        'basePackageName': '',
        'pom': '',
        'servlet': ''
      };

    }
  ]);
