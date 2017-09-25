import React, { PureComponent } from 'react';

const Cube = ({ materials }) => (
	<mesh>
		<boxGeometry width={1} height={1} depth={1} />
		{materials[0]}
	</mesh>
);

export default Cube;
