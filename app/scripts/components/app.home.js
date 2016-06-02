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
        $scope.status.tasks.push({slug:'webapp',text:'Reading webapp files...',type:'text-warning'});
        ipcRenderer.send('get-all-webapp-files');
        ipcRenderer.on('read-webapp-complete', function () {
          $scope.currentFile = _spring['webapp']['WEB-INF']['jsp']['welcome.jsp'];
          $rootScope.status.tasks.forEach(function (el, i) {
            if (el.slug === 'webapp') {
              $rootScope.status.tasks.splice($rootScope.status.tasks.indexOf(el));
              $scope.$apply();
            }
          });
        });
      };

      $scope.getJava = function () {
        $scope.status.tasks.push({slug:'java',text:'Reading java files...',type:'text-warning'});
        ipcRenderer.send('get-all-java-files');
        ipcRenderer.on('read-java-complete', function () {
          $rootScope.status.tasks.forEach(function (el, i) {
            if (el.slug === 'java') {
              $rootScope.status.tasks.splice($rootScope.status.tasks.indexOf(el));
              $scope.$apply();
            }
          });
        });
      };

      $scope.convertFile = function (name) {
        // $rootScope.status.tasks.push({slug:'welcome',text:'Converting welcome.jsp..',type:'text-warning'});
        $scope.file = convertJSPtoHTML(name);
      };
    }
  ]);
