'use strict';

var jBinary          = require('jbinary');
var zeros            = require('zeros');
var textiles16Format = require('../format/textiles16');


var loadTextiles16 = function(levelPath, callback) {
  jBinary.load(levelPath, textiles16Format, function(err, jb) {
    if(err) {
      return callback(err);
    }

    var textiles16;
    var images = [];
    
    try {
      textiles16 = jb.readAll();
    }
    catch(err) {
      return callback(err);
    }

    for(var i = 0; i < textiles16.length; i++) {
      var image = zeros([256, 256, 4]);
      var textile16 = textiles16[i];
      
      for(var j = 0; j < textile16.length; j++) {
        var x = j % 256;
        var y = Math.floor(j / 256);
        var pixel = textile16[j];

        image.set(x, y, 0, pixel.r);
        image.set(x, y, 1, pixel.g);
        image.set(x, y, 2, pixel.b);
        image.set(x, y, 3, pixel.a);
      }
      
      images.push(image);
    }

    callback(null, images);
  });
};

module.exports = loadTextiles16;