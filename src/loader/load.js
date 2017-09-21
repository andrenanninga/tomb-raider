import c from 'c-struct';
import Struct from 'struct';
import toBuffer from 'blob-to-buffer';
import { times } from 'lodash';
import hamsters from 'hamsters.js';

import textile8Loader from './textile8';
import textile16Loader from './textile16';
import roomLoader from './room';
import { palette, textile8, textile16, rooms } from './slice';

hamsters.init({
	debug: 'verbose',
});

const tr_colour = Struct()
	.word8Ule('red')
	.word8Ule('green')
	.word8Ule('blue')

const tr_colour4 = Struct()
	.word8Ule('red')
	.word8Ule('green')
	.word8Ule('blue')
	.word8Ule('alpha')

const tr_textile8 = Struct()
	.array('colour', 256 * 256, 'word8Ule');

const tr_textile16 = Struct()
	.array('colour', 256 * 256, 'word16Ule');

const level = Struct()
	.word32Ule('version')
	.array('palette', 768, 'word8Ule')
	.array('palette16', 1024, 'word8Ule')
	.word32Ule('numTextiles')
	.array('textile8', 13 * 256 * 256, 'word8Ule')
	.array('textile16', 13 * 256 * 256, 'word16Ule')

console.log(level);

// const tr_colour = new c.Schema({
// 	red: c.type.uint8,
// 	green: c.type.uint8,
// 	blue: c.type.uint8,
// 	unused: c.type.uint8,
// });

// c.register('tr_colour', tr_colour);
// console.log(c);
// const level = new c.Schema({
// 	version: c.type.uint32,
// 	palette: [tr_colour],
// });

// c.register('Level', level);

export default () => {

	
	const request = new XMLHttpRequest();
	request.open('GET', '/tombs/ASSAULT.TR2', true);
	request.responseType = 'blob';
	
	request.onload = function(oEvent) {
		const blob = request.response;
		toBuffer(blob, async (err, buffer) => {
			// level.setBuffer(buffer);

			// console.log(level.fields);

			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');
			canvas.id = 'canvas';
			canvas.width = 256;
			canvas.height = 256 * 13;
			canvas.style.cssText = `
				width: 256px;
				height: ${256 * 13}px;
				border: 2px solid rgba(255, 0, 255, 1);
				position: absolute;
				top: 0;
			`;

			document.body.appendChild(canvas);

			const slice = (buffer, start, length) => Buffer.from(buffer.slice(start, start + length));

			// const image = await textile8Loader(
			// 	slice(buffer, 4, 768),
			// 	slice(buffer, 4 + 768 + 1024 + 4 + (65536 * palette), 65536)
			// );

			// const image = await textile8Loader(palette(buffer), textile8(buffer, false, 2));
			const image = await textile16Loader(textile16(buffer, false));

			console.log('put');
			context.putImageData(image, 0, 0);

			const room = rooms(buffer, false, 0);
			console.log(room);
			const verts = await roomLoader(room);
			console.log(verts);

			// const colours = level.fields.textile8[1].colour;
			// const textile = context.createImageData(256, 256);

			// for(let i = 0; i < 256 * 32; i++) {
			// 	const color = level.fields.palette[colours[i]] || {};
			// 	const { red, green, blue } = color;
				
			// 	// const color = colours[i] || 0;
			// 	// const alpha = (color & 0x8000) * 255;
			// 	// const red = ((color & 0x7c00) >> 10) * 8;
			// 	// const green = ((color & 0x03e0) >> 5) * 8;
			// 	// const blue = (color & 0x001f) * 8;

			// 	// if (Math.random() > 0.999) {
			// 	// 	console.log(color.toString(16))
			// 	// 	console.log({ red, green, blue });
			// 	// }
				
			// 	textile.data[i * 4] = red * 4;
			// 	textile.data[i * 4 + 1] = green * 4;
			// 	textile.data[i * 4 + 2] = blue * 4;
			// 	textile.data[i * 4 + 3] = 255;
			// }

			// console.log('put', textile);
			// context.putImageData(textile, 0, 0);
		});
	};
	
	request.send();
}