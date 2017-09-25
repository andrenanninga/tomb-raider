/* eslint-disable no-undef */

import hamsters from 'hamsters.js';

export default async (textures) => {
	return new Promise((resolve, reject) => {
		const run = () => {
			importScripts('http://localhost:3000/bufferUtils.js', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/87/three.min.js');

			const reader = new BufferReader(params.textures.buffer, 0, true);
			const amount = params.textures.length / 20;

			for (let i = 0; i < amount; i++) {
				const attribute = reader.readUint16();
				const tileAndFlag = reader.readUint16();

				const triangleFace = tileAndFlag & 0b00000001;
				const tile = tileAndFlag & 0b11111110;

				for (let j = 0; j < 4; j++) {
					const xFlag = reader.readUint8();
					const x = reader.readUint8();
					const yFlag = reader.readUint8();
					const y = reader.readUint8();
				}
			}

			rtn.data = {

			};
		}

		const callback = (result) => {
			resolve(result[0])
		}

		hamsters.run({ textures }, run, callback);
	});
}
