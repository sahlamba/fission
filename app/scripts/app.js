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
  _spring['webapp'] = webapp; // Global
  console.log(_spring);
});

ipcRenderer.on('get-java-dir-object', function (event, java_dir) {
  _spring['java'] = java_dir; // Global
  console.log(_spring);
});
