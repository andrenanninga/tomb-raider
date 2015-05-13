'use strict';

var fs         = require('fs');
var util       = require('util');
var path       = require('path');
var jBinary    = require('jbinary');
var zeros      = require('zeros');
var savePixels = require('save-pixels');
var template   = require('./template');

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

  console.log(level.NumTextiles);


  for(var i = 0; i < level.NumTextiles; i++) {
    var image = zeros([256, 256, 3]);
    
    for(var j = 0; j < level.Textile16[i].length; j++) {
      var x = j % 256;
      var y = Math.floor(j / 256);
      var pixel = level.Textile16[i][j];

      image.set(x, y, 0, pixel.r);
      image.set(x, y, 1, pixel.g);
      image.set(x, y, 2, pixel.b);
    }
    
    savePixels(image, 'png').pipe(fs.createWriteStream('./Textile' + i + '.png'));
  }


  // console.log(level);
  // console.log(util.inspect(level, { colors: true, depth: 0 }));
  // console.log(util.inspect(level.Meshes[239], { colors: true, depth: 5 }));


});
