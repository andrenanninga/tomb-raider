'use strict';

var util = require('util');
var jBinary = require('jbinary');

var config = {
  'jBinary.all': 'Level',
  'jBinary.littleEndian': true,

  tr2_colour: {
    r: 'uint8',
    g: 'uint8',
    b: 'uint8',
  },

  tr2_colour4: ['extend', 'tr2_colour', {
    a: 'uint8'
  }],

  tr2_textile8: ['array', 'uint8', 65536],

  tr2_textile16: ['array', 'uint16', 65536],

  tr2_vertex: {
    x: 'int16',
    y: 'int16',
    z: 'int16'
  },

  tr2_room_info: {
    x: 'int32',
    z: 'int32',
    yBottom: 'int32',
    yTop: 'int32'
  },

  tr2_room_vertex: {
    Vertex: 'tr2_vertex',
    Lighting1: 'int16', // absent in TR1
    Attributes: 'uint16',
    Lighting2: 'int16' // absent in TR1
  },

  tr2_face4: {
    Vertices: ['array', 'uint16', 4],
    Texture: 'uint16'
  },

  tr2_face3: {
    Vertices: ['array', 'uint16', 3],
    Texture: 'uint16'
  },

  tr2_room_sprite: {
    Vertex: 'int16',
    Texture: 'int16'
  },

  tr2_room_door: {
    AdjoiningRoom: 'uint16',
    Normal: 'tr2_vertex',
    Vertices: ['array', 'tr2_vertex', 4]
  },

  tr2_room_sector: {
    FDindex: 'uint16',
    BoxIndex: 'uint16',
    RoomBelow: 'uint8',
    Floor: 'int8',
    RoomAbove: 'uint8',
    Ceiling: 'int8'
  },

  tr2_room_light: {
    x: 'int32',
    y: 'int32',
    z: 'int32',
    Intensity1: 'uint16',
    Intensity2: 'uint16', // absent in TR1
    Fade1: 'uint32',
    Fade2: 'uint32' // absent in TR1
  },

  tr2_room_staticmesh: {
    x: 'uint32',
    y: 'uint32',
    z: 'uint32',
    Rotation: 'uint16',
    Intensity1: 'uint16',
    Intensity2: 'uint16', // absent in TR1
    ObjectID: 'uint16'
  },

  tr2_mesh: jBinary.Type({
    read: function() {
      var data = {};
      data.Centre = this.binary.read('tr2_vertex');

      data.CollisionSize = this.binary.read('int32');

      data.NumVertices = this.binary.read('int16');
      this.binary.skip(data.NumVertices * 6);
      // data.Vertices = this.binary.read(['array', 'tr2_vertex', data.NumVertices]);

      data.NumNormals = this.binary.read('int16');
      
      if(data.NumNormals > 0) {
        this.binary.skip(data.NumNormals * 6);
        // data.Normals = this.binary.read(['array', 'tr2_vertex', data.NumNormals]);
      }
      else {
        this.binary.skip(data.NumNormals * -1 * 2);
        // data.Lights = this.binary.read(['array', 'int16', data.NumNormals * -1]);
      }

      data.NumTexturedRectangles = this.binary.read('int16');
      this.binary.skip(data.NumTexturedRectangles * 10);
      // data.TexturedRectangles = this.binary.read(['array', 'tr2_face4', data.NumTexturedRectangles]);

      data.NumTexturedTriangles = this.binary.read('int16');
      this.binary.skip(data.NumTexturedTriangles * 8);
      // data.TexturedTriangles = this.binary.read(['array', 'tr2_face3', data.NumTexturedTriangles]);

      data.NumColouredRectangles = this.binary.read('int16');
      this.binary.skip(data.NumColouredRectangles * 10);
      // data.ColouredRectangles = this.binary.read(['array', 'tr2_face4', data.NumColouredRectangles]);

      data.NumColouredTriangles = this.binary.read('int16');
      this.binary.skip(data.NumColouredTriangles * 8);
      // data.ColouredTriangles = this.binary.read(['array', 'tr2_face3', data.NumColouredTriangles]);

      return data;
    }
  }),

  Textile8: jBinary.Type({
    read: function(context) {
      return this.binary.read(['array', 'tr2_textile8', context.NumTextiles]);
    }
  }),

  Textile16: jBinary.Type({
    read: function(context) {
      return this.binary.read(['array', 'tr2_textile16', context.NumTextiles]);      
    }
  }),

  Rooms: jBinary.Type({
    read: function(context) {
      return this.binary.read(['array', 'Room', context.NumRooms]);
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

  Level: ['object', {
    Version: 'uint32',
    
    // Palette: ['array', 'tr2_colour', 256],
    Palette: ['skip', 768],
    // Palette16: ['array', 'tr2_colour4', 256],
    Palette16: ['skip', 1024],

    NumTextiles: 'uint32',
    // Textile8: 'Textile8',
    Textile8: ['skip', function(context) { return context.NumTextiles * 65536; }],
    // Textile16: 'Textile16',
    Textile16: ['skip', function(context) { return context.NumTextiles * 131072; }],

    Unused: ['skip', 4],
    
    NumRooms: 'uint16',
    Rooms: 'Rooms',

    NumFloorData: 'uint32',
    // FloorData: ['array', 'uint16', function(context) { return context.NumFloorData; }],
    FloorData: ['skip',  function(context) { return context.NumFloorData * 2; }],

    NumMeshData: 'uint32',
    Meshes: 'Meshes',
    // Meshes: ['skip', function(context) { return context.NumMeshData * 2; }],
    
    NumMeshPointers: 'uint32',
    MeshPoints: ['array', 'uint32', function(context) { return context.NumMeshPointers; }],
    // MeshPoints: ['skip', function(context) { return context.NumMeshPointers * 4; }],

    NumAnimations: 'uint32',
    // Animations: 'Animations',
    Animations: ['skip', function(context) { return context.NumAnimations * 32; }],

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
    // MeshTrees: 'MeshTrees',
    MeshTrees: ['skip', function(context) { return context.NumMeshTrees * 4; }],

    NumFrames: 'uint32',
    // Frames: 'Frames',
    Frames: ['skip', function(context) { return context.NumFrames * 2; }],

    NumMoveables: 'uint32',
    // Moveables: 'Moveables',
    Moveables: ['skip', function(context) { return context.NumMoveables * 18; }],

    NumStaticMeshes: 'uint32',
    // StaticMeshes: 'StaticMeshes',
    StaticMeshes: ['skip', function(context) { return context.NumStaticMeshes * 32; }],

    NumObjectTextures: 'uint32',
    // ObjectTextures: 'ObjectTextures',
    ObjectTextures: ['skip', function(context) { return context.NumObjectTextures * 20; }],

    NumSpriteTextures: 'uint32',
    // SpriteTextures: 'SpriteTextures',
    SpriteTextures: ['skip', function(context) { return context.NumSpriteTextures * 16; }],

    NumSpriteSequences: 'uint32',
    // SpriteSequences: 'SpriteSequences',
    SpriteSequences: ['skip', function(context) { return context.NumSpriteSequences * 8; }],

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
    // Items: 'Items',
    Items: ['skip', function(context) { return context.NumItems * 24; }],

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
};

module.exports = config;