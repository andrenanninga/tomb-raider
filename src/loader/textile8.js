/* eslint-disable no-undef */

import hamsters from 'hamsters.js';

export default async (palette, textile) => {
	return new Promise((resolve, reject) => {
		const run = () => {
			const image = new ImageData(256, 256);

			for (let i = 0; i < 256 * 256; i++) {
				const index = params.textile[i];
				const red = params.palette[index * 3];
				const green = params.palette[index * 3 + 1];
				const blue = params.palette[index * 3 + 2];

				image.data[i * 4] = red * 4;
				image.data[i * 4 + 1] = green * 4;
				image.data[i * 4 + 2] = blue * 4;
				image.data[i * 4 + 3] = 255;
			}

			rtn.data = image;
		}

		const callback = (result) => {
			resolve(result[0])
		}

		hamsters.run({ palette, textile }, run, callback);
	});
}
