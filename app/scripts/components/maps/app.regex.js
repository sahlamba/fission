// Global RegEx patterns for replacing/matching

var patterns = {
  'html': /<html(.+)?>/g,
  'JSPComments': /<%--(.+)--%>/g,
  'JSPPageSession': /<%@\spage\ssession(.+)%>/g,
  'JSPInclude': {
    'directive': /<jsp:include(.+)?>/g,
    'pageURI': /page="(.+)\.jsp"/g
  },
  'taglib': {
    'directive': /<%@\staglib\sprefix="\w+"\s?(((tagdir)|(uri))="((https?:\/\/)|\/)?([\da-zA-Z\.-]+)(\.([a-zA-Z\.]{2,6}))?([\/\w \.-]*)*\/?"\s)?%>/g,
    'prefix': /prefix="[\w-]+"/g
  }
};
