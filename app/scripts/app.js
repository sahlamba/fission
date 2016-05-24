'use strict';

const {ipcRenderer} = require('electron'); // Module to interact with main process

document.querySelector('#create-button')
  .addEventListener('click', function () {
    ipcRenderer.send('create-project-dir');
  });

ipcRenderer.on('console-message', function (event, msg) {
  console.log(msg);
});
