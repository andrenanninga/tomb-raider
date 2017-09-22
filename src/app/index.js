'use strict';

var _     = require('underscore');
var THREE = require('three');
var Stats = require('stats.js');
var Dat   = require('dat-gui');
var Level = require('../objects/level');
var FirstPersonControls = require('@fabienmotte/three-first-person-controls');

global._ = _;
global.THREE = THREE;

var width = window.innerWidth;
var height = window.innerHeight;

var clock = new THREE.Clock(true);
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xf0f0f0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
renderer.shadowMapType = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
// var camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 10000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 0;

var controls = new FirstPersonControls(camera);
controls.lookSpeed = 2;
controls.movementSpeed = 1000;

var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);

var light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
scene.add(light);

var light = new THREE.PointLight(0xffffff, 0.5);
light.shadowCameraFov = THREE.VIEW_ANGLE;
light.castShadow = true;
// light.shadowBias = 0.0001;
// light.shadowDarkness = 0.5;
// light.shadowMapSoft = true;
// light.shadowMapWidth = 4096;
// light.shadowMapHeight = 4096;
light.position.set(camera.position.x, camera.position.y, camera.position.z);
scene.add(light);

var axis = new THREE.AxisHelper(100 );
scene.add(axis);

var level;

var loadLevel = function(levelName) {
  if(level) {
    scene.remove(level.container);
  }

  level = new Level(levelName);
  level.camera = camera;
  level.prepare(function(err) {
    if(err) {
      return console.error(err);
    }

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 0;

    level.build();
    scene.add(level.container);
  });

  global.level = level;
};

loadLevel('assault');

var levels = {
  assault: function() { loadLevel('assault'); },
  boat: function() { loadLevel('boat'); },
  catacomb: function() { loadLevel('catacomb'); },
  deck: function() { loadLevel('deck'); },
  emprtomb: function() { loadLevel('emprtomb'); },
  floating: function() { loadLevel('floating'); },
  house: function() { loadLevel('house'); },
  icecave: function() { loadLevel('icecave'); },
  keel: function() { loadLevel('keel'); },
  living: function() { loadLevel('living'); },
  monastry: function() { loadLevel('monastry'); },
  opera: function() { loadLevel('opera'); },
  platform: function() { loadLevel('platform'); },
  rig: function() { loadLevel('rig'); },
  skidoo: function() { loadLevel('skidoo'); },
  unwater: function() { loadLevel('unwater'); },
  venice: function() { loadLevel('venice'); },
  wall: function() { loadLevel('wall'); },
  xian: function() { loadLevel('xian'); },
};

var gui = new Dat.GUI();

gui.add(levels, 'assault');
gui.add(levels, 'boat');
gui.add(levels, 'catacomb');
gui.add(levels, 'deck');
gui.add(levels, 'emprtomb');
gui.add(levels, 'floating');
gui.add(levels, 'house');
gui.add(levels, 'icecave');
gui.add(levels, 'keel');
gui.add(levels, 'living');
gui.add(levels, 'monastry');
gui.add(levels, 'opera');
gui.add(levels, 'platform');
gui.add(levels, 'rig');
gui.add(levels, 'skidoo');
gui.add(levels, 'unwater');
gui.add(levels, 'venice');
gui.add(levels, 'wall');
gui.add(levels, 'xian');

var render = function () {
  stats.begin();

  var delta = clock.getDelta();
  THREE.AnimationHandler.update(delta);
  
  controls.update(clock.getDelta());
  light.position.set(camera.position.x, camera.position.y, camera.position.z);
  renderer.render(scene, camera);
  
  stats.end();
  requestAnimationFrame(render);
};

render();