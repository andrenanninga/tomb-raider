'use strict';

var _ = require('underscore');
var THREE = require('three');
var Stats = require('stats.js');

var Level = require('../objects/level');
new Level('boat');

var level = require('../../build/levels/boat/level.json');
var model = level.Meshes[171];

global.THREE = THREE;
global.model = model;
global.level = level;

require('../plugins/OrbitControls');

var materials = [];
var textures = [];

_.times(level.NumTextiles, function(i) {
  var texture = THREE.ImageUtils.loadTexture('/levels/boat/textiles/textile16_' + i + '.png');
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestMipMapLinearFilter;

  var material = new THREE.MeshPhongMaterial({ 
    map: texture, 
    shininess: 10, 
    wireframe: false,
    transparent: true
  });
  
  materials.push(material);
});

_.each(level.ObjectTextures, function(objectTexture) {
  var uv = [];
  var verts = objectTexture.Vertices;

  _.mixin({
    normalizeUv: function(vert) {
      var coords = _.chain(vert)
        .pick('Xpixel', 'Ypixel')
        .mapObject(function(pixel) { return pixel / 256; })
        .mapObject(function(pixel, key) { return key === 'Ypixel' ? 1 - pixel : pixel; })
        .value();

      return new THREE.Vector2(coords.Xpixel, coords.Ypixel);
    }
  });

  uv.push(_.normalizeUv(verts[0]));
  uv.push(_.normalizeUv(verts[1]));
  uv.push(_.normalizeUv(verts[2]));
  uv.push(_.normalizeUv(verts[3]));

  textures.push({ 
    tile: objectTexture.Tile,
    uv: uv
  });
});

console.log(textures);

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

var material = new THREE.MeshFaceMaterial(materials);
var geometry = new THREE.Geometry();
var normals = [];

_.times(level.NumTextiles, function(i) {
  geometry.faceVertexUvs.push([]);
});

_.each(model.Normals, function(normal){
  normals.push(new THREE.Vector3(normal.x, normal.y, normal.z).normalize());
});

_.each(model.Vertices, function(vert) {
  geometry.vertices.push(new THREE.Vector3(vert.x, vert.y, vert.z));
});

_.each(model.TexturedRectangles, function(rect) {
  var texture = textures[rect.Texture];
  var uv = texture.uv;

  geometry.faces.push(new THREE.Face3(
    rect.Vertices[0], 
    rect.Vertices[1], 
    rect.Vertices[2],
    [
      normals[rect.Vertices[0]],
      normals[rect.Vertices[1]],
      normals[rect.Vertices[2]]
    ],
    0xffffff,
    texture.tile
  ));

  geometry.faces.push(new THREE.Face3(
    rect.Vertices[0], 
    rect.Vertices[2], 
    rect.Vertices[3],
    [
      normals[rect.Vertices[0]],
      normals[rect.Vertices[2]],
      normals[rect.Vertices[3]]
    ],
    0xffffff,
    texture.tile
  ));

  geometry.faceVertexUvs[0].push([uv[0], uv[1], uv[2]]);
  geometry.faceVertexUvs[0].push([uv[0], uv[2], uv[3]]);
});

_.each(model.TexturedTriangles, function(tri) {
  var texture = textures[tri.Texture];
  var uv = texture.uv;

  geometry.faces.push(new THREE.Face3(
    tri.Vertices[0], 
    tri.Vertices[1], 
    tri.Vertices[2],
    [
      normals[tri.Vertices[0]],
      normals[tri.Vertices[1]],
      normals[tri.Vertices[2]]
    ],
    0xffffff,
    texture.tile
  ));

  geometry.faceVertexUvs[0].push([uv[0], uv[1], uv[2]]);
});

var mesh = new THREE.Mesh(geometry, material);

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