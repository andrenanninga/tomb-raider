import React, { PureComponent } from 'react';
import React3 from 'react-three-renderer';
import { connect } from 'react-redux';
import Measure from 'react-measure'
import { Appear } from 'spectacle';
import styled from 'styled-components';
import * as THREE from 'three';
import OrbitControls from 'three-orbit-controls';
import { get } from 'lodash';

import Cube from './Cube';
import Level from './Level';
import Camera from './Camera';

const Controls = OrbitControls(THREE);

export default (WrappedComponent) => {
	return class extends PureComponent{
		constructor(props) {
			super(props);

			this.state = {
				isLoaded: false,
				camera: null,
				width: window.innerWidth - 80,
				height: window.innerHeight - 80,
			};

			this.cameraPosition = new THREE.Vector3(2, 2, 2);

			this.setCamera = this.setCamera.bind(this);
			this.handleLevelLoad = this.handleLevelLoad.bind(this);
		}
		
		componentWillMount() {
			// const { dispatch, route } = this.props;

			// dispatch({
			// 	type: 'ADD_FRAGMENT',
			// 	payload: {
			// 		id: 0,
			// 		slide: route.slide,
			// 		visible: false,
			// 	},
			// });
		}

		// componentWillReceiveProps(nextProps) {
		// 	const { route } = this.props;
		// 	const wireframe = get(nextProps, `fragment.fragments.${route.slide}[0].visible`) || false;

		// 	this.setState({ wireframe });
		// }

		setCamera(ref) {
			if (ref) {
				this.setState({
					camera: ref,
				});
			}
		}
		
		handleLevelLoad(buffer, materials) {
			this.setState({
				isLoaded: true,
				buffer,
				materials,
			})
		}

		render() {
			const { width, height, isLoaded, camera, buffer, materials } = this.state;

			console.log(camera);

			return (
				<React3
					mainCamera="camera"
					clearColor={0xffffff}
					clearAlpha={0}
					alpha
					width={width}
					height={height}
				>
					<scene>
						<Camera ref={this.setCamera} width={width} height={height} />
						<Level onLoad={this.handleLevelLoad} name="assault" />

						<axisHelper />

						{isLoaded && <WrappedComponent
							camera={camera}
							buffer={buffer}
							materials={materials}
							{...this.props}
						/>}

					</scene>
				</React3>
			)
		}
	}
}
