import toBuffer from 'blob-to-buffer';

export default (name = '') => {
	return new Promise((resolve, reject) => {
		console.log(`Loading level /tombs/${name.toUpperCase()}.TR2`);
		const request = new XMLHttpRequest();
		request.open('GET', `/tombs/${name.toUpperCase()}.TR2`, true);
		request.responseType = 'blob';
	
		request.onload = () => {
			toBuffer(request.response, (err, buffer) => {
				if (err) {
					reject(err);
					return;
				}

				console.log(`Finish loading level ${name}`);
				resolve(buffer);
			});
		}

		request.onerror = () => {
			console.log(request);
			reject();
		}
	
		request.send();
	});
}
