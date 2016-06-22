var Flux = require('flux-react');

var Actions = Flux.createActions([
	'getLocations'
]);

module.exports = Flux.createStore({
	locations: [],
	actions: [
		Actions.getLocations
	],
	getLocations: function() {
		var self = this;
		$.get('/tb/api/v1/locations/')
		.done(function(data) {
			self.locations = $.parseJSON(data);
			self.emit('getLocations.done');
		})
		.fail(function(data) {
			console.log('getLocations fail');
		});
	},
	exports: {
		GetLocations: function() {
			Actions.getLocations();
		},
		Locations: function() {
			return this.locations;
		}
	}
});
