'use strict';

const fs = require('fs-extra');

fs.mkdirs('/products/webapp/', function (err) {
  if (err) return console.error(err);
  console.log('dir created!');
});
