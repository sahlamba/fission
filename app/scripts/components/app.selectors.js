'use strict';

angular.module('fission.selectors', [])
  .config(['$urlRouterProvider', '$stateProvider',
    function ($urlRouterProvider, $stateProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('selectors', {
          url: '/selectors/',
          templateUrl: 'views/selectors.html',
          controller: 'SelectorRod'
        });
    }
  ]);

angular.module('fission.selectors')
  .controller('SelectorRod', ['$rootScope', '$scope', 'x2js',
    function ($rootScope, $scope, x2js) {

      $rootScope.openFile = function (keyName) {
        // Update Status
        $rootScope.application.state[keyName].fetching = true;
        $rootScope.application.state[keyName].text = 'Fetching...';
        // Open Dialog to Select File
        ipcRenderer.send('open-file-selector', keyName);
      };

      $rootScope.openDir = function (keyName) {
        // Update Status
        $rootScope.application.state[keyName].fetching = true;
        $rootScope.application.state[keyName].text = 'Fetching...';
        // Open Dialog to Select Dir
        ipcRenderer.send('open-dir-selector', keyName);
      };

      ipcRenderer.on('return-dir', function (evt, dir, dirName, dirPath) {
        // Update Absolute Dir Path and Name
        $rootScope.application.names[dir] = dirName;
        $rootScope.application.path[dir] = dirPath;
        $rootScope.application.contents[dir] = dirPath;
        // Update Status
        $rootScope.application.state[dir].text = '';
        $rootScope.application.state[dir].fetching = false;
        $scope.validateApp(dir);
        // Update UI
        $rootScope.$apply();
      });

      ipcRenderer.on('cancel-dir', function (evt, dir) {
        // Update Status
        $rootScope.application.state[dir].fetching = false;
        $rootScope.application.state[dir].text = '';
        $scope.validateApp(dir);
        // Update UI
        $rootScope.$apply();
      });

      ipcRenderer.on('return-file', function (evt, file, filePath) {
        // Update Absolute File Path
        $rootScope.application.path[file] = filePath;
        // Update Status
        $rootScope.application.state[file].text = 'Reading...';
        // Update UI
        $rootScope.$apply();
        // Read File at filePath
        ipcRenderer.send('read-file', file, filePath);
      });

      ipcRenderer.on('cancel-file', function (evt, file) {
        // Update Status
        $rootScope.application.state[file].fetching = false;
        $rootScope.application.state[file].text = '';
        $scope.validateApp(file);
        // Update UI
        $rootScope.$apply();
      });

      ipcRenderer.on('return-file-contents', function (evt, file, fileName, fileContent) {
        // Save Name of Actual file
        $rootScope.application.names[file] = fileName;
        // Save XML content as JSON
        if (x2js.xml_str2json(fileContent)) {
          $rootScope.application.contents[file] = x2js.xml_str2json(fileContent);
        } else {
          // $rootScope.application.contents[file] = fileContent;
        }
        console.log($rootScope.application);
        // Update Status
        $rootScope.application.state[file].fetching = false;
        $rootScope.application.state[file].text = '';
        $scope.validateApp(file);
        // Update UI
        $rootScope.$apply();
      });

      $rootScope.$watch('application.contents.pom', function (newval, oldval) {
        if (newval.project) {
          $rootScope.application.basePackageName = newval.project.groupId + '.' + newval.project.name;
        } else {
          $rootScope.application.basePackageName = null;
        }
      });

      $scope.validateApp = function (fileKey) { // application.contents.fileKey
        if (fileKey) {
          if (fileKey === 'viewr') {
            if ($rootScope.application.viewFile) {
              if ($rootScope.application.contents[fileKey]) {
                $rootScope.application.valid[fileKey] = true;
              } else {
                $rootScope.application.valid[fileKey] = false;
              }
            } else {
              $rootScope.application.valid[fileKey] = true;
            }
          } else {
            if ($rootScope.application.contents[fileKey]) {
              $rootScope.application.valid[fileKey] = true;
            } else {
              $rootScope.application.valid[fileKey] = false;
            }
          }
        }
        if ($rootScope.application.basePackageName) {
          $rootScope.application.valid.basePackageName = true;
        } else {
          $rootScope.application.valid.basePackageName = false;
        }
        $rootScope.application.valid.valid = (
          $rootScope.application.valid.root &&
          $rootScope.application.valid.pom &&
          $rootScope.application.valid.servlet &&
          $rootScope.application.valid.viewr &&
          $rootScope.application.basePackageName &&
          $rootScope.application.jstlPrefix &&
          $rootScope.application.startJspName);
      };

    }
  ]);
