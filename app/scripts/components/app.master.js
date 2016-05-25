'use strict';

angular.module('fission.master', [])
  .config(['$urlRouterProvider',
    function ($urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
    }
  ]);

angular.module('fission.master')
  .controller('MasterRod', ['$rootScope', '$scope',
    function ($rootScope, $scope) {
      $scope.appInternalName = 'fission';

      $rootScope.sendToIPCMain = function (channel) {
        ipcRenderer.send(channel);
      }
    }
  ]);
