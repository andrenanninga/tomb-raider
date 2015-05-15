'use strict';

var _     = require('underscore');
var THREE = require('three');
var Stats = require('stats.js');
var Dat   = require('dat-gui');
var Level = require('../objects/level');

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

var light = new THREE.PointLight(0xffffff, 0.8, 10000);
light.position.set(camera.position.x, camera.position.y, camera.position.z);
scene.add(light);

var axis = new THREE.AxisHelper(100 );
scene.add(axis);

var level = new Level('boat');
global.level = level;
scene.add(level.container);

var loadMoveable = function(id) {
  level.empty();
  level.loadMoveable(id);
};

var movables = { 
  laraFace: function() { loadMoveable(14); }, 
  laraFaceAngry: function() { loadMoveable(80); }, 
  maskedGoonFace: function() { loadMoveable(201); }, 
  stickWieldingGoonFace: function() { loadMoveable(309); }, 
  ratFace: function() { loadMoveable(281); }, 
  boat: function() { loadMoveable(171); }, 
  door: function() { loadMoveable(348); }, 
  passport: function() { loadMoveable(369); }, 
  sunglasses: function() { loadMoveable(372); }, 
  cdPlayer: function() { loadMoveable(373); }, 
  pistol: function() { loadMoveable(376); }, 
  shotgun: function() { loadMoveable(378); }, 
  autoPistol: function() { loadMoveable(380); }, 
  uzi: function() { loadMoveable(383); }, 
  harpoonGun: function() { loadMoveable(385); }, 
  m16: function() { loadMoveable(386); }, 
  grenadeLauncher: function() { loadMoveable(387); }, 
  shotgunAmmo: function() { loadMoveable(390); }, 
};

var gui = new Dat.GUI();

gui.add(movables, 'laraFace');
gui.add(movables, 'laraFaceAngry');
gui.add(movables, 'maskedGoonFace');
gui.add(movables, 'stickWieldingGoonFace');
gui.add(movables, 'ratFace');
gui.add(movables, 'boat');
gui.add(movables, 'door');
gui.add(movables, 'passport');
gui.add(movables, 'sunglasses');
gui.add(movables, 'cdPlayer');
gui.add(movables, 'pistol');
gui.add(movables, 'shotgun');
gui.add(movables, 'autoPistol');
gui.add(movables, 'uzi');
gui.add(movables, 'harpoonGun');
gui.add(movables, 'm16');
gui.add(movables, 'grenadeLauncher');
gui.add(movables, 'shotgunAmmo');

var render = function () {
  stats.begin();

  controls.update();
  light.position.set(camera.position.x, camera.position.y, camera.position.z);
  renderer.render(scene, camera);
  
  stats.end();
  requestAnimationFrame(render);
};

render();