import Flux from 'flux-react'

const Actions = Flux.createActions([
	'_show',
	'_hide'
]);

const ModalStore = Flux.createStore({
	actions: [
		Actions._show,
		Actions._hide
	],
	_show: function() {
		this.emit('Show', true);
	},
	_hide: function() {
		this.emit('Show', false);
	},
	exports: {
		Show: function() { Actions._show() },
		Hide: function() { Actions._hide() }
	}
});

export default ModalStore;
