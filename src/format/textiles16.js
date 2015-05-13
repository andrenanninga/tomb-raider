/*jslint bitwise: true */

'use strict';

var _       = require('underscore');
var jBinary = require('jbinary');

var structs = require('./structs');

var config = _.extend({}, structs, {
  'jBinary.all': 'Textiles16',
  'jBinary.littleEndian': true,

  Textiles16: jBinary.Type({
    read: function() {
      var version = this.binary.read('uint32');

      // skip Palette
      this.binary.skip(768);
      // skip Palette16
      this.binary.skip(1024);

      var numTextiles = this.binary.read('uint32');

      // skip Textile8
      this.binary.skip(numTextiles * 65536);

      return this.binary.read(['array', 'tr2_textile16', numTextiles]); 
    }
  })
});

module.exports = config;
