import Flux from 'flux-react'
import ActivityStore from '../activity/store.js'

const Actions = Flux.createActions([
	'_insert',
	'_delete',
	'_find'
]);

const URL = 'http://jess.lawrence.pm/tb/api/v1/locations/';

const LocationStore = Flux.createStore({
	// actions
	actions: [
		Actions._insert,
		Actions._delete,
		Actions._find
	],
	_insert: function(_id, location, activity) {
		const self = this;
		const obj = {
			location: location,
			activity: activity
		};
		$.post(URL, JSON.stringify(obj))
		.done(function(data) {
			self.emit('Insert.'+_id);
			ActivityStore.GetByID(activity.id);
		})
		.fail(function(data) {
			self.emit('Insert.'+_id+'.Fail', JSON.parse(data));
		});
	},
	_delete: function(obj) {
		const self = this;
		$.ajax({
			type: 'DELETE',
			url: URL+obj.id,
			data: JSON.stringify(obj)
		})
		.done(function(data) {
			self.emit('Delete', obj);
		})
		.fail(function(data) {
			self.emit('Delete.Fail', JSON.parse(data));
		});
	},
	_find: function(obj) {
		const self = this;
		$.post(URL+'find', JSON.stringify(obj))
		.done(function(data) {
			const _obj = JSON.parse(data);
			self.emit('Find', _obj);
		})
		.fail(function(data) {
			self.emit('Find.Fail', JSON.parse(data))
		});
	},
	exports: {
		Insert: function(_id, location, activity) { 
			Actions._insert(_id, location, activity) 
		},
		Delete: function(obj) { Actions._delete(obj) },
		Find: function(obj) { Actions._find(obj) }
	}
});

export default LocationStore;

