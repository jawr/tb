import Flux from 'flux-react'
import ActivityStore from '../activity/store.js'

const Actions = Flux.createActions([
	'_insert',
	'_delete'
]);

const URL = '/tb/api/v1/locations/';

const LocationStore = Flux.createStore({
	// actions
	actions: [
		Actions._insert,
		Actions._delete
	],
	_insert: function(_id, postcode, activity) {
		const self = this;
		const obj = {
			postcode: postcode,
			activity: activity
		};
		$.post(URL + 'find-and-add/', JSON.stringify(obj))
		.done(function(data) {
			const _obj = JSON.parse(data);
			self.emit('Insert.'+_id, _obj);
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
			url: URL+'/'+obj.id+'/',
			data: JSON.stringify(obj)
		})
		.done(function(data) {
			self.emit('Delete', obj);
		})
		.fail(function(data) {
			self.emit('Delete.Fail', JSON.parse(data));
		});
	},
	exports: {
		Insert: function(_id, postcode, activity) {
			Actions._insert(_id, postcode, activity);
		},
		Delete: function(obj) {
			Actions._delete(obj);
		}
	}
});

export default LocationStore;

