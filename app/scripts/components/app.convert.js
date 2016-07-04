'use strict';

angular.module('fission.convert', [])
  .config(['$urlRouterProvider', '$stateProvider',
    function ($urlRouterProvider, $stateProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('convert', {
          url: '/convert/',
          templateUrl: 'views/convert.html',
          controller: 'ConvertRod'
        });
    }
  ]);

angular.module('fission.convert')
  .controller('ConvertRod', ['$rootScope', '$scope', 'x2js',
    function ($rootScope, $scope, x2js) {
      $scope.configurePOM = function (file) {
        configurePOM(file);
        $rootScope.application.path.config = convertToPath($rootScope.application.basePackageName, $rootScope.application.path.root);
        writeFilesToDir($rootScope.application.path.config, $rootScope.application.basePackageName);
      };
    }
  ]);

var configurePOM = function (file) { // File is JSON object of pom.xml
  var dependenciesToAdd = [{
    'artifactId': 'jackson-core',
    'groupId': 'com.fasterxml.jackson.core'
  }, {
    'artifactId': 'jackson-annotations',
    'groupId': 'com.fasterxml.jackson.core'
  }, {
    'artifactId': 'jackson-databind',
    'groupId': 'com.fasterxml.jackson.core'
  }, {
    'artifactId': 'jackson-datatype-joda',
    'groupId': 'com.fasterxml.jackson.datatype'
  }, {
    'artifactId': 'json-simple',
    'groupId': 'com.googlecode.json-simple'
  }];
  angular.forEach(dependenciesToAdd, function (value) {
    if(!containsObject(file['project']['dependencies']['dependency'], value, 'artifactId')) {
      file['project']['dependencies']['dependency'].push(value);
    }
  });
  console.log(file);
};

var containsObject = function (arr, object, key) {
  angular.forEach(arr, function (value) {
    if (value.hasOwnProperty(key)) {
      if (value[key] === object[key]) {
        return true;
      }
    }
    return false;
  });
};

var convertToPath = function (packageName, rootPath) {
  var folders = packageName.split('.');
  var path = rootPath + '/src/main/java/';
  angular.forEach(folders, function (value) {
    path = path + value + '/';
  });
  path = path.concat('config');
  return path;
};

var writeFilesToDir = function (dir, packageName) {
  ipcRenderer.send('create-dir', dir);
  ipcRenderer.send('write-file', 'AppConfig.java', _files.AppConfig(packageName), dir);
  ipcRenderer.send('write-file', 'JSONModelData.java', _files.JSONModelData(packageName), dir);
  ipcRenderer.send('write-file', 'RedirectInterceptor.java', _files.RedirectInterceptor(packageName), dir);
};
