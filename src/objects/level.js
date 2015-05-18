'use strict';

var _        = require('underscore');
var THREE    = require('three');
var getJSON  = require('../utils/getJSON');

var Mesh     = require('./mesh');
var Moveable = require('./moveable');
var Room     = require('./room');

var Level = function(levelName) {
  this.levelName = levelName;
  this.container = new THREE.Group();
  this.container.scale.x = 0.01;
  this.container.scale.y = -0.01;
  this.container.scale.z = -0.01;
};

Level.BASEPATH = 'levels/';

Level.prototype.prepare = function(cb) {
  var self = this;
  cb = cb || _.noop;

  this._loadDefinition(function(err, definition) {
    if(err) {
      return cb(err);
    }

    self.definition = definition;

    self.textiles16     = self._prepareTextiles16();
    self.objectTextures = self._prepareObjectTextures();
    self.palette16      = self._preparePalette16();
    self.meshes         = self._prepareMeshes();
    self.objects        = self._prepareObjects();

    cb(null, self);
  });
};

Level.prototype.build = function() {
  var center = new THREE.Vector3(0, 0, 0);

  _.each(this.definition.Rooms, function(definition) {
    center.x += definition.RoomInfo.x;
    center.z -= definition.RoomInfo.z;

    var room = new Room(this, definition);
    var mesh = room.getModel();
    this.container.add(mesh);
  }, this);

  center.divideScalar(this.definition.NumRooms);
  center.divideScalar(100);

  this.container.position.sub(center);

  this._placeItems(this.container);
};

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

    var material = new THREE.MeshPhongMaterial({ 
      map: texture, 
      // color: Math.floor(Math.random()*16777215),
      shininess: 1, 
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

Level.prototype._prepareMeshes = function() {
  return _.map(this.definition.Meshes, function(definition, i) {
    if(i !== 0 && _.isEqual(this.definition.Meshes[0], definition)) {
      definition.Dummy = true;
    }

    var mesh = new Mesh(this, definition);
    return mesh.getModel();
  }, this);
};

Level.prototype._prepareObjects = function() {
  var moveables = _.object(_.pluck(this.definition.Moveables, 'ObjectID'), this.definition.Moveables);
  moveables = _.mapObject(moveables, function(moveable) {
    moveable.Type = 'Moveable';
    return moveable;
  });

  var spriteSequences = _.object(_.pluck(this.definition.SpriteSequences, 'ObjectID'), this.definition.SpriteSequences);
  spriteSequences = _.mapObject(spriteSequences, function(spriteSequence) {
    spriteSequence.Type = 'SpriteSequence';
    return spriteSequence;
  });

  return _.extend({}, moveables, spriteSequences);
};

Level.prototype._placeItems = function(container) {
  _.each(this.definition.Items, function(definition) {
    var object = this.objects[definition.ObjectID];

    if(object.Type === 'Moveable') {
      var moveable = new Moveable(this, definition);
      container.add(moveable.getModel());
    }
  }, this);
};

module.exports = Level;