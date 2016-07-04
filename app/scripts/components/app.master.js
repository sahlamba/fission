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

      // Support for POM, SERVLET, ROOT FOLDER, CONFIG FOLDER
      $rootScope.application = {
        'basePackageName': '',
        'path': {
          'pom': '',
          'servlet': '',
          'root': '',
          'config': ''
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
          },
          'root': {
            'text': '',
            'fetching': false,
            'validating': false
          }
        },
        'names': {
          'pom': '',
          'servlet': '',
          'root': ''
        },
        'valid': {
          'valid': false,
          'pom': false,
          'servlet': false,
          'root': false,
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
