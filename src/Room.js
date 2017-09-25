import React, { PureComponent } from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';

import loadRoom from './loader/room';

export default class Room extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			faces: null,
			position: new THREE.Vector3(),
			vertices: [],
		};
	}

	componentWillMount() {
		this.loadRoom();
	}

	async loadRoom(props = this.props) {
		try {
			const room = await loadRoom(this.props.room);

			this.setState({
				faces: new THREE.BufferAttribute(room.faces, 3),
				normals: new THREE.BufferAttribute(room.normals, 3),
				position: new THREE.Vector3(room.position.x, room.position.y, room.position.z),
				vertices: room.vertices.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
			});
		}
		catch (e) {
			console.error(e);
		}
	}

	geometry(c) {
		console.log(c);
	}

	render() {
		const { position, faces, normals, vertices } = this.state;

		if (!faces) {
			return null;
		}

		return (
			<mesh position={position}>
				<bufferGeometry ref={this.geometry} index={null} position={faces} normal={normals} />
				<meshNormalMaterial />
			</mesh>
		)
	}
}
