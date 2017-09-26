import React, { PureComponent } from 'react';
import * as THREE from 'three';

import Tomb from '../../../Tomb';

const Scene = Tomb(class Scene extends PureComponent {
	constructor(props) {
		super(props);

		this.props.camera.moveTo(new THREE.Vector3(0, 0, 4), new THREE.Vector3(0, 0, 0), false);

		this.nextStep(props.step);
	}

	componentWillReceiveProps(nextProps) {
		this.nextStep(nextProps.step);
	}

	nextStep(step) {
		const { camera } = this.props;

		switch (step) {
			case 0:
				this.setTextureFilters(THREE.LinearFilter, THREE.LinearMipMapLinearFilter);
				camera.moveTo(new THREE.Vector3(0, 0, 4), new THREE.Vector3(0, 0, 0));
				break;

			case 1:
				this.setTextureFilters(THREE.LinearFilter, THREE.LinearMipMapLinearFilter);
				camera.moveTo(new THREE.Vector3(-2.25, 2.25, 0.4), new THREE.Vector3(-2.25, 2.25, 0));
				break;

			case 2:
				this.setTextureFilters(THREE.NearestFilter, THREE.NearestMipMapLinearFilter);
		}
	}

	setTextureFilters(mag, min) {
		this.props.materials.forEach(material => {
			material.map.magFilter = mag;
			material.map.minFilter = min;
			material.map.needsUpdate = true;
		});
	}

	render() {
		const { materials } = this.props;

		return (
			<group>
				{materials.map((material, i) => {
					const x = ((i % 4) * 1.5) - 2.25;
					const y = (Math.floor(i / 4) * -1.5) + 2.25;
		
					return (
						<mesh key={i} material={material} position={new THREE.Vector3(x, y, 0)}>
							<planeGeometry width={1} height={1} />
						</mesh>
					)
				})}
			</group>
		)
	}
});

export default Scene;
