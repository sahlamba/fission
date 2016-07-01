// Utility functions and global objects required at front-end

angular.module('fission.utils', [])
  .factory('Utils', function () {
    return {};
  });

var getFileDataFromObject = function (fileName) {
  var dirs = fileName.split('/'); // Get sub directories
  var webapp = _spring['webapp']; // Copy
  dirs.forEach(function (dir, i) {
    if (i !== dirs.length - 1)
      webapp = webapp[dir]; // Move into sub-dir till last
  });
  return webapp[dirs[dirs.length - 1]];
};

var processJSPComments = function (file) {
  file = file.replace(/<%--/g, '<!--');
  file = file.replace(/--%>/g, '-->');
  return file;
};

var processHTMLTag = function (file) {
  // Add ng-attributes to html tag
  var htmlTag = file.match(patterns.html) ? file.match(patterns.html)[0] : null ; // Only one will be present
  htmlTag = htmlTag.slice(0, htmlTag.length - 1); // Remove ending '>'
  htmlTag = htmlTag.concat(' class="no-js" ng-app="' + "spring-petclinic" + '" ng-controller="' + "welcome" + 'Controller">'); // Add App Name
  file = file.replace(patterns.html, htmlTag); // Replace in file
  return file;
};

var processTaglibDirective = function (file) {
  var taglibs = file.match(patterns.taglib.directive); // Get array of all taglib directives
  var prefixes = []; // Array to store prefixes of each directive
  taglibs.forEach(function (value, i) {
    prefixes[i] = file.match(patterns.taglib.prefix)[i].slice(8, -1);
  });
  prefixes.forEach(function (prefix, i) { // For Each prefix find tags and type of tags
    var tagPrefixREx = new RegExp(prefix + "(.+)/>", "g");
    var tagsWithPrefix = file.match(tagPrefixREx);
    if (tagsWithPrefix) {
      tagsWithPrefix.forEach(function (tag, index) {
        var tagTypeREx = new RegExp(prefix + ":\\w+", "g");
        var tagType = tag.match(tagTypeREx)[0].slice(prefix.length + 1); // + 1 to count ':'
        if (taglib[prefix])
          if (taglib[prefix][tagType])
            file = taglib[prefix][tagType](tag, file); // Call function depending on tag type and prefix
      });
    }
  });
  // Remove taglib directives from file
  file = file.replace(patterns.taglib.directive, '');
  return file;
};

var processIncludeDirective = function (file) {
  // Get JSP include template URLs
  var jspTemplates = file.match(patterns.JSPInclude.directive); // Get array of JSP include directives
  var templatePaths = [];
  // Get locations/paths of templates for header and footer (example)
  jspTemplates.forEach(function (item, index) {
    templatePaths[index] = item.match(patterns.JSPInclude.pageURI)[0].slice(6, -1); // Get relative URI of file
    templatePaths[index] = templatePaths[index].slice(0, -3).concat('html'); // Change extension
    var includeDirectiveREx = new RegExp(item, 'g');
    file = file.replace(includeDirectiveREx, '<ng-include src=\"\'' + templatePaths[index] + '\'\"><\/ng-include>');
  });
  return file;
};

var convertJSPtoHTML = function (file) {
  // Get file data from _spring object
  file = getFileDataFromObject(file);
  // Convert JSP Comments to HTML ones
  file = processJSPComments(file);
  // DOCTYPE is already present since it's a working app
  // Delete/replace JSP Directives
  file = file.replace(patterns.JSPPageSession, '');
  file = processHTMLTag(file);
  file = processTaglibDirective(file);
  file = processIncludeDirective(file);
  return file;
};

// Global object of app, contains directory structure with file data
var _spring = {
  'java': {},
  'webapp': {}
};
// Global object of JS controllers, publish files accordingly at end
var _controllers = {
  '.template': ''
};
