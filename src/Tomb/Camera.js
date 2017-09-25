import React, { PureComponent } from 'react';
import * as THREE from 'three';
import { Easing, Tween, autoPlay } from 'es6-tween'

import OrbitControls from 'three-orbit-controls';

const Controls = OrbitControls(THREE);

export default class Camera extends PureComponent {
	constructor(props) {
		super(props);

		this.controls = null;
		this.position = new THREE.Vector3(3, 3, 3);

		this.setCamera = this.setCamera.bind(this);
		this.moveTo = this.moveTo.bind(this);
	}
	
	componentWillUnmount() {
		if (this.controls) {
			this.controls.dispose();
			delete this.controls;
		}
	}

	setCamera(ref) {
		if (ref) {
			this.camera = ref;
			this.controls = new Controls(this.camera);
			this.controls.enableKeys = false;

			setTimeout(() => {
				console.log(this.controls);
			}, 1000);
		}
	}

	moveTo(position = null, lookAt = null) {
		autoPlay(true);

		if (position) {
			new Tween(this.camera.position)
				.to({ x: position.x, y: position.y, z: position.z }, 1000)
				.start();
		}

		if (lookAt) {
			new Tween(this.controls.target)
				.to({ x: lookAt.x, y: lookAt.y, z: lookAt.z }, 1000)
				.on('update', () => this.controls.update())
				.start();
		}
	}

	render() {
		const { width, height } = this.props;

		return (
			<perspectiveCamera
				ref={this.setCamera}
				name="camera"
				position={this.position}
				fov={75}
				aspect={width / height}
				near={0.1}
				far={10000}
			/>
		)
	}
}