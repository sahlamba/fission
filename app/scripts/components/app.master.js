'use strict';

angular.module('fission.master', [])
  .config(['$urlRouterProvider', '$stateProvider',
    function ($urlRouterProvider, $stateProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'views/home.html',
          controller: 'MasterRod'
        });
    }
  ]);

angular.module('fission.master')
  .controller('MasterRod', ['$rootScope', '$scope', '$state',
    function ($rootScope, $scope, $state) {

      $scope.appInternalName = 'fission';

      // Support for POM, SERVLET, ROOT FOLDER, CONFIG FOLDER, VIEW RESOLVERS FILE
      $rootScope.application = {
        'basePackageName': '',
        'path': {
          'pom': '',
          'servlet': '',
          'root': '',
          'config': '',
          'viewr': ''
        },
        'contents': {
          'pom': '',
          'servlet': '',
          'viewr': ''
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
          },
          'root': {
            'text': '',
            'fetching': false,
            'validating': false
          },
          'viewr': {
            'text': '',
            'fetching': false,
            'validating': false
          }
        },
        'names': {
          'pom': '',
          'servlet': '',
          'root': '',
          'viewr': ''
        },
        'valid': {
          'valid': false,
          'pom': false,
          'servlet': false,
          'root': false,
          'viewr': true,
          'basePackageName': false
        }
      };

      $rootScope.goToState = function (stateName) {
        $state.go(stateName);
      };

      $scope.getWebapp = function () {
        ipcRenderer.send('get-all-webapp-files');
      };

      $scope.getJava = function () {
        ipcRenderer.send('get-all-java-files');
      };

      $scope.convertFile = function (name) {
        $scope.file = convertJSPtoHTML(name);
      };

    }
  ]);
