/* eslint-disable no-undef */

import hamsters from 'hamsters.js';

export default async (textile) => {
	return new Promise((resolve, reject) => {
		const run = () => {
			const image = new ImageData(256, 258 * 13);

			for (let i = 0; i < 256 * 258 * 13 * 2; i += 2) {
				const color = (params.textile[i + 1] << 8) + params.textile[i];
				const red = ((color & 0x7C00) >> 10) * 8;
				const green = ((color & 0x03E0) >> 5) * 8;
				const blue = (color & 0x001F) * 8;

				image.data[i * 2] = red;
				image.data[i * 2 + 1] = green;
				image.data[i * 2 + 2] = blue;
				image.data[i * 2 + 3] = 255;
			}

			rtn.data = image;
		}

		const callback = (result) => {
			resolve(result[0])
		}

		hamsters.run({ textile }, run, callback);
	});
}
