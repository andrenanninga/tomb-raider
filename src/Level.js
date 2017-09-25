import React, { PureComponent } from 'react';
import React3 from 'react-three-renderer';
import { times } from 'lodash';
import * as THREE from 'three';

import loadLevel from './loader/level';
import loadTextures from './loader/textures';
import * as slice from './loader/slice';

import Room from './Room';

export default class Level extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			level: null,
		};
		
		this.scale = new THREE.Vector3(0.001, -0.001, -0.001);
		this.position = new THREE.Vector3(-30, 0, 30);
	}

	componentWillMount() {
		this.loadLevel();
	}

	async loadLevel(props = this.props) {
		try {
			const level = await loadLevel(props.name);
			const numRooms = slice.numRooms(level);
			const rooms = times(numRooms, i => slice.rooms(level, false, i));

			console.log(slice.numObjectTextures(level));
			console.log(slice.numSpriteTextures(level));
			console.log(slice.objectTextures(level));
			const textures = await loadTextures(slice.objectTextures(level));

			this.setState({ level, rooms });
		}
		catch (e) {
			console.error(e);
		}
	}

	render() {
		const { level, rooms } = this.state;

		if (!level) {
			return null;
		}

		return (
			<group scale={this.scale} position={this.position}>
				{rooms.map((room, i) => (
					<Room key={i} room={room} />
				))}
			</group>
		);
	}
}
