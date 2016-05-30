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
      };

      $scope.convertFile = function (name) {
        $scope.file = convertJSPtoHTML(name);
      };
    }
  ]);
