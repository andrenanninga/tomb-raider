'use strict';

var _ = require('underscore');
var THREE = require('three');

var Static = function(level, definition) {
  this.level = level;
  this.definition = definition;
};

Static.prototype.getModel = function() {
  var staticMeshInfo = _.findWhere(
    this.level.definition.StaticMeshes,
    { ObjectID: this.definition.ObjectID }
  );

  var model = this.level.meshes[staticMeshInfo.Mesh].clone();

  model.position.x = this.definition.x;
  model.position.y = this.definition.y;
  model.position.z = this.definition.z;

  model.rotation.y = this.definition.Rotation * (Math.PI / 180);

  model.castShadow = true;
  model.receiveShadow = true;

  return model;
};

module.exports = Static;