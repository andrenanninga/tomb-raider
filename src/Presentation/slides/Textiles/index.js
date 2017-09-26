import React, { PureComponent } from 'react';
import { Slide, Layout, Fill, CodePane } from 'spectacle';
import { connect } from 'react-redux';
import { findLastIndex } from 'lodash';
import dedent from 'dedent-js';

import Scene from './Scene';
import addFragment from '../../utils/addFragment';

export default class Textiles extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			step: 0,
			code: ' ',
		}

		props.dispatch(addFragment(props.hash, 0, true));
		props.dispatch(addFragment(props.hash, 1));
		props.dispatch(addFragment(props.hash, 2));

		this.nextStep(0);
	}

	componentWillReceiveProps(nextProps) {
		const fragments = Object.values(nextProps.fragments.fragments[nextProps.hash]);
		const step = Math.max(findLastIndex(fragments, { visible: true }), 0);

		this.nextStep(step);

		this.setState({ step });
	}

	nextStep(step) {
		let code = ' ';

		switch (step) {
			case -1:
			case 0:
			case 1:
				code = dedent`
					// Check the buffer to see how many textures we are dealing with
					const amount = numTextiles(this.buffer);
					
					const promises = times(amount, async (i) => {
						// Use a webworker to grab the imageData for this textile from the buffer
						const textile = textile16(this.buffer, false, i);
						const imageData = await loadTextile16(textile);

						// Use the imageData to create a Texture
						const texture = new THREE.Texture(imageData);
						texture.needsUpdate = true;

						// Create a material with the the texture
						const material = new THREE.MeshBasicMaterial({
							map: texture,
							wireframe: false,
							transparent: true,
						});
					
						return material;
					});

					// Collect all materials
					this.materials = await Promise.all(promises);
				`;
				break;

			case 2:
				code = dedent`
					// Check the buffer to see how many textures we are dealing with
					const amount = numTextiles(this.buffer);
					
					const promises = times(amount, async (i) => {
						// Use a webworker to grab the imageData for this textile from the buffer
						const textile = textile16(this.buffer, false, i);
						const imageData = await loadTextile16(textile);

						// Use the imageData to create a Texture
						const texture = new THREE.Texture(imageData);

						// Make sure the texture won't be blurry
						texture.magFilter = THREE.NearestFilter;
						texture.minFilter = THREE.NearestMipMapLinearFilter;
						texture.needsUpdate = true;

						// Create a material with the the texture
						const material = new THREE.MeshBasicMaterial({
							map: texture,
							wireframe: false,
							transparent: true,
						});
					
						return material;
					});

					// Collect all materials
					this.materials = await Promise.all(promises);
				`;
				break;
		}

		this.setState({ code });
	}

	render() {
		const { step, code } = this.state;

		return (
			<Slide>
				<Layout>
					<Fill>
						<Scene step={step} size={0.5} />
					</Fill>
					<Fill>
						<CodePane
							lang="javascript"
							source={code}
							margin="0 40px 0 20px"
						/>
					</Fill>
				</Layout>
			</Slide>
		)
	}
}