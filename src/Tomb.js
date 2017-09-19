import React, { PureComponent } from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import OrbitControls from 'three-orbit-controls';

import load from './loader/load';

const Controls = OrbitControls(THREE);

export default class Tomb extends PureComponent {
	constructor(props) {
		super(props);

		this.cameraPosition = new THREE.Vector3(0, 0, 5);

		load();

		this.setCamera = this.setCamera.bind(this);
	}
	
	setCamera(ref) {
		this.camera = ref;
		this.controls = new Controls(this.camera);
	}

	componentWillUnmount() {
		this.controls.dispose();
		delete this.controls;
	}

	render() {
		const width = window.innerWidth;
		const height = window.innerHeight;

		return (
			<React3
				mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
				width={width}
				height={height}
			>
				<scene>
					<perspectiveCamera
						ref={this.setCamera}
						name="camera"
						fov={75}
						aspect={width/height}
						near={0.1}
						far={10000}
						position={this.cameraPosition}
					/>

					<mesh>
						<boxGeometry
							width={1}
							height={1}
							depth={1}
						/>
						<meshNormalMaterial />
					</mesh>
				</scene>
			</React3>
		)
	}
}