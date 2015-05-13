'use strict';

var util     = require('util');
var path     = require('path');
var jBinary  = require('jbinary');
var template = require('./template');

var file = path.join(__dirname, '../data/HOUSE.TR2');

jBinary.load(file, template, function(err, jb) {
  var level;

  try {
    level = jb.readAll();
  }
  catch(e) {
    console.error(e);
    process.exit(1);
  }

  // console.log(level);
  // console.log(util.inspect(level, { colors: true, depth: 0 }));
  console.log(util.inspect(level.Meshes[14], { colors: true, depth: 5 }));
});
