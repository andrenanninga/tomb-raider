import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import axios from 'axios';
import { times } from 'lodash';
import hamsters from 'hamsters.js';

import { numTextiles, textile16 } from '../loader/slice';
import loadTextile16 from '../loader/textile16';

import Cube from '../entities/Cube';

hamsters.init();

export default class Level extends PureComponent {
	static propTypes = {
		onLoad: PropTypes.func,
	}

	static defaultProps = {
		onLoad: () => {},
	}

	constructor(props) {
		super(props);

		this.buffer = null;
		this.materials = null;

		this.loadLevel = this.loadLevel.bind(this);
		this.prepareMaterials = this.prepareMaterials.bind(this);
	}
	
	componentDidMount() {
		this.loadLevel(this.props.name);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.name !== nextProps.name) {
			this.loadLevel(nextProps.name);
		}
	}

	async loadLevel(name) {
		const url = `/tombs/${name.toUpperCase()}.TR2`;

		const result = await axios.get(url, {
			responseType: 'arraybuffer',
		});

		this.buffer = new Buffer(result.data);

		await this.prepareMaterials();

		this.props.onLoad(this.buffer, this.materials)
	}

	async prepareMaterials() {
		const amount = numTextiles(this.buffer);
		
		const promises = times(amount, async (i) => {
			const textile = textile16(this.buffer, false, i);
			const imageData = await loadTextile16(textile);

			const texture = new THREE.Texture(imageData);
			texture.needsUpdate = true;

			const material = new THREE.MeshBasicMaterial({
				map: texture,
				wireframe: false,
				transparent: true,
			});

			texture.magFilter = THREE.NearestFilter;
			texture.minFilter = THREE.NearestMipMapLinearFilter;

			return material;
		});

		this.materials = await Promise.all(promises);
	}

	render() {
		return null;
	}
}