// List and functions for taglib directives

var taglib = {
    'c': {},
    'x': {},
    'sql': {},
    'fmt': {
      'message': function (tag, file) {
        // Attributes for message tag are -
        // Key - JAVA variable to get message from
        // Var - name of variable used, assumes use of ${varname} syntax
        // Bundle -
        // Scope -
        var key = tag.match(/key="(.+)"\s?/g)[0];
        key = key.slice(5, key.indexOf('\"', 5));
        var varName = tag.match(/var="(.+)"\s?/g);
        //
        // Add function here to get the key from backend
        // and store in JS scope as key_fmt_message for view to render
        //
        if (varName) {
          varName = varName[0];
          varName = varName.slice(5, varName.indexOf('\"', 5));
          var varNameREx = new RegExp('\\${' + varName + '}', 'g');
          file = file.replace(varNameREx, '{=' + key + '_fmt_message=}'); // Replace Vars
          var tagREx = new RegExp('<' + tag, 'g');
          file = file.replace(tagREx, ''); // Delete prefix tags
        } else {
          var tagREx = new RegExp('<' + tag, 'g');
          file = file.replace(tagREx, '{=' + key + '_fmt_message=}'); // Delete prefix tags
        }
        return file;
      }
    },
    'spring': {
      'url': function (tag, file) {
        // Attributes for url tag are -
        // Value - href or uri (relative)
        // Var - name of variable used, assumes use of ${varname} syntax
        // Context -
        // Scope -
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
