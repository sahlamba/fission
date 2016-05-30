// Utility functions and global objects required at front-end

var getFileDataFromObject = function (fileName) {
  var dirs = fileName.split('/'); // Get sub directories
  var webapp = _spring; // Copy
  dirs.forEach(function (dir, i) {
    if (i !== dirs.length - 1)
      webapp = webapp[dir]; // Move into sub-dir till last
  });
  return webapp[dirs[dirs.length - 1]];
};

var convertJSPComments = function (file) {
  file = file.replace(/<%--/g, '<!--');
  file = file.replace(/--%>/g, '-->');
  return file;
};

var processTaglibDirective = function (file) {
  file = convertJSPComments(file);
  var taglibs = file.match(patterns.taglib.directive); // Get array of all taglib directives
  var prefixes = []; // Array to store prefixes of each directive
  taglibs.forEach(function (value, i) {
    prefixes[i] = file.match(patterns.taglib.prefix)[0].slice(8, -1);
  });
  prefixes.forEach(function (prefix, i) { // For Each prefix find tags and type of tags
    var tagPrefixREx = new RegExp(prefix + "(.+)/>", "g");
    var tagsWithPrefix = file.match(tagPrefixREx);
    tagsWithPrefix.forEach(function (tag, index) {
      var tagTypeREx = new RegExp(prefix + ":\\w+", "g");
      var tagType = tag.match(tagTypeREx)[0].slice(prefix.length + 1); // + 1 to count ':'
      file = taglib[prefix][tagType](tag, file);
    })
  });
  // Remove taglib directives from file
  file = file.replace(patterns.taglib.directive, '');
  return file;
};

var processJSPIncludeTemplates = function (template) {
  return processTaglibDirective(template);
};

var convertJSPtoHTML = function (file) {
  file = getFileDataFromObject(file);

  // Convert JSP Comments to HTML ones
  file = convertJSPComments(file);

  // DOCTYPE is already present since it's a working app

  // Delete/replace JSP Directives
  file = file.replace(patterns.JSPPageSession, '');

  // Add ng-attributes to html tag
  var htmlTag = file.match(patterns.html)[0]; // Only one will be present
  htmlTag = htmlTag.slice(0, htmlTag.length - 1); // Remove ending '>'
  htmlTag = htmlTag.concat(' class="no-js" data-ng-app="' + "spring-petclinic" + '">'); // Add App Name
  file = file.replace(patterns.html, htmlTag); // Replace in file

  // Get JSP include template URLs
  var jspTemplates = file.match(patterns.JSPInclude.directive); // Get array of JSP include directives
  var templatePaths = [];
  // Get locations/paths of templates for header and footer (example)
  jspTemplates.forEach(function (item, index) {
    templatePaths[index] = item.match(patterns.JSPInclude.pageURI)[0].slice(6, -1);
    var template = getFileDataFromObject('WEB-INF/jsp/' + templatePaths[index]);
    templatePaths[index] = processJSPIncludeTemplates(template); // Store processed template in location array temporarily
  });
  var counter = 0;
  file = file.replace(patterns.JSPInclude.directive, function (match, i) {
    return templatePaths[counter++];
  });
  return file;
};

// Map functions to their names to pass as parameters
var _process_functions = {
  'convertJSPtoHTML': convertJSPtoHTML
};

// Global object of app, contains directory structure with file data
var _spring = {};
