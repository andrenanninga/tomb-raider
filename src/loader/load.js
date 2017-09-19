import c from 'c-struct';
import Struct from 'struct';
import toBuffer from 'blob-to-buffer';

console.dir(Struct);

const level = Struct()
	.word32Ule('version');

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
			console.log(buffer.readUInt32LE(0));

			level.setBuffer(buffer, buffer.size);


			console.log(level.fields);
		});
	};
	
	request.send();
}