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
  .controller('HomeRod', ['$rootScope', '$scope',
    function ($rootScope, $scope) {

      $scope.getWebapp = function () {
        ipcRenderer.send('get-all-webapp-files');
        ipcRenderer.on('read-webapp-complete', function () {
          $scope.currentFile = _spring['webapp']['WEB-INF']['jsp']['welcome.jsp'];
        });
      };

      $scope.getJava = function () {
        ipcRenderer.send('get-all-java-files');
        ipcRenderer.on('read-java-complete', function () {
        });
      };

      $scope.convertFile = function (name) {
        $scope.file = convertJSPtoHTML(name);
      };
    }
  ]);
