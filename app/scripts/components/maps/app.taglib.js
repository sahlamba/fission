// List and functions for taglib directives

var taglib = {
    'c': {},
    'x': {},
    'sql': {},
    'fmt': {},
    'spring': {
      'url': function (tag, file) {
        // Attributes for url tag are -
        // Value - href or uri (relative)
        // Var - name of variable used, assumes use of ${varname} syntax
        // Context -
        // Scope
        var value = tag.match(/value="(.+)"\s?/g)[0];
        value = value.slice(7, value.indexOf('\"', 7));
        var varName = tag.match(/var="(.+)"\s?/g)[0];
        varName = varName.slice(5, varName.indexOf('\"', 5));
        var varNameREx = new RegExp('\\${' + varName + '}', 'g');
        var tagREx = new RegExp('<' + tag, 'g');
        file = file.replace(varNameREx, value); // Replace URLs
        file = file.replace(tagREx, ''); // Delete prefix tags
        return file;
      },
      'form': {}
    }
};
