'use strict';

var jBinary      = require('jbinary');
var levelFormat = require('../format/level');

var loadLevel = function(levelPath, callback) {
  jBinary.load(levelPath, levelFormat, function(err, jb) {
    if(err) {
      return callback(err);
    }

    var level;

    try {
      level = jb.readAll();
    }
    catch(err) {
      console.log(err.stack);
      return callback(err);
    }

    callback(null, level);
  });
};

module.exports = loadLevel;
