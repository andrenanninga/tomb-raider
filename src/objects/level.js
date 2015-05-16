'use strict';

var _       = require('underscore');
var THREE   = require('three');
var getJSON = require('../utils/getJSON');

var Mesh    = require('./mesh');
var Room    = require('./room');

var Level = function(levelName) {
  var self = this;
  this.levelName = levelName;
  this.container = new THREE.Group();
  this.container.scale.x = 0.01;
  this.container.scale.y = -0.01;
  this.container.scale.z = -0.01;

  this._loadDefinition(function(err, definition) {
    if(err) {
      return console.error(err);
    }

    self.definition = definition;

    self.textiles16     = self._prepareTextiles16();
    self.objectTextures = self._prepareObjectTextures();
    self.palette16      = self._preparePalette16();
    self.meshes         = self._prepateMeshes();

    var center = new THREE.Vector3(0, 0, 0);

    _.each(self.definition.Rooms, function(definition) {
      center.x += definition.RoomInfo.x;
      center.z -= definition.RoomInfo.z;

      var room = new Room(self, definition);
      var mesh = room.getModel();
      self.container.add(mesh);
    });

    center.divideScalar(self.definition.NumRooms);
    center.divideScalar(100);

    self.container.position.sub(center);
  });
};

Level.BASEPATH = 'levels/';

Level.prototype.empty = function() {
  this.container.remove.apply(this.container, this.container.children);
};

Level.prototype._loadDefinition = function(callback) {
  var path = Level.BASEPATH + this.levelName + '/level.json';

  getJSON(path, callback);
};

Level.prototype._prepareTextiles16 = function() {
  var textiles16 = [];
  var path = Level.BASEPATH + this.levelName + '/textiles/';

  _.times(this.definition.NumTextiles, function(i) {
    var texture = THREE.ImageUtils.loadTexture(path + 'textile16_' + i + '.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestMipMapLinearFilter;

    var material = new THREE.MeshBasicMaterial({ 
      map: texture, 
      shininess: 100, 
      wireframe: false,
      transparent: true,
    });

    material.alphaTest = 0.5;
    
    textiles16.push(material);
  });

  return textiles16;
};

Level.prototype._prepareObjectTextures = function() {
  var textures = [];
  var normalizeUv = function(vert) {
    var coords = _.chain(vert)
      .pick('Xpixel', 'Ypixel')
      .mapObject(function(pixel) { return pixel / 256; })
      .mapObject(function(pixel, key) { return key === 'Ypixel' ? 1 - pixel : pixel; })
      .value();

    return new THREE.Vector2(coords.Xpixel, coords.Ypixel);
  };

  _.each(this.definition.ObjectTextures, function(objectTexture) {
    var uv = [
      normalizeUv(objectTexture.Vertices[0]),
      normalizeUv(objectTexture.Vertices[1]),
      normalizeUv(objectTexture.Vertices[2]),
      normalizeUv(objectTexture.Vertices[3])
    ];

    textures.push({
      tile: objectTexture.Tile,
      uv: uv
    });
  });

  return textures;
};

Level.prototype._preparePalette16 = function() {
  return _.map(this.definition.Palette16, function(color) {
    return new THREE.Color(color.r / 255, color.g / 255, color.b / 255);
  });
};

Level.prototype._prepateMeshes = function() {
  return _.map(this.definition.Meshes, function(definition) {
    var mesh = new Mesh(this, definition);
    return mesh.getModel();
  }, this);
};

module.exports = Level;