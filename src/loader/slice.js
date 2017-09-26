import { memoize } from 'lodash';

const SIZE = {
	INT8: 1,
	INT16: 2,
	INT32: 4,
	UINT8: 1,
	UINT16: 2,
	UINT32: 4,
};

// https://opentomb.earvillage.net/OpenTomb/doc/trosettastone.html#_version
export const version = (buffer, skip = false) => {
	const start = 0;
	const end = start + SIZE.UINT32;

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
	return num(buffer, palette16, SIZE.UINT32, skip);
}

// https://opentomb.earvillage.net/OpenTomb/doc/trosettastone.html#_8_bit_texture_tile
export const textile8 = (buffer, skip = false, index = null) => {
	const size = numTextiles(buffer);
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
	const size = numTextiles(buffer);
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
	const start = textile16(buffer, true) + SIZE.UINT32;
	const end = start + SIZE.UINT16;

	if (skip) {
		return end;
	}

	return buffer.readUInt16LE(start);
}

export const sliceRooms = (buffer, skip = false, index = null) => {
	const start = numRooms(buffer, true);
	const size = numRooms(buffer);
	let pointer = start;
	let roomStart = start;

	for (let i = 0; i < size; i++) {
		roomStart = pointer;

		// roomInfo
		pointer += 16;
		
		// dataWords
		const numDataWords = buffer.readUInt32LE(pointer);
		pointer += 4 + (numDataWords * 2);

		// portals
		const numPortals = buffer.readUInt16LE(pointer);
		pointer += 2 + (numPortals * 32);

		// sectors
		const numZsectors = buffer.readUInt16LE(pointer);
		const numXsectors = buffer.readUInt16LE(pointer + 2);
		pointer += 4 + (numZsectors * numXsectors * 8);
		
		// ambientIntensity
		pointer += 2;
		// ambientIntensity2
		pointer += 2;
		// lightMode
		pointer += 2;

		// lights
		const numLights = buffer.readUInt16LE(pointer);
		pointer += 2 + (numLights * 24);

		// staticMeshes
		const numStaticMeshes = buffer.readUInt16LE(pointer);
		pointer += 2 + (numStaticMeshes * 20);

		// alternateRoom
		pointer += 2;

		// flags
		pointer += 2;

		if (index === i) {
			return Buffer.from(buffer.slice(roomStart, pointer));
		}
	}

	const end = pointer;

	if (skip) {
		return end;
	}

	return Buffer.from(buffer.slice(start, end));
}

export const numFloorData = (buffer, skip = false) => {
	return num(buffer, sliceRooms, SIZE.UINT32, skip);
}

export const floorData = (buffer, skip = false) => {
	return chunk(buffer, numFloorData, SIZE.UINT16, skip);
}

export const numMeshData = (buffer, skip = false) => {
	return num(buffer, floorData, SIZE.UINT32, skip);
}

export const meshes = (buffer, skip = false) => {
	return chunk(buffer, numMeshData, SIZE.UINT16, skip);
}

export const numMeshPointers = (buffer, skip = false) => {
	return num(buffer, meshes, SIZE.UINT32, skip);
}

export const meshPoints = (buffer, skip = false) => {
	return chunk(buffer, numMeshPointers, SIZE.UINT32, skip);
}

export const numAnimations = (buffer, skip = false) => {
	return num(buffer, meshPoints, SIZE.UINT32, skip);
}

export const animations = (buffer, skip = false) => {
	return chunk(buffer, numAnimations, 32, skip);
}

export const numStateChanges = (buffer, skip = false) => {
	return num(buffer, animations, SIZE.UINT32, skip);
}

export const stateChanges = (buffer, skip = false) => {
	return chunk(buffer, numStateChanges, 6, skip);
}

export const numAnimDispatches = (buffer, skip = false) => {
	return num(buffer, stateChanges, SIZE.UINT32, skip);
}

export const animDispatches = (buffer, skip = false) => {
	return chunk(buffer, numAnimDispatches, 8, skip);
}

export const numAnimCommands = (buffer, skip = false) => {
	return num(buffer, animDispatches, SIZE.UINT32, skip);
}

export const animCommands = (buffer, skip = false) => {
	return chunk(buffer, numAnimCommands, 2, skip);
}

export const numMeshTrees = (buffer, skip = false) => {
	return num(buffer, animCommands, SIZE.UINT32, skip);
}

export const meshTrees = (buffer, skip = false) => {
	return chunk(buffer, numMeshTrees, 4, skip);
}

export const numFrames = (buffer, skip = false) => {
	return num(buffer, meshTrees, SIZE.UINT32, skip);
}

export const frames = (buffer, skip = false) => {
	return chunk(buffer, numFrames, 2, skip);
}

export const numMoveables = (buffer, skip = false) => {
	return num(buffer, frames, SIZE.UINT32, skip);
}

export const moveables = (buffer, skip = false) => {
	return chunk(buffer, numMoveables, 18, skip);
}

export const numStaticMeshes = (buffer, skip = false) => {
	return num(buffer, moveables, SIZE.UINT32, skip);
}

export const staticMeshes = (buffer, skip = false) => {
	return chunk(buffer, numStaticMeshes, 32, skip);
}

export const numObjectTextures = (buffer, skip = false) => {
	return num(buffer, staticMeshes, SIZE.UINT32, skip);
}

export const objectTextures = (buffer, skip = false) => {
	return chunk(buffer, numObjectTextures, 20, skip);
}

export const numSpriteTextures = (buffer, skip = false) => {
	return num(buffer, objectTextures, SIZE.UINT32, skip);
}

export const spriteTextures = (buffer, skip = false) => {
	return chunk(buffer, numSpriteTextures, 16, skip);
}

const num = (buffer, start, size, skip) => {
	const pointer = start(buffer, true);
	const end = pointer + size;

	if (skip) {
		return end;
	}

	switch (size) {
		case SIZE.UINT8:
			return buffer.readUInt8LE(pointer);
		case SIZE.UINT16:
			return buffer.readUInt16LE(pointer);
		case SIZE.UINT32:
			return buffer.readUInt32LE(pointer);
	}
}

const chunk = (buffer, start, size, skip) => {
	const pointer = start(buffer, true);
	const amount = start(buffer);
	const end = pointer + (size * amount);

	if (skip) {
		return end;
	}

	return Buffer.from(buffer.slice(pointer, end));
}