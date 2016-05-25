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

const {ipcRenderer} = require('electron'); // Module to interact with main process

angular.module('fission.home')
  .controller('HomeRod', ['$scope',
    function ($scope) {

      document.querySelector('#create-button')
        .addEventListener('click', function () {
          ipcRenderer.send('create-project-dir');
        });

      ipcRenderer.on('console-message', function (event, msg) {
        console.log(msg);
      });
    }
  ]);
