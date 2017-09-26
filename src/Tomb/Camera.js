import React, { PureComponent } from 'react';
import * as THREE from 'three';
import { Easing, Tween, autoPlay } from 'es6-tween'
import { invoke } from 'lodash';

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
		if (this.positionTween) {
			this.positionTween.stop();
			delete this.positionTween;
		}

		if (this.lookAtTween) {
			this.lookAtTween.stop();
			delete this.lookAtTween;
		}

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
		}
	}

	moveTo(position = null, lookAt = null, animated = true) {
		if (animated) {
			autoPlay(true);
	
			if (position) {
				this.positionTween = new Tween(this.camera.position)
					.to({ x: position.x, y: position.y, z: position.z }, 1000)
					.start();
			}
	
			if (lookAt) {
				this.lookAtTween = new Tween(this.controls.target)
					.to({ x: lookAt.x, y: lookAt.y, z: lookAt.z }, 1000)
					.on('update', () => invoke(this.controls, 'update'))
					.start();
			}
		}
		else {
			if (position) {
				this.camera.position.set(position.x, position.y, position.z);
			}
			if (lookAt) {
				this.controls.target.set(lookAt.x, lookAt.y, lookAt.z);
			}
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