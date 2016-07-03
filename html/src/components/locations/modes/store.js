import Flux from 'flux-react'

const Actions = Flux.createActions([
	'_next'
]);

const LocationModeStore = Flux.createStore({
	actions: [
		Actions._next
	],
	_next: function(location) {
		this.emit('Next', location);
	},
	exports: {
		Next: function(location) { Actions._next(location) }
	}
});

export default LocationModeStore;
