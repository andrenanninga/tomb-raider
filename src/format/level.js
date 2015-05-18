'use strict';

var _       = require('underscore');
var jBinary = require('jbinary');
var structs = require('./structs');

var config = _.extend({}, structs, {
  'jBinary.all': 'Level',
  'jBinary.littleEndian': true,

  tell: jBinary.Type({
    read: function() {
      return this.binary.tell();
    }
  }),

  Room: jBinary.Type({
    read: function() {
      var data = {};

      data.RoomInfo = this.binary.read('tr2_room_info');

      data.NumData = this.binary.read('uint32');
      data.RoomData = this.binary.read('RoomData');

      data.NumDoors = this.binary.read('uint16');
      data.Doors = this.binary.read(['array', 'tr2_room_door', data.NumDoors]);

      data.NumZsector = this.binary.read('uint16');
      data.NumXsector = this.binary.read('uint16');
      data.SectorData = this.binary.read(['array', 'tr2_room_sector', data.NumZsector * data.NumXsector]);

      data.Intensity1 = this.binary.read('int16');
      data.Intensity2 = this.binary.read('int16');
      data.LightMode = this.binary.read('int16');

      data.NumLights = this.binary.read('uint16');
      data.Lights = this.binary.read(['array', 'tr2_room_light', data.NumLights]);

      data.NumStaticMeshes = this.binary.read('uint16');
      data.StaticMeshes = this.binary.read(['array', 'tr2_room_staticmesh', data.NumStaticMeshes]);

      data.AlternateRoom = this.binary.read('int16');
      data.Flags = this.binary.read('uint16');

      return data;
    }
  }),

  RoomData: jBinary.Type({
    read: function() {
      var data = {};

      data.NumVertices = this.binary.read('uint16');
      data.Vertices = this.binary.read(['array', 'tr2_room_vertex', data.NumVertices]);

      data.NumRectangles = this.binary.read('uint16');
      data.Rectangles = this.binary.read(['array', 'tr2_face4', data.NumRectangles]);

      data.NumTriangles = this.binary.read('uint16');
      data.Triangles = this.binary.read(['array', 'tr2_face3', data.NumTriangles]);

      data.NumSprites = this.binary.read('uint16');
      data.Sprites = this.binary.read(['array', 'tr2_room_sprite', data.NumSprites]);

      return data;
    }
  }),

  Meshes: jBinary.Type({
    read: function(context) {
      var start = this.binary.tell();
      var end = this.binary.tell() + context.NumMeshData * 2;
      var data = [];

      var pointers = this.binary.seek(end, function() {
        var num = this.read('uint32');
        return this.read(['array', 'uint32', num]);
      });

      for(var i = 0; i < pointers.length; i++) {
        var pointer = pointers[i];

        this.binary.seek(start + pointer);
        data.push(this.binary.read('tr2_mesh'));
      }

      this.binary.seek(end);

      return data;
    }
  }),

  Animations: jBinary.Type({
    read: function(context) {
      var self = this;
      var data = [];

      this.binary.seek(context.AnimationsStart, function() {
        data = self.binary.read(['array', 'tr2_animation', context.NumAnimations]);
      });

      return data;
    }
  }),

  Frames: jBinary.Type({
    read: function(context) {
      var end = this.binary.tell() + context.NumFrames * 2;

      var data = [];

      while(this.binary.tell() < end) {
        data.push(this.binary.read('tr2_frame'));
      }

      return data;
    }
  }),

  Level: ['object', {
    _frameCounter: 0,

    Version: 'uint32',
    
    Palette: ['skip', 768],
    
    // Palette16: ['skip', 1024],
    Palette16: ['array', 'tr2_colour4', 256],

    NumTextiles: 'uint32',
    Textile8: ['skip', function(context) { return context.NumTextiles * 65536; }],
    Textile16: ['skip', function(context) { return context.NumTextiles * 131072; }],

    Unused: ['skip', 4],
    
    NumRooms: 'uint16',
    Rooms: ['array', 'Room', function(context) { return context.NumRooms; }],

    NumFloorData: 'uint32',
    // FloorData: ['array', 'uint16', function(context) { return context.NumFloorData; }],
    FloorData: ['skip',  function(context) { return context.NumFloorData * 2; }],

    NumMeshData: 'uint32',
    Meshes: 'Meshes',
    // Meshes: ['skip', function(context) { return context.NumMeshData * 2; }],
    
    NumMeshPointers: 'uint32',
    // MeshPointers: ['array', 'uint32', function(context) { return context.NumMeshPointers; }],
    MeshPoints: ['skip', function(context) { return context.NumMeshPointers * 4; }],

    NumAnimations: 'uint32',
    AnimationsStart: 'tell',
    // Animations: ['array', 'tr2_animation', function(context) { return context.NumAnimations; }],
    _Animations: ['skip', function(context) { return context.NumAnimations * 32; }],

    NumStateChanges: 'uint32',
    // StateChanges: 'StateChanges',
    StateChanges: ['skip', function(context) { return context.NumStateChanges * 6; }],

    NumAnimDispatches: 'uint32',
    // AnimDispatches: 'AnimDispatches',
    AnimDispatches: ['skip', function(context) { return context.NumAnimDispatches * 8; }],

    NumAnimCommands: 'uint32',
    // AnimCommands: 'AnimCommands',
    AnimCommands: ['skip', function(context) { return context.NumAnimCommands * 2; }],

    NumMeshTrees: 'uint32',
    MeshTrees: ['array', 'tr2_meshtree', function(context) { return context.NumMeshTrees / 4; }],
    // MeshTrees: ['skip', function(context) { return context.NumMeshTrees * 4; }],

    NumFrames: 'uint32',
    FramesStart: 'tell',
    Frames: ['skip', function(context) { return context.NumFrames * 2; }],
    // Frames: 'Frames',

    Animations: 'Animations',

    NumMoveables: 'uint32',
    Moveables: ['array', 'tr2_moveable', function(context) { return context.NumMoveables; }],
    // Moveables: ['skip', function(context) { return context.NumMoveables * 18; }],

    NumStaticMeshes: 'uint32',
    StaticMeshes: ['array', 'tr2_staticmesh', function(context) { return context.NumStaticMeshes; }],
    // StaticMeshes: ['skip', function(context) { return context.NumStaticMeshes * 32; }],

    NumObjectTextures: 'uint32',
    ObjectTextures: ['array', 'tr2_object_texture', function(context) { return context.NumObjectTextures; }],
    // ObjectTextures: ['skip', function(context) { return context.NumObjectTextures * 20; }],

    NumSpriteTextures: 'uint32',
    SpriteTextures: ['array', 'tr2_sprite_texture', function(context) { return context.NumSpriteTextures; }],
    // SpriteTextures: ['skip', function(context) { return context.NumSpriteTextures * 16; }],

    NumSpriteSequences: 'uint32',
    SpriteSequences: ['array', 'tr2_sprite_sequence', function(context) { return context.NumSpriteSequences; }],
    // SpriteSequences: ['skip', function(context) { return context.NumSpriteSequences * 8; }],

    NumCameras: 'uint32',
    // Cameras: 'Cameras',
    Cameras: ['skip', function(context) { return context.NumCameras * 16; }],

    NumSoundSources: 'uint32',
    // SoundSources: 'SoundSources',
    SoundSources: ['skip', function(context) { return context.NumSoundSources * 16; }],

    NumBoxes: 'uint32',
    // Boxes: 'Boxes',
    Boxes: ['skip', function(context) { return context.NumBoxes * 8; }],

    NumOverlaps: 'uint32',
    // Overlaps: 'Overlaps',
    Overlaps: ['skip', function(context) { return context.NumOverlaps * 2; }],

    Zones: ['skip', function(context) { return context.NumBoxes * 20; }],

    NumAnimatedTextures: 'uint32',
    // AnimatedTextures: 'AnimatedTextures',
    AnimatedTextures: ['skip', function(context) { return context.NumAnimatedTextures * 2; }],

    NumItems: 'uint32',
    Items: ['array', 'tr2_item', function(context) { return context.NumItems; }],
    // Items: ['skip', function(context) { return context.NumItems * 24; }],

    // LightMap: ['array', 'uint8', 8192],
    LightMap: ['skip', 8192],

    NumCinematicFrames: 'uint16',
    // CinematicFrames: 'CinematicFrames',
    CinematicFrames: ['skip', function(context) { return context.NumCinematicFrames * 16; }],

    NumDemoData: 'uint16',
    // DemoData: 'DemoData',
    DemoData: ['skip', function(context) { return context.NumDemoData; }],

    // SoundMap: ['array', 'int16', 370],
    SoundMap: ['skip', 370 * 2],

    NumSoundDetails: 'uint32',
    // SoundDetails: 'SoundDetails',
    SoundDetails: ['skip', function(context) { return context.NumSoundDetails * 8; }],

    NumSampleIndices: 'uint32',
    // SampleIndices: 'SampleIndices',
    SampleIndices: ['skip', function(context) { return context.NumSampleIndices * 4; }]
  }]
});

module.exports = config;