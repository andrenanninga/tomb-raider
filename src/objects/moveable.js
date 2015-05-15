'use strict';

var _ = require('underscore');
var THREE = require('three');

var Movable = function(level, definition) {
  this.level = level;
  this.definition = definition;

  this.normals = this._prepareNormals();
  this.vertices = this._prepareVertices();
};

Movable.prototype.getMesh = function() {
  var material = new THREE.MeshFaceMaterial(this.level.textiles16);
  var geometry = new THREE.Geometry();

  geometry.vertices = this.vertices;
  this._placeTexturedRectangles(geometry);
  this._placeTexturedTriangles(geometry);

  return new THREE.Mesh(geometry, material);
};

Movable.prototype._prepareNormals = function() {
  return _.map(this.definition.Normals, function(normal) {
    return new THREE.Vector3(normal.x, normal.y, normal.z).normalize();
  });
};

Movable.prototype._prepareVertices = function() {
  return _.map(this.definition.Vertices, function(vert) {
    return new THREE.Vector3(vert.x, vert.y, vert.z);
  });
};

Movable.prototype._placeTexturedRectangles = function(geometry) {
  _.each(this.definition.TexturedRectangles, function(rect) {
    var texture = this.level.objectTextures[rect.Texture];
    var uv = texture.uv;

    geometry.faces.push(new THREE.Face3(
      rect.Vertices[0], rect.Vertices[1], rect.Vertices[2],
      [ this.normals[rect.Vertices[0]], this.normals[rect.Vertices[1]], this.normals[rect.Vertices[2]] ],
      0xff0000,
      texture.tile
    ));
    geometry.faceVertexUvs[0].push([uv[0], uv[1], uv[2]]);

    geometry.faces.push(new THREE.Face3(
      rect.Vertices[0], rect.Vertices[2], rect.Vertices[3],
      [ this.normals[rect.Vertices[0]], this.normals[rect.Vertices[2]], this.normals[rect.Vertices[3]] ],
      0xff0000,
      texture.tile
    ));
    geometry.faceVertexUvs[0].push([uv[0], uv[2], uv[3]]);
  }, this);
};

Movable.prototype._placeTexturedTriangles = function(geometry) {
  _.each(this.definition.TexturedTriangles, function(tri) {
    var texture = this.level.objectTextures[tri.Texture];
    var uv = texture.uv;

    geometry.faces.push(new THREE.Face3(
      tri.Vertices[0], tri.Vertices[1], tri.Vertices[2],
      [ this.normals[tri.Vertices[0]], this.normals[tri.Vertices[1]], this.normals[tri.Vertices[2]] ],
      0xff0000,
      texture.tile
    ));
    geometry.faceVertexUvs[0].push([uv[0], uv[1], uv[2]]);
  }, this);
};

module.exports = Movable;