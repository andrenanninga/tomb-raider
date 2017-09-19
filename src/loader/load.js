import c from 'c-struct';
import Struct from 'struct';
import toBuffer from 'blob-to-buffer';
import { times } from 'lodash';

console.dir(Struct);

// Struct.uint32 = Struct.word32Ule;

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
	.array('colour', 256 * 32, 'word8Ule');

const tr_textile16 = Struct()
	.array('colour', 256 * 32, 'word16Ule');

const level = Struct()
	.word32Ule('version')
	.array('palette', 768, 'word8')
	.array('palette16', 1024, 'word8')
	.word32Ule('numTextiles')
	.array('textile8', 13, tr_textile8)
	.array('textile16', 13, tr_textile16)

level.allocate();

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
	request.open('GET', '/tombs/LIVING.TR2', true);
	request.responseType = 'blob';
	
	request.onload = function(oEvent) {
		const blob = request.response;
		toBuffer(blob, (err, buffer) => {
			level.setBuffer(buffer);

			console.log(level.fields);

			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');
			canvas.id = 'canvas';
			canvas.width = 256;
			canvas.height = 256;
			canvas.style.cssText = `
				width: 256px;
				height: 256px;
				border: 2px solid rgba(255, 0, 255, 1);
				position: absolute;
				top: 0;
			`;

			document.body.appendChild(canvas);

			const colours = level.fields.textile16[4].colour;
			const textile = context.createImageData(256, 256);

			times(256 * 256, (i) => {
				const color = colours[i] || 0;

				const alpha = (color & 0x8000) * 255;
				const red = ((color & 0x7c00) >> 10) * 8;
				const green = ((color & 0x03e0) >> 5) * 8;
				const blue = (color & 0x001f) * 8;

				if (Math.random() > 0.999) {
					console.log(color.toString(16))
					console.log({ red, green, blue });
				}
				
				textile.data[i * 4] = red;
				textile.data[i * 4 + 1] = green;
				textile.data[i * 4 + 2] = blue;
				textile.data[i * 4 + 3] = 255;
			});

			console.log('put', textile);
			context.putImageData(textile, 0, 0);
		});
	};
	
	request.send();
}