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
        $rootScope.application['state'][keyName]['fetching'] = true;
        $rootScope.application['state'][keyName]['text'] = 'Fetching...';
        ipcRenderer.send('open-file-selector', keyName);
      };

      ipcRenderer.on('return-file', function (evt, file, filePath) {
        $rootScope.application['path'][file] = filePath;
        $rootScope.application['state'][file]['text'] = 'Reading...';
        $rootScope.$apply();
        ipcRenderer.send('read-file', file, filePath);
      });

      ipcRenderer.on('cancel-file', function (evt, file) {
        $rootScope.application['state'][file]['fetching'] = false;
        $rootScope.application['state'][file]['text'] = '';
        $rootScope.$apply();
      });

      ipcRenderer.on('return-file-contents', function (evt, file, fileName, fileContent) {
        $rootScope.application['names'][file] = fileName;
        $rootScope.application['contents'][file] = fileContent;
        $rootScope.application['state'][file]['fetching'] = false;
        $rootScope.application['state'][file]['text'] = '';
        $rootScope.$apply();
        console.log($rootScope.application);
      });

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
