// Utility functions and global objects required at front-end

var convertJSPtoHTML = function (file) {
  // DOCTYPE is already present since it's a working app

  // Delete/replace JSP Directives
  file = file.replace(/<%@ page session(.+)%>/g, '');

  // Add ng-attributes to html tag
  var htmlTag = file.match(/<html(.+)?>/g)[0]; // Only one will be present
  htmlTag = htmlTag.slice(0, htmlTag.length - 1); // Remove ending '>'
  htmlTag = htmlTag.concat(' class="no-js" data-ng-app="' + "spring-petclinic" + '">'); // Add App Name
  file = file.replace(/<html(.+)?>/g, htmlTag); // Replace in file

  // Get JSP include template URLs
  var jspTemplates = file.match(/<jsp:include(.+)?>/g); // Get array of JSP include directives
  var templatePaths = [];
  // Get locations/paths of templates for header and footer (example)
  jspTemplates.forEach(function (item, index) {
    templatePaths[index] = item.match(/page="(.+)\.jsp"/g)[0].slice(6, -1);
  });
};

// Map functions to their names to pass as parameters
var _process_functions = {
  'convertJSPtoHTML': convertJSPtoHTML
};

// Global object of app, contains directory structure with file data
var _spring = {};
