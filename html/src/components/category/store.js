import Flux from 'flux-react';

const Actions = Flux.createActions([
	'_insert',
	'_delete',
	'_get',
	'_getAll'
]);

const URL = 'http://jess.lawrence.pm/tb/api/v1/categories/';

const CategoryStore = Flux.createStore({
	// actions
	actions: [
		Actions._insert,
		Actions._delete,
		Actions._get,
		Actions._getAll
	],
	_insert: function(_id, name) {
		const self = this;
		const obj = {
			name: name
		};
		$.post(URL, JSON.stringify(obj))
		.done(function(data) {
			const _obj = JSON.parse(data);
			self.emit('Insert.'+_id, _obj);
			self.emit('Get', _obj);
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
			const category = obj.category;
			self.all = self.all.filter(function(e) { return e.id !== obj.id });
			self.emit('Delete', obj);
			self.emit('Get', null);
		})
		.fail(function(data) {
			self.emit('Delete.Fail', JSON.parse(data));
		});
	},
	_get: function(id) {
		const self = this;
		$.get(URL + '/' + id)
		.done(function(data) {
			self.emit('Get', JSON.parse(data)[0]);
		})
		.fail(function(data) {
			self.emit('Get.Fail');
		});
	},
	_getAll: function() {
		const self = this;
		$.get(URL)
		.done(function(data) {
			self.emit('GetAll', JSON.parse(data));
		})
		.fail(function(data) {
			self.emit('GetAll.Fail');
		});
	},
	exports: {
		Get: function(id) { Actions._get(id) },
		GetAll: function() { Actions._getAll() },
		Insert: function(_id, name) { Actions._insert(_id, name) },
		Delete: function(obj) { Actions._delete(obj) }
	}
});

export default CategoryStore;

