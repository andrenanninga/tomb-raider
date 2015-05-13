'use strict';

var _ = require('underscore');
var THREE = require('three');
var Stats = require('stats.js');

var model = require('./shotgun.json');

global.THREE = THREE;

require('../plugins/OrbitControls');

var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xf0f0f0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
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

var light = new THREE.AmbientLight(0x222222);
scene.add(light);

var light = new THREE.PointLight( 0xffffff, 0.8, 1000 );
light.position.set(camera.position.x, camera.position.y, camera.position.z);
scene.add(light);

var axis = new THREE.AxisHelper(100);
scene.add(axis);

var geometry = new THREE.Geometry();
var normals = [];
var tris = [];
var colors = [];

_.each(model.Normals, function(normal){
  normals.push(new THREE.Vector3(normal.x, normal.y, normal.z).normalize());
});

_.each(model.TexturedRectangles, function(rect) {
  tris.push([rect.Vertices[0], rect.Vertices[1], rect.Vertices[2], rect.Texture]);
  tris.push([rect.Vertices[0], rect.Vertices[2], rect.Vertices[3], rect.Texture]);
});

_.each(model.TexturedTriangles, function(tri) {
  tris.push([tri.Vertices[0], tri.Vertices[1], tri.Vertices[2], tri.Texture]);
});

_.each(model.Vertices, function(vert) {
  geometry.vertices.push(new THREE.Vector3(vert.x, vert.y, vert.z));
});

_.each(tris, function(tri) {
  if(colors[tri[3]] === undefined) {
    colors[tri[3]] = new THREE.Color(Math.floor(Math.random()*16777215));
  }

  geometry.faces.push(new THREE.Face3(
    tri[0], 
    tri[1], 
    tri[2],
    [
      normals[tri[0]],
      normals[tri[1]],
      normals[tri[2]]
    ],
    colors[tri[3]]
  ));
});

var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ 
  color: 0xffffff, 
  shading: THREE.FlatShading,
  vertexColors: THREE.VertexColors
}));

mesh.scale.y = -1;
console.log(mesh);
scene.add(mesh);

var render = function () {
  stats.begin();

  controls.update();
  light.position.set(camera.position.x, camera.position.y, camera.position.z);
  renderer.render(scene, camera);
  
  stats.end();
  requestAnimationFrame(render);
};

render();

console.log(model);