export default (slide, id, visible = false) => ({
	type: 'ADD_FRAGMENT',
	payload: { slide, id, visible },
});
