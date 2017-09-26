import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import React3 from 'react-three-renderer';
import { connect } from 'react-redux';
import Measure from 'react-measure'
import { Appear } from 'spectacle';
import styled from 'styled-components';
import * as THREE from 'three';
import OrbitControls from 'three-orbit-controls';
import { get } from 'lodash';

import Level from './Level';
import Camera from './Camera';

const Controls = OrbitControls(THREE);

export default (WrappedComponent) => {
	return class extends PureComponent{
		static propTypes = {
			size: PropTypes.number,
			margin: PropTypes.number,
		}

		static defaultProps = {
			size: 1,
			margin: 0,
		}

		constructor(props) {
			super(props);

			this.state = {
				isLoaded: false,
				camera: null,
				width: window.innerWidth - props.margin,
				height: window.innerHeight - props.margin,
			};

			this.cameraPosition = new THREE.Vector3(2, 2, 2);

			this.setCamera = this.setCamera.bind(this);
			this.handleLevelLoad = this.handleLevelLoad.bind(this);
		}

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
			const { size } = this.props;
			const { width, height, isLoaded, camera, buffer, materials } = this.state;

			return (
				<React3
					mainCamera="camera"
					clearColor={0xffffff}
					clearAlpha={0}
					alpha
					width={width * size}
					height={height}
				>
					<scene>
						<Camera ref={this.setCamera} width={width * size} height={height} />
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
