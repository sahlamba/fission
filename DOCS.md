# Main
=======

#### main.js
1. ipcMain - 'get-all-webapp-files'
> Uses the utility function (main.utils) **makeDirObject** to get the directory
> structure from **webapp** folder and store it in the same tree structure in a
> global JSON object, ```_spring```

#### main.utils.js
> Utility functions for main.js exported as a module

1. makeDirObject
> Reads and traverses directory (root) passed as an argument, stores its content
> if a file is encountered and traverses recursively if a directory is
> encountered

***

# App
======

#### app.regex.js
> Contains global **patterns** object which stores Regular Expressions to be
> used for comparing in other files

#### app.js

#### app.utils.js
> Utility functions (file parsing and processing) for app.js
> **Contains global object _spring declaration**

1. getFileDataFromObject
> Takes directory location of a file with **webapp** as root (relative to) and
> fetches the file content from the global webapp object, ```_spring```

2. convertJSPtoHTML
> Converts input JSP template file to HTML source for Angular front-end

3. processJSPIncludeTemplates
> Parse and process JSP templates that are included in other JSPs
