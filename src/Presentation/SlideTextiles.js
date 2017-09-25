import React, { PureComponent } from 'react';
import * as THREE from 'three';

import Tomb from '../Tomb';

window.THREE =THREE;

const SlideTextiles = Tomb(class SlideTextiles extends PureComponent {
	componentWillMount() {
		this.props.materials.forEach(material => {
			material.map.magFilter = THREE.LinearFilter;
			material.map.minFilter = THREE.LinearMipMapLinearFilter;
			material.map.needsUpdate = true;
		});

		setTimeout(() => {
			this.props.camera.moveTo(
				new THREE.Vector3(0, 0, 4),
				new THREE.Vector3(0, 0, 0),
			);
		}, 4000)

		setTimeout(() => {
			this.props.camera.moveTo(
				new THREE.Vector3(-2.25, 2.25, 0.4),
				new THREE.Vector3(-2.25, 2.25, 0),
			);
		}, 8000)

		setTimeout(() => {
			this.props.materials.forEach(material => {
				material.map.magFilter = THREE.NearestFilter;
				material.map.minFilter = THREE.NearestMipMapLinearFilter;
				material.map.needsUpdate = true;
			});
		}, 12000)
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

export default SlideTextiles;
