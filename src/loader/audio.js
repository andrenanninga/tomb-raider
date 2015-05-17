'use strict';

var path        = require('path');
var jBinary     = require('jbinary');
var audioFormat = require('../format/audio');

var loadAudio = function(audioPath, callback) {
  jBinary.load(audioPath, audioFormat, function(err, jb) {
    if(err) {
      return callback(err);
    }

    var audio;

    try {
      audio = jb.readAll();
    }
    catch(err) {
      return callback(err);
    }

    callback(null, audio);
  });
};

module.exports = loadAudio;

loadAudio(path.resolve(__dirname, '../../data/MAIN.SFX'));