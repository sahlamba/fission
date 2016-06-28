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

      $rootScope.goToState = function (stateName) {
        $state.go(stateName);
      };

      $rootScope.openFile = function (keyName) {
        ipcRenderer.send('open-file-selector', keyName);
        ipcRenderer.on('return-file', function (evt, file, filePath) {
          $rootScope.application[file] = filePath;
        });
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
