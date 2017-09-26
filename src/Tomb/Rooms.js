import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import axios from 'axios';
import { times } from 'lodash';

import { numRooms, sliceRooms } from '../loader/slice';
import loadRoom from '../loader/room';

export default class Rooms extends PureComponent {
	static propTypes = {
		onLoad: PropTypes.func,
	}

	static defaultProps = {
		onLoad: () => {},
	}

	constructor(props) {
		super(props);

		this.state = {
			scale: new THREE.Vector3(0.01, -0.01, -0.01),
			position: new THREE.Vector3(0, 0, 0),
			geometry: null,
			rooms: [],
		};

		this.loadRooms = this.loadRooms.bind(this);
	}
	
	componentDidMount() {
		this.loadRooms(this.props.buffer);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.buffer !== nextProps.buffer) {
			this.loadRooms(nextProps.buffer);
		}
	}

	async loadRooms(buffer) {
		const amount = numRooms(buffer);
		// const amount = 1;

		const promises = times(amount, async (i) => {
			const roomBuffer = sliceRooms(buffer, false, i);
			const room = await loadRoom(roomBuffer);

			const position = new THREE.Vector3(room.position.x, 0, room.position.z);

			const geometry = new THREE.Geometry();
			geometry.vertices = room.vertices.map(coords => new THREE.Vector3(...coords));
			geometry.faces = room.faces.map(coords => new THREE.Face3(...coords));

			geometry.computeFaceNormals();

			return {
				position,
				geometry,
			}
		});

		this.forceUpdate();

		const rooms = await Promise.all(promises);
		console.log(rooms);
		this.setState({ rooms });
	}

	render() {
		const { rooms, scale } = this.state;

		if (rooms.length === 0) {
			return null;
		}

		return (
			<group scale={scale}>
				{rooms.map((room, i) => (
					<mesh key={i} position={room.position} geometry={room.geometry}>
						<meshNormalMaterial wireframe />
					</mesh>
				))}
			</group>
		)
	}
}