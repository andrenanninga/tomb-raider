'use strict';

var getJSON = function(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      var data = JSON.parse(this.response);

      callback(null, data);
    } 
    else {
      callback(this.statusText);
    }
  };

  request.onerror = function(err) {
    callback(err);
  };

  request.send();
};

module.exports = getJSON;