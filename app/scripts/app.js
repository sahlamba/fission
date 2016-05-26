'use strict';

angular.module('fission', [
    'ui.router',
    'fission.master',
    'fission.home'
  ])
  .config(['$interpolateProvider',
    function ($interpolateProvider) {
      $interpolateProvider.startSymbol('{='); // Prevent conflicts from any other templating
      $interpolateProvider.endSymbol('=}');
    }
  ]);

const {ipcRenderer} = require('electron'); // Module to interact with main process

// Channels to and from Main Process
ipcRenderer.on('console-message', function (event, text, error) {
  if (error) {
    return console.error(text);
  }
  console.log(text);
});

ipcRenderer.on('get-webapp-object', function (event, webapp) {
  _spring = webapp;
  console.log(_spring);
});
