/* eslint-disable no-undef */

import hamsters from 'hamsters.js';

export default async (room) => {
	return new Promise((resolve, reject) => {
		const run = () => {
			importScripts('http://localhost:3000/bufferUtils.js', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/87/three.min.js');
			let i = 0;

			const reader = new BufferReader(params.room.buffer, 0, true);

			const room = params.room;
			const buffer = room.buffer;

			const position = {
				x: reader.readInt32(),
				z: reader.readInt32(),
				y: 0,
			};

			reader.readInt32(); // skip yBottom
			reader.readInt32(); // skip yTop

			const numDataWords = reader.readUint32();

			const numVertices = reader.readUint16();
			const vertices = [];

			for (li = 0; i < numVertices; i++) {
				vertices.push([
					reader.readInt16(),
					reader.readInt16(),
					reader.readInt16(),
				]);

				reader.readInt16(); // skip Lighting
				reader.readUint16(); // skip Attributes
				reader.readInt16(); // skip Lighting2
			}

			const faces = [];
			const normals = [];
			const numRectangles = reader.readInt16();

			const pA = new THREE.Vector3();
			const pB = new THREE.Vector3();
			const pC = new THREE.Vector3();
			
			const cb = new THREE.Vector3();
			const ab = new THREE.Vector3();

			const addFace = (texture, vA, vB, vC) => {
				pA.set(vA[0], vA[1], vA[2]);
				pB.set(vB[0], vB[1], vB[2]);
				pC.set(vC[0], vC[1], vC[2]);
				
				cb.subVectors(pC, pB);
				ab.subVectors(pA, pB);
				
				cb.cross(ab);
				
				cb.normalize();
				
				const nx = cb.x;
				const ny = cb.y;
				const nz = cb.z;
				
				faces[texture] = faces[texture] || [];
				faces[texture].push(...[vA[0], vA[1], vA[2], vB[0], vB[1], vB[2], vC[0], vC[1], vC[2]]);
				normals.push(...[nx, ny, nz, nx, ny, nz, nx, ny, nz]);
			}

			for (i = 0; i < numRectangles; i++) {
				const verts = [
					reader.readUint16(),
					reader.readUint16(),
					reader.readUint16(),
					reader.readUint16(),
				];

				const texture = reader.readUint16();

				faces.push([verts[2], verts[1], verts[0]]);
				faces.push([verts[3], verts[2], verts[0]]);
			}

			const numTriangles = reader.readInt16();

			for (i = 0; i < numTriangles; i++) {
				const verts = [
					reader.readUint16(),
					reader.readUint16(),
					reader.readUint16(),
				];

				const texture = reader.readUint16();

				faces.push([verts[2], verts[1], verts[0]]);
			}

			const groups = [];

			rtn.data = {
				position,
				vertices,
				groups,
				normals: new Float32Array(normals),
				faces
			};
		}

		const callback = (result) => {
			resolve(result[0])
		}

		hamsters.run({ room }, run, callback);
	});
}
