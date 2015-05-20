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

var width = window.innerWidth;
var height = window.innerHeight;

var clock = new THREE.Clock();
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xf0f0f0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
// var camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 10000);
camera.position.x = -100;
camera.position.y = 100;
camera.position.z = -100;

var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);

var light = new THREE.AmbientLight(0x666666);
scene.add(light);

var light = new THREE.PointLight(0xffffff, 0.5, 10000);
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

  var definition = {
    ObjectID: 0,
    Rotation: 0,
    x: 0,
    y: 0,
    z: 0,
  };

  scene.remove(model);

  moveable = new Moveable(level, definition);
  model = moveable.getModel();

  model.scale.x = 0.1;
  model.scale.y = -0.1;
  model.scale.z = -0.1;
  model.position.set(0, 0, 0);
  scene.add(model);
  
  global.moveable = moveable;
  global.model = model;
});

var gui = new Dat.GUI();
var dummy = { animation: 103 };

gui.add(dummy, 'animation').step(1).min(0).max(120).onFinishChange(function(value) {
  var animationId = Math.round(value);

  moveable.animation.stop();

  moveable.animation = new THREE.Animation(model.children[0], moveable.animations[animationId]);
  moveable.animation.play();
});

var render = function () {
  stats.begin();

  var delta = clock.getDelta();

  THREE.AnimationHandler.update(delta);

  controls.update();
  light.position.set(camera.position.x, camera.position.y, camera.position.z);
  renderer.render(scene, camera);

  stats.end();
  requestAnimationFrame(render);
};

render();