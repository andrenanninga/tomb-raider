import { memoize } from 'lodash';

// https://opentomb.earvillage.net/OpenTomb/doc/trosettastone.html#_version
export const version = (buffer, skip = false) => {
	const start = 0;
	const end = 4;

	if (skip) {
		return end;
	}

	return Buffer.from(buffer.slice(start, end));
}

// https://opentomb.earvillage.net/OpenTomb/doc/trosettastone.html#_palette
export const palette = (buffer, skip = false) => {
	const start = version(buffer, true);
	const end = start + 768;

	if (skip) {
		return end;
	}

	return Buffer.from(buffer.slice(start, end));
}

export const palette16 = (buffer, skip = false) => {
	const start = palette(buffer, true);
	const end = start + 1024;

	if (skip) {
		return end;
	}

	return Buffer.from(buffer.slice(start, end));
}

export const numTextiles = (buffer, skip = false) => {
	const start = palette16(buffer, true);
	const end = start + 4;

	if (skip) {
		return end;
	}

	return Buffer.from(buffer.slice(start, end));
}

// https://opentomb.earvillage.net/OpenTomb/doc/trosettastone.html#_8_bit_texture_tile
export const textile8 = (buffer, skip = false, index = null) => {
	const size = numTextiles(buffer).readUInt32LE(0);
	const chunk = 256 * 256;
	const start = numTextiles(buffer, true)
	const end = start + size * chunk;

	if (skip) {
		return end;
	}

	if (index !== null) {
		if (index > size - 1) {
			throw new Error('index out of bounds');
		}

		const chunkStart = start + (index * chunk);
		const chunkEnd = chunkStart + chunk;

		return Buffer.from(buffer.slice(chunkStart, chunkEnd));
	}

	return Buffer.from(buffer.slice(start, end));
}

// https://opentomb.earvillage.net/OpenTomb/doc/trosettastone.html#_16_bit_texture_tile
export const textile16 = (buffer, skip = false, index = null) => {
	const size = numTextiles(buffer).readUInt32LE(0);
	const chunk = 256 * 256 * 2;
	const start = textile8(buffer, true);
	const end = start + size * chunk;

	if (skip) {
		return end;
	}

	if (index !== null) {
		if (index > size - 1) {
			throw new Error('index out of bounds');
		}

		const chunkStart = start + (index * chunk);
		const chunkEnd = chunkStart + chunk;

		return Buffer.from(buffer.slice(chunkStart, chunkEnd));
	}

	return Buffer.from(buffer.slice(start, end));
}

export const numRooms = (buffer, skip = false) => {
	const start = textile16(buffer, true) + 4;
	const end = start + 2;

	if (skip) {
		return end;
	}

	return Buffer.from(buffer.slice(start, end));
}

export const rooms = (buffer, skip = false, index = null) => {
	const size = numRooms(buffer).readUInt16LE(0);
	const start = numRooms(buffer, true);
	let pointer = start;

	for (let i = 0; i < 2; i++) {
		// roomInfo
		pointer += 16;
		
		// dataWords
		const numDataWords = buffer.readUInt32LE(pointer);
		pointer += 4 + (numDataWords * 2);
		console.log({ numDataWords })

		// portals
		const numPortals = buffer.readUInt16LE(pointer);
		pointer += 2 + (numPortals * 32);

		// sectors
		const numZsectors = buffer.readUInt16LE(pointer);
		const numXsectors = buffer.readUInt16LE(pointer + 2);
		console.log(pointer + 4)
		console.log({ numZsectors, numXsectors });
		pointer += 4 + (numZsectors * numXsectors * 8);
		console.log(pointer)
		
		// ambientIntensity
		pointer += 2;
		// ambientIntensity2
		pointer += 2;
		// lightMode
		pointer += 2;

		console.log(pointer);
		
		// lights
		const numLights = buffer.readUInt16LE(pointer);
		console.log({ numLights });
		pointer += 2 + (numLights * 24);

		// staticMeshes
		const numStaticMeshes = buffer.readUInt16LE(pointer);
		console.log({ numStaticMeshes });
		pointer += 2 + (numStaticMeshes * 20);

		// alternateRoom
		pointer += 2;

		// flags
		pointer += 2;
	}

	return;
}
