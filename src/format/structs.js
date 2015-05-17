/*jslint bitwise: true */

'use strict';

var _ = require('underscore');
var jBinary = require('jbinary');

var structs = {
  tr2_colour: {
    r: 'uint8',
    g: 'uint8',
    b: 'uint8',
  },

  tr2_colour4: ['extend', 'tr2_colour', {
    a: 'uint8'
  }],

  tr2_textile8: ['array', 'uint8', 65536],

  tr2_textile16: ['array', jBinary.Type({
    read: function() {
      var ARGB = this.binary.read('uint16');

      var textile = {
        a: (ARGB >> 15) * 255,
        r: ((ARGB & 0x7c00) >> 10) * 8,
        g: ((ARGB & 0x03e0) >> 5) * 8,
        b: (ARGB & 0x001f) * 8
      };

      return textile;
    }
  }), 65536],

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

  tr2_face4: jBinary.Type({
    read: function() {
      var data = {};

      data.Vertices = this.binary.read(['array', 'uint16', 4]);
      data.Texture = this.binary.read('uint16');
      data.Palette = data.Texture >> 8;

      return data;
    }
  }),

  tr2_face3: jBinary.Type({
    read: function() {
      var data = {};

      data.Vertices = this.binary.read(['array', 'uint16', 3]);
      data.Texture = this.binary.read('uint16');
      data.Palette = data.Texture >> 8;

      return data;
    }
  }),

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

  tr2_room_staticmesh: jBinary.Type({
    read: function() {
      var data = {};

      data.x = this.binary.read('uint32');
      data.y = this.binary.read('uint32');
      data.z = this.binary.read('uint32');

      data.Rotation = this.binary.read('uint16');
      data.Rotation = (data.Rotation >> 14) * 90;

      data.Intensity1 = this.binary.read('uint16');
      data.Intensity2 = this.binary.read('uint16'); // absent in TR1
      data.ObjectID = this.binary.read('uint16');

      return data; 
    }
  }),

  tr2_mesh: jBinary.Type({
    read: function() {
      var data = {};
      data.Centre = this.binary.read('tr2_vertex');

      data.CollisionSize = this.binary.read('int32');

      data.NumVertices = this.binary.read('int16');
      // this.binary.skip(data.NumVertices * 6);
      data.Vertices = this.binary.read(['array', 'tr2_vertex', data.NumVertices]);

      data.NumNormals = this.binary.read('int16');
      
      if(data.NumNormals > 0) {
        // this.binary.skip(data.NumNormals * 6);
        data.Normals = this.binary.read(['array', 'tr2_vertex', data.NumNormals]);
      }
      else {
        // this.binary.skip(data.NumNormals * -1 * 2);
        data.Lights = this.binary.read(['array', 'int16', data.NumNormals * -1]);
      }

      data.NumTexturedRectangles = this.binary.read('int16');
      // this.binary.skip(data.NumTexturedRectangles * 10);
      data.TexturedRectangles = this.binary.read(['array', 'tr2_face4', data.NumTexturedRectangles]);

      data.NumTexturedTriangles = this.binary.read('int16');
      // this.binary.skip(data.NumTexturedTriangles * 8);
      data.TexturedTriangles = this.binary.read(['array', 'tr2_face3', data.NumTexturedTriangles]);

      data.NumColouredRectangles = this.binary.read('int16');
      // this.binary.skip(data.NumColouredRectangles * 10);
      data.ColouredRectangles = this.binary.read(['array', 'tr2_face4', data.NumColouredRectangles]);

      data.NumColouredTriangles = this.binary.read('int16');
      // this.binary.skip(data.NumColouredTriangles * 8);
      data.ColouredTriangles = this.binary.read(['array', 'tr2_face3', data.NumColouredTriangles]);

      return data;
    }
  }),

  tr2_object_texture: jBinary.Type({
    read: function() {
      var data = {};

      data.Attribute = this.binary.read('uint16');
      data.Tile = this.binary.read('uint16');
      data.Vertices = this.binary.read(['array', 'tr2_object_texture_vert', 4]);

      return data;
    }
  }),

  tr2_object_texture_vert: jBinary.Type({
    read: function() {
      var data = {};

      data.Xcoordinate = this.binary.read('uint8');
      data.Xpixel = this.binary.read('uint8');
      data.Ycoordinate = this.binary.read('uint8');
      data.Ypixel = this.binary.read('uint8');

      return data;
    }
  }),

  tr2_staticmesh: {
    ObjectID: 'uint32',
    Mesh: 'uint16',
    BoundingBox: ['array', 'tr2_vertex', 4],
    Flags: 'uint16'
  },

  tr2_moveable: jBinary.Type({
    read: function(context) {
      var self = this;
      var data = {};

      data.ObjectID = this.binary.read('uint32');
      data.NumMeshes = this.binary.read('uint16');
      data.StartingMesh = this.binary.read('uint16');
      data.MeshTree = this.binary.read('uint32') / 4;
      data.FrameOffset = this.binary.read('uint32');
      data.Animation = this.binary.read('uint16');

      var frame = context.FramesStart + data.FrameOffset;
      this.binary.seek(frame, function() {
        data.Frame = self.binary.read(['tr2_frame', data]);
      });

      return data;
    }
  }),

  tr2_item: jBinary.Type({
    read: function() {
      var data = {};

      data.ObjectID = this.binary.read('int16');
      data.Room = this.binary.read('int16');
      data.x = this.binary.read('int32');
      data.y = this.binary.read('int32');
      data.z = this.binary.read('int32');

      data.Rotation = this.binary.read('int16');
      data.Rotation = (data.Rotation >> 14) * 90;

      data.Intensity1 = this.binary.read('int16');
      data.Intensity2 = this.binary.read('int16'); // absent in TR1

      data.Flags = this.binary.read('uint16');

      return data;
    }
  }),

  tr2_meshtree: jBinary.Type({
    read: function() {
      var data = {};

      var flags = this.binary.read('int32');
      data.Push = (flags & 0x0002) === 2;
      data.Pop = (flags & 0x0001) === 1;

      data.x = this.binary.read('int32');
      data.y = this.binary.read('int32');
      data.z = this.binary.read('int32');

      return data;
    }
  }),

  tr2_sprite_texture: {
    Tile: 'uint16',
    x: 'int8',
    y: 'int8',
    Width: 'uint16',
    Height: 'uint16',
    LeftSide: 'int16',
    TopSide: 'int16',
    RightSide: 'int16',
    BottomSide: 'int16',
  },

  tr2_sprite_sequence: {
    ObjectID: 'int32',
    NegativeLength: 'int16',
    Offset: 'int16'
  },

  tr2_frame: jBinary.Type({
    params: ['moveable'],
    read: function(context) {
      var data = {};

      data.BB1x = this.binary.read('int16');
      data.BB1y = this.binary.read('int16');
      data.BB1z = this.binary.read('int16');
      
      data.BB2x = this.binary.read('int16');
      data.BB2y = this.binary.read('int16');
      data.BB2z = this.binary.read('int16');

      data.OffsetX = this.binary.read('int16');
      data.OffsetY = this.binary.read('int16');
      data.OffsetZ = this.binary.read('int16');

      data.Meshes = [];
      data.NumValues = this.moveable.NumMeshes;

      _.times(data.NumValues, function() {
        var mesh = {};

        mesh.RotationX = 0;
        mesh.RotationY = 0;
        mesh.RotationZ = 0;

        var rotation1 = this.binary.read('uint16');
        var rotation2 = this.binary.read('uint16');

        if(rotation1 & 0xC000) {
          // sinlge angle
          if((rotation1 & 0x8000) && (rotation1 & 0x4000)) {
            mesh.RotationZ = (rotation1 & 0x03FF);
          }
          else if((rotation1 & 0x4000)) {
            mesh.RotationY = (rotation1 & 0x03FF);
          }
          else {
            mesh.RotationX = (rotation1 & 0x03FF);
          }
        }
        else {
          // three angles
          mesh.RotationX = (rotation1 & 0x3FF0) >> 4;
          mesh.RotationY = ((rotation1 & 0x000f) << 6) | ((rotation2 & 0xFC00) >> 10);
          mesh.RotationZ = (rotation2 & 0x03FF);
        }

        mesh.RotationX = mesh.RotationX * 360 / 1024;
        mesh.RotationY = mesh.RotationY * 360 / 1024;
        mesh.RotationZ = mesh.RotationZ * 360 / 1024;

        data.Meshes.push(mesh);
      }, this);

      return data;
    }
  })
};

module.exports = structs;