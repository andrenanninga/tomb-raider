'use strict';

var _ = require('underscore');
var THREE = require('three');

var Mesh = function(level, definition) {
  this.level = level;
  this.definition = definition;

  this.normals = this._prepareNormals();
  this.vertices = this._prepareVertices();
};

Mesh.prototype.getModel = function() {
  if(this.definition.Dummy) {
    var model = new THREE.Mesh(
      new THREE.SphereGeometry(20, 4, 4),
      new THREE.MeshNormalMaterial({ wireframe: true })
    );

    return model;
  }

  var geometry = new THREE.Geometry();
  var material = new THREE.MeshFaceMaterial(this.level.textiles16);
  material.materials.push(new THREE.MeshPhongMaterial({ 
    color: 0xffffff, 
    vertexColors: THREE.FaceColors, 
    shininess: 1 })
  );

  geometry.vertices = this.vertices;

  this._placeTexturedRectangles(geometry);
  this._placeTexturedTriangles(geometry);
  this._placeColouredRectangles(geometry);
  this._placeColouredTriangles(geometry);

  if(this.normals.length === 0) {
    geometry.computeFaceNormals();
  }

  var mesh = new THREE.Mesh(geometry, material);

  // mesh.castShadow = true;
  // mesh.receiveShadow = true;

  return mesh;
};

Mesh.prototype._prepareNormals = function() {
  return _.map(this.definition.Normals, function(normal) {
    return new THREE.Vector3(normal.x, normal.y, normal.z).normalize();
  });
};

Mesh.prototype._prepareVertices = function() {
  return _.map(this.definition.Vertices, function(vert) {
    return new THREE.Vector3(vert.x, vert.y, vert.z);
  });
};

Mesh.prototype._placeTexturedRectangles = function(geometry) {
  _.each(this.definition.TexturedRectangles, function(rect) {
    var texture = this.level.objectTextures[rect.Texture];
    var uv = texture.uv;
    var normals1 = null;
    var normals2 = null;

    if(this.normals.length) {
      normals1 = [ this.normals[rect.Vertices[2]], this.normals[rect.Vertices[1]], this.normals[rect.Vertices[0]] ];
      normals2 = [ this.normals[rect.Vertices[3]], this.normals[rect.Vertices[2]], this.normals[rect.Vertices[0]] ];
    }

    geometry.faces.push(new THREE.Face3(
      rect.Vertices[2], rect.Vertices[1], rect.Vertices[0],
      normals1,
      0xff0000,
      texture.tile
    ));
    geometry.faceVertexUvs[0].push([uv[2], uv[1], uv[0]]);

    geometry.faces.push(new THREE.Face3(
      rect.Vertices[3], rect.Vertices[2], rect.Vertices[0],
      normals2,
      0xff0000,
      texture.tile
    ));
    geometry.faceVertexUvs[0].push([uv[3], uv[2], uv[0]]);
  }, this);
};

Mesh.prototype._placeTexturedTriangles = function(geometry) {
  _.each(this.definition.TexturedTriangles, function(tri) {
    var texture = this.level.objectTextures[tri.Texture];
    var uv = texture.uv;
    var normals = null;

    if(this.normals.length) {
      normals = [ this.normals[tri.Vertices[2]], this.normals[tri.Vertices[1]], this.normals[tri.Vertices[0]] ];
    }

    geometry.faces.push(new THREE.Face3(
      tri.Vertices[2], tri.Vertices[1], tri.Vertices[0],
      normals,
      0xff0000,
      texture.tile
    ));
    geometry.faceVertexUvs[0].push([uv[2], uv[1], uv[0]]);
  }, this);
};

Mesh.prototype._placeColouredRectangles = function(geometry) {
  _.each(this.definition.ColouredRectangles, function(rect) {
    var normals1 = null;
    var normals2 = null;

    if(this.normals.length) {
      normals1 = [ this.normals[rect.Vertices[2]], this.normals[rect.Vertices[1]], this.normals[rect.Vertices[0]] ];
      normals2 = [ this.normals[rect.Vertices[3]], this.normals[rect.Vertices[2]], this.normals[rect.Vertices[0]] ];
    }

    geometry.faces.push(new THREE.Face3(
      rect.Vertices[2], rect.Vertices[1], rect.Vertices[0],
      normals1,
      this.level.palette16[rect.Palette],
      this.level.textiles16.length
    ));

    geometry.faces.push(new THREE.Face3(
      rect.Vertices[3], rect.Vertices[2], rect.Vertices[0],
      normals2,
      this.level.palette16[rect.Palette],
      this.level.textiles16.length
    ));

  }, this);
};

Mesh.prototype._placeColouredTriangles = function(geometry) {
  _.each(this.definition.ColouredTriangles, function(tri) {
    var normals = null;

    if(this.normals.length) {
      normals = [ this.normals[tri.Vertices[2]], this.normals[tri.Vertices[1]], this.normals[tri.Vertices[0]] ];
    }

    geometry.faces.push(new THREE.Face3(
      tri.Vertices[2], tri.Vertices[1], tri.Vertices[0],
      normals,
      this.level.palette16[tri.Palette],
      this.level.textiles16.length
    ));

  }, this);
};

module.exports = Mesh;