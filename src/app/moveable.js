'use strict';

var _     = require('underscore');
var THREE = require('three');
var Stats = require('stats.js');
var Dat   = require('dat-gui');
var Level = require('../objects/level');
var Moveable = require('../objects/moveable');

global._ = _;
global.THREE = THREE;

require('../plugins/OrbitControls');

var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xf0f0f0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
camera.position.x = 200;
camera.position.y = 200;
camera.position.z = 200;

var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);

var light = new THREE.AmbientLight(0x666666);
scene.add(light);

var light = new THREE.PointLight(0xffffff, 2, 10000);
light.position.set(camera.position.x, camera.position.y, camera.position.z);
scene.add(light);

var axis = new THREE.AxisHelper(100);
scene.add(axis);

var level = new Level('wall');
var moveable, model;

global.level = level;

level.prepare(function(err) {
  if(err) {
    return console.error(err);
  }

  moveables.lara();
});

var loadMoveable = function(objectId) {
  var definition = _.findWhere(level.definition.Items, { ObjectID: objectId });

  scene.remove(model);

  moveable = new Moveable(level, definition);
  model = moveable.getModel();

  model.scale.x = 0.1;
  model.scale.y = -0.1;
  model.scale.z = -0.1;
  model.position.set(0, 0, 0);
  scene.add(model);
};

var gui = new Dat.GUI();

var moveables = {
  lara: function() { loadMoveable(0); },
  spider: function() { loadMoveable(36); },
  crow: function() { loadMoveable(38); },
  tiger: function() { loadMoveable(39); },
  collapsibleFloor: function() { loadMoveable(55); },
  skybox: function() { loadMoveable(254); },
  helicopter: function() { loadMoveable(259); },
};

gui.add(moveables, 'lara');
gui.add(moveables, 'spider');
gui.add(moveables, 'crow');
gui.add(moveables, 'tiger');
gui.add(moveables, 'collapsibleFloor');
gui.add(moveables, 'skybox');
gui.add(moveables, 'helicopter');

var render = function () {
  stats.begin();

  controls.update();
  light.position.set(camera.position.x, camera.position.y, camera.position.z);
  renderer.render(scene, camera);
  
  stats.end();
  requestAnimationFrame(render);
};

render();