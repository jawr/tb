import Flux from 'flux-react'

const Actions = Flux.createActions([
	'_insert',
	'_delete',
	'_getByCategory',
	'_getByID'
]);

const URL = 'http://jess.lawrence.pm/tb/api/v1/activities/';

const ActivityStore = Flux.createStore({
	// state
	activities: {},
	// actions
	actions: [
		Actions._insert,
		Actions._delete,
		Actions._getByCategory,
		Actions._getByID
	],
	_insert: function(_id, name, category) {
		const self = this;
		const obj = {
			name: name,
			category: category
		};
		$.post(URL, JSON.stringify(obj))
		.done(function(data) {
			const _obj = JSON.parse(data);
			self.emit('Insert.'+_id, _obj);
			self.emit('Get.Cat.'+category.id, _obj);
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
			self.emit('Delete', null);
			self.emit('Get.Cat.'+category.id);
		})
		.fail(function(data) {
			self.emit('Delete.Fail', JSON.parse(data));
		});
	},
	_getByCategory: function(id) {
		const self = this;
		$.get(URL+'category/'+id)
		.done(function(data) {
			self.emit('Get.Cat.'+id, JSON.parse(data));
		})
		.fail(function(data) {
			self.emit('Get.Cat.Fail');
		});
	},
	_getByID: function(id) {
		const self = this;
		$.get(URL+id)
		.done(function(data) {
			const obj = JSON.parse(data);
			self.emit('Get.'+id, obj[0]);
		})
		.fail(function(data) {
			self.emit('Get.Fail');
		});
	},
	exports: {
		Insert: function(_id, name, category) { Actions._insert(_id, name, category) },
		Delete: function(obj) { Actions._delete(obj) },
		GetByCategory: function(id) { Actions._getByCategory(id) },
		GetByID: function(id) { Actions._getByID(id) }
	}
});

export default ActivityStore;
