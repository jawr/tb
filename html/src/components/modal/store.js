import Flux from 'flux-react'

const Actions = Flux.createActions([
	'_show',
	'_hide'
]);

const ModalStore = Flux.createStore({
	// element to show in the modal
	child: null,
	actions: [
		Actions._show,
		Actions._hide
	],
	_show: function(child) {
		this.child = child;
		this.emit('Show', true);
	},
	_hide: function() {
		// perhaps we dont need to do this
		this.child = null,
		this.emit('Show', false);
	},
	exports: {
		Show: function(child) { Actions._show(child) },
		Hide: function() { Actions._hide() },
		Child: function() { return this.child }
	}
});

export default ModalStore;
