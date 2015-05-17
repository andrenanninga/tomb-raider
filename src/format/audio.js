/*jslint bitwise: true */

'use strict';

var jBinary = require('jbinary');

var config = {
  'jBinary.all': 'Audio',
  'jBinary.littleEndian': true,

  Audio: jBinary.Type({
    read: function() {
      var data = [];

      while(this.view.buffer.length > this.binary.tell()) {
        var start = this.binary.tell();
        this.binary.skip(4);
        var clipLength = this.binary.read('uint32');
        var end = start + clipLength + 8;

        var buffer = this.view.buffer.slice(start, end);
        data.push(buffer);

        this.binary.seek(end);
      }

      return data;
    }
  })
};

module.exports = config;
