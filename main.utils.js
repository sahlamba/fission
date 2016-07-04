// Utility functions module required by main.js

var fs = require('fs');
var path = require('path');

var makeDirObject = function (rootDirname) {
  var objectRoot = {};
  if (fs.statSync(rootDirname).isFile()) {
    return fs.readFileSync(rootDirname, 'utf8');
  } else {
    var filenames = fs.readdirSync(rootDirname);
    filenames.forEach(function (fileName, i) {
      var currentFilePath = path.resolve(rootDirname, fileName);
      if (fs.statSync(currentFilePath).isFile()) {
        objectRoot[fileName] = fs.readFileSync(currentFilePath, 'utf8');
      } else if (fs.statSync(currentFilePath).isDirectory()) {
        objectRoot[fileName] = {};
        if (fileName[0] !== '.') // Not hidden directory
          objectRoot[fileName] = makeDirObject(currentFilePath);
      }
    });
  }
  return objectRoot;
};

var createDir = function (dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
};

var writeFileToDir = function (fileName, fileContent, dirPath) {
  createDir(dirPath);
  var filePath = path.resolve(dirPath, fileName);
  fs.writeFile(filePath, fileContent, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

var exports = module.exports = {
  makeDirObject: makeDirObject,
  createDir: createDir,
  writeFileToDir: writeFileToDir
};
