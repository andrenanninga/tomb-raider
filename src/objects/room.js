'use strict';

var _ = require('underscore');
var THREE = require('three');
var Static = require('./static');

var Room = function(level, definition) {
  this.level = level;
  this.definition = definition;

  this.vertices = this._prepareVertices();
};

Room.prototype.getModel = function() { 
  var material = new THREE.MeshFaceMaterial(this.level.textiles16);
  var geometry = new THREE.Geometry();

  geometry.vertices = this.vertices;

  this._placeRectangles(geometry);
  this._placeTriangles(geometry);

  geometry.computeFaceNormals();

  var group = new THREE.Group();

  var room = new THREE.Mesh(geometry, material);
  room.position.x = this.definition.RoomInfo.x;
  room.position.z = this.definition.RoomInfo.z;
  group.add(room);

  this._placeStaticMeshes(group);

  return group;
};

Room.prototype._prepareVertices = function() {
  return _.map(this.definition.RoomData.Vertices, function(vert) {
    return new THREE.Vector3(vert.Vertex.x, vert.Vertex.y, vert.Vertex.z);
  });
};

Room.prototype._placeRectangles = function(geometry) {
  _.each(this.definition.RoomData.Rectangles, function(rect) {
    var texture = this.level.objectTextures[rect.Texture];
    var uv = texture.uv;

    geometry.faces.push(new THREE.Face3(
      rect.Vertices[2], rect.Vertices[1], rect.Vertices[0],
      new THREE.Vector3(0, -1, 0),
      0xff0000,
      texture.tile
    ));
    geometry.faceVertexUvs[0].push([uv[2], uv[1], uv[0]]);

    geometry.faces.push(new THREE.Face3(
      rect.Vertices[3], rect.Vertices[2], rect.Vertices[0],
      new THREE.Vector3(0, -1, 0),
      0xff0000,
      texture.tile
    ));
    geometry.faceVertexUvs[0].push([uv[3], uv[2], uv[0]]);
  }, this);
};

Room.prototype._placeTriangles = function(geometry) {
  _.each(this.definition.RoomData.Triangles, function(tri) {
    var texture = this.level.objectTextures[tri.Texture];
    var uv = texture.uv;

    geometry.faces.push(new THREE.Face3(
      tri.Vertices[2], tri.Vertices[1], tri.Vertices[0],
      new THREE.Vector3(0, -1, 0),
      0xff0000,
      texture.tile
    ));
    geometry.faceVertexUvs[0].push([uv[2], uv[1], uv[0]]);
  }, this);
};

Room.prototype._placeStaticMeshes = function(container) {
  _.each(this.definition.StaticMeshes, function(definition) {
    var staticMesh = new Static(this.level, definition);

    container.add(staticMesh.getModel());
  }, this);
};

module.exports = Room;