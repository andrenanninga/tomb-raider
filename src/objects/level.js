'use strict';

var THREE = require('three');
var getJSON = require('simple-get-json');

var Level = {
  BASEPATH: '/levels',

  LEVEL: {
    HOUSE: 'house',
    BOAT: 'boat'
  },

  load: function(level) {
    this.level = level;

    Level._loadDefinition(level, function(err, definition) {
      console.log(definition);
    });
  },

  _loadDefinition: function(level, callback) {
    var path = Level.BASEPATH + '/' + level + '/level.json';
    getJSON(path, callback);
  }
};

global.Level = Level;