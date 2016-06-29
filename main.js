'use strict';

const electron = require('electron');
// In-built modules
const {app} = electron; // Module to control application life.
const {BrowserWindow} = electron; // Module to create native browser window.
const {ipcMain} = electron; // Module to interact with renderer processes
const {dialog} = electron; // Module to add dialog support

// Live reloading on file changes
require('electron-reload')(__dirname, {
  electron: require('electron-prebuilt')
});

// External modules
var fs = require('fs-extra'); // Module to interact with file system of OS
var path = require('path');
var utils = require('./main.utils.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720
  });

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/app/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// Native functions sent by renderer processes
ipcMain.on('get-all-webapp-files', function (evt) {
  var root = path.resolve(app.getPath('documents'), 'spring-petclinic/src/main/webapp');
  var webapp = utils.makeDirObject(root);
  mainWindow.webContents.send('get-webapp-object', webapp);
});

ipcMain.on('get-all-java-files', function (evt) {
  var root = path.resolve(app.getPath('documents'), 'spring-petclinic/src/main/java');
  var java_dir = utils.makeDirObject(root);
  mainWindow.webContents.send('get-java-dir-object', java_dir);
});

ipcMain.on('open-file-selector', function (evt, keyName) {
  var filePath = dialog.showOpenDialog({properties: ['openFile']});
  if (filePath) {
    mainWindow.webContents.send('return-file', keyName, filePath[0]); // Returns absolute file path
  } else {
    mainWindow.webContents.send('cancel-file', keyName); // Cancel
  }
});

ipcMain.on('read-file', function (evt, keyName, filePath) {
  var root = path.resolve(filePath);
  var file = utils.makeDirObject(root);
  mainWindow.webContents.send('return-file-contents', keyName, path.basename(filePath), file);
});
