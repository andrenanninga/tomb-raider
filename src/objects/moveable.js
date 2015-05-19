'use strict';

var _ = require('underscore');
var THREE = require('three');

var Moveable = function(level, definition) {
  this.level = level;
  this.definition = definition;
  this.object = this.level.objects[this.definition.ObjectID];

  this.meshes = this._prepareMeshes();
  this.meshtrees = this._prepareMeshtrees();
};

Moveable.prototype.getModel = function() {
  var stack = [];
  var group = new THREE.Group();

  var parent = group;
  parent.depth = 0;

  _.each(this.meshes, function(mesh, i) {
    var model = this.meshes[i].clone();
    var frame = this.object.Frame.Meshes[i];

    if(i === 0) {
      model.position.x = this.object.Frame.x;
      model.position.y = this.object.Frame.y;
      model.position.z = this.object.Frame.z;
    }
    else {
      var meshtree = this.meshtrees[i - 1];

      if(meshtree.Pop) {
        parent = stack.pop();
      }
      if(meshtree.Push) {
        stack.push(parent);
      }

      model.position.x = meshtree.x;
      model.position.y = meshtree.y;
      model.position.z = meshtree.z;
    }

    model.rotation.x = frame[0] * (Math.PI / 180);
    model.rotation.y = frame[1] * (Math.PI / 180);
    model.rotation.z = frame[2] * (Math.PI / 180);
    model.rotation.order = 'YXZ';
      
    parent.add(model);
    parent = model;

  }, this);

  group.position.x = this.definition.x;
  group.position.y = this.definition.y;
  group.position.z = this.definition.z;

  group.rotation.y = this.definition.Rotation * (Math.PI / 180);

  var meshes = [];
  group.traverse(function(mesh) { if(mesh.type === 'Mesh') { meshes.push(mesh); } });

  this.animations = this._prepareAnimations(meshes);
  var animation = new THREE.Animation(group.children[0], this.animations[0]);
  animation.play();

  return group;
};

Moveable.prototype._prepareMeshes = function() {
  var meshes = [];

  _.times(this.object.NumMeshes, function(i) {
    meshes.push(this.level.meshes[this.object.StartingMesh + i]);
  }, this);

  return meshes;
};

Moveable.prototype._prepareMeshtrees = function() {
  var meshtrees = [];

  _.times(this.object.NumMeshes, function(i) {
    meshtrees.push(this.level.definition.MeshTrees[this.object.MeshTree + i]);
  }, this);

  return meshtrees;
};

Moveable.prototype._prepareAnimations = function(meshes) {
  var animations = [];

  _.times(1, function(i) {
    var definition = this.level.definition.Animations[this.object.Animation + i];

    var speed = 1;

    var animation = {
      name: 'animation' + i,
      fps: 25,
      length: 1 / speed,
      hierarchy: []
    };

    _.times(this.object.NumMeshes, function(j) {
      var mesh = meshes[j];
      var keys = _.map(definition.Frames, function(frame, k) {

        var rotation = _.map(frame.Meshes[j], function(rot) { return rot * Math.PI / 180; });
        var quaternion = new THREE.Quaternion();
        quaternion.setFromEuler(new THREE.Euler(rotation[0], rotation[1], rotation[2], 'YXZ'));

        return {
          time: k / definition.NumFrames / speed,
          pos: mesh.position.toArray(),
          scl: [1, 1, 1],
          rot: quaternion.toArray()
        };
      }, this);

      animation.hierarchy.push({
        parent: j,
        keys: keys
      });
    }, this);
    
    animations.push(animation);

  }, this);

  return animations;
};

module.exports = Moveable;