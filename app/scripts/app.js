'use strict';

angular.module('fission', [
    'ui.router', // Angular routing support
    'cb.x2js', // XML to JSON conversion module
    'fission.utils', // Service
    'fission.master', // Controller
    'fission.selectors' // Controller
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
