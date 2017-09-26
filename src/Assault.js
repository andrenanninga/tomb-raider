import React, { PureComponent } from 'react';
import * as THREE from 'three';

import Tomb from './Tomb';
import Rooms from './Tomb/Rooms';

const Scene = Tomb(class Scene extends PureComponent {
	render() {
		const { materials, buffer } = this.props;
		console.log(buffer);

		return (
			<group>
				<Rooms buffer={buffer} />
				<mesh>
					<boxGeometry width={1} height={1} depth={1} />
					<meshNormalMaterial />
				</mesh>
			</group>
		)
	}
});

export default Scene;
