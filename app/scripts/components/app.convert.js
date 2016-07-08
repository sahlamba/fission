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

      $scope.processStart = false;
      $scope.processConsole = '';

      $scope.configure = function () {
        $scope.processStart = true;
        // POM
        configurePOM($rootScope.application.contents.pom);
        writeFile($rootScope.application.path.pom, x2js.json2xml_str($rootScope.application.contents.pom));
        $scope.processConsole += 'New dependencies added to pom.xml...\n';

        // Config Files (JAVA)
        $rootScope.application.path.config = convertToPath($rootScope.application.basePackageName, $rootScope.application.path.root);
        writeFilesToDir($rootScope.application.path.config,
          $rootScope.application.basePackageName,
          $rootScope.application.jstlPrefix,
          $rootScope.application.startJspName);
        $scope.processConsole += 'Application config files created...\n';

        // View Resolver
        // Writes file as well
        $scope.removeViewResovlverCode = function () {
          if ($rootScope.application.contents.viewr) {
            $rootScope.application.contents.viewr['beans'] = {};
            writeFile($rootScope.application.path.viewr, x2js.json2xml_str($rootScope.application.contents.viewr));
            $scope.processConsole += 'Existing View Resolvers removed/commented...\n';
          } else {
            $scope.processConsole += 'INSTRUCTION: Please comment out the existing View Resolvers in your Dispatcher Servlet XML file\n';
          }
        };
        $scope.removeViewResovlverCode();

        // Servlet
        processServlet($rootScope.application.contents.servlet, $rootScope.application.basePackageName);
        writeFile($rootScope.application.path.servlet, x2js.json2xml_str($rootScope.application.contents.pom));
        $scope.processConsole += 'New dispatcher servlet configured...\n';

        // JSP
        ipcRenderer.send('write-file',
          'jsonData.jsp',
          _files.jsonData($rootScope.application.basePackageName),
          $rootScope.application.path.root + '/src/main/webapp/');
        $scope.processConsole += 'JSON Data JSP file created...\n';
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

var writeFile = function (fileDir, fileContent) {
  var fileFolders = fileDir.split('/');
  var fileName = fileFolders[fileFolders.length - 1];
  fileFolders.pop();
  fileDir = fileFolders.join('/');
  ipcRenderer.send('write-file', fileName, fileContent, fileDir);
};

var writeFilesToDir = function (dir, packageName, jstlPrefix, startJspName) {
  ipcRenderer.send('create-dir', dir);
  ipcRenderer.send('write-file', 'AppConfig.java', _files.AppConfig(packageName), dir);
  ipcRenderer.send('write-file', 'JSONModelData.java', _files.JSONModelData(packageName), dir);
  ipcRenderer.send('write-file', 'RedirectInterceptor.java', _files.RedirectInterceptor(packageName), dir);
  ipcRenderer.send('write-file', 'jspViewResolver.java', _files.jspViewResolver(packageName, jstlPrefix, startJspName), dir);
};

var processServlet = function (file, packageName) {
  console.log(file);
  if (!file['beans']['annotation-driven']) {
    file['beans']['annotation-driven'] = {
      '__prefix': 'mvc'
    };
  }
  if (file['beans']['component-scan']) {
    file['beans']['component-scan']['_base-package'] = packageName.toString() + '.config';
  } else {
    file['beans']['component-scan'] = {
      '__prefix': 'context',
      '_base-package': packageName.toString() + '.config'
    };
  }
  file['beans']['interceptors'] = {
    '__prefix': 'mvc',
    'bean': {
      '_class': packageName.toString() + '.config.RedirectInterceptor'
    }
  };
};
