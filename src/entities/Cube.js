import { Mesh, BoxGeometry, MeshNormalMaterial } from 'three';

export default class Cube extends Mesh {
	constructor() {
		super();

		this.geometry = new BoxGeometry(1, 1, 1);
		this.material = new MeshNormalMaterial();
	}

	render() {
		console.log('render');
	}
}