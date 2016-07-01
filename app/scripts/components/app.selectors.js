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

      $rootScope.application = {
        'basePackageName': '',
        'path': {
          'pom': '',
          'servlet': ''
        },
        'contents': {
          'pom': '',
          'servlet': ''
        },
        'state': {
          'pom': {
            'text': '',
            'fetching': false,
            'validating': false
          },
          'servlet': {
            'text': '',
            'fetching': false,
            'validating': false
          }
        },
        'names': {
          'pom': '',
          'servlet': ''
        },
        'valid': {
          'valid': false,
          'pom': false,
          'servlet': false,
          'basePackageName': false
        }
      };

      $rootScope.openFile = function (keyName) {
        // Update Status
        $rootScope.application.state[keyName].fetching = true;
        $rootScope.application.state[keyName].text = 'Fetching...';
        // Open Dialog to Select File
        ipcRenderer.send('open-file-selector', keyName);
      };

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
        $rootScope.application.contents[file] = x2js.xml_str2json(fileContent);
        // Update Status
        $rootScope.application.state[file].fetching = false;
        $rootScope.application.state[file].text = '';
        $scope.validateApp(file);
        // Update UI
        $rootScope.$apply();
      });

      $scope.validateApp = function (fileKey) { // application.contents.fileKey
        if (fileKey) {
          if ($rootScope.application.contents[fileKey]) {
            $rootScope.application.valid[fileKey] = true;
          } else {
            $rootScope.application.valid[fileKey] = false;
          }
        }
        if ($rootScope.application.basePackageName) {
          $rootScope.application.valid.basePackageName = true;
        } else {
          $rootScope.application.valid.basePackageName = false;
        }
        $rootScope.application.valid.valid = ($rootScope.application.valid.pom &&
          $rootScope.application.valid.servlet &&
          $rootScope.application.basePackageName);
      };

    }
  ]);
