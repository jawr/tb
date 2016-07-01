import Flux from 'flux-react';

const Actions = Flux.createActions([
	'_insert',
	'_delete',
	'_getAll'
]);

const URL = '/tb/api/v1/categories/';

const CategoryStore = Flux.createStore({
	// state
	all: [],
	// actions
	actions: [
		Actions._insert,
		Actions._delete,
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
			self.all.push(_obj);
			self.emit('Insert.'+_id, _obj);
			self.emit('Get');
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
			self.emit('Get');
		})
		.fail(function(data) {
			self.emit('Delete.Fail', JSON.parse(data));
		});
	},
	_getAll: function() {
		const self = this;
		$.get(URL)
		.done(function(data) {
			self.all = JSON.parse(data);
			self.emit('GetAll');
		})
		.fail(function(data) {
			self.emit('GetAll.Fail');
		});
	},
	exports: {
		GetAll: function() {
			Actions._getAll();
		},
		All: function() {
			return this.all;
		},
		Insert: function(_id, name) {
			Actions._insert(_id, name);
		},
		Delete: function(obj) {
			Actions._delete(obj);
		}
	}
});

export default CategoryStore;

