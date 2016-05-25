'use strict';

angular.module('fission.master', [])
  .config(['$urlRouterProvider',
    function ($urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
    }
  ]);

angular.module('fission.master')
  .controller('MasterRod', ['$scope',
    function ($scope) {

      $scope.appInternalName = 'fission';

    }
  ]);
