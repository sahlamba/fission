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
        'path': {
          'pom': '',
          'servlet': ''
        },
        'contents': {
          'pom': '',
          'servlet': ''
        },
        'state': {
          'pom': {
            'text': '',
            'fetching': false,
            'validating': false
          },
          'servlet': {
            'text': '',
            'fetching': false,
            'validating': false
          }
        },
        'names': {
          'pom': '',
          'servlet': ''
        },
        'valid': {
          'valid': false,
          'pom': false,
          'servlet': false
        }
      };

    }
  ]);
