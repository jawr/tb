import Flux from 'flux-react'

const Actions = Flux.createActions([
	'_insert',
	'_delete',
	'_getByCategory'
]);

const URL = '/tb/api/v1/activities/';

const ActivityStore = Flux.createStore({
	// state
	activities: {},
	// actions
	actions: [
		Actions._insert,
		Actions._delete,
		Actions._getByCategory
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
			if (!(category.id in self.activities))
				self.activities[category.id] = [];
			self.activities[category.id].push(_obj);
			self.emit('Insert.'+_id, _obj);
			self.emit('Get.'+category.id);
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
			const category = obj.category;
			if (category.id in self.activities) {
				self.activities[category.id] = self.activities[category.id].filter(
					function(e) { return e.id !== obj.id }
				);
			}
			self.emit('Delete', obj);
			self.emit('Get.'+category.id);
		})
		.fail(function(data) {
			self.emit('Delete.Fail', JSON.parse(data));
		});
	},
	_getByCategory: function(category) {
		const self = this;
		$.get(URL+'category/'+category.id+'/')
		.done(function(data) {
			const list = JSON.parse(data);
			if (list.length > 0) {
				self.activities[category.id] = list;
			}
			self.emit('Get.'+category.id);
		})
		.fail(function(data) {
			self.emit('Get.Fail');
		});
	},
	exports: {
		Insert: function(_id, name, category) {
			Actions._insert(_id, name, category);
		},
		Delete: function(obj) {
			Actions._delete(obj);
		},
		GetByCategory: function(category) {
			Actions._getByCategory(category);
		},
		//
		ByCategory: function(category) {

			return this.activities[category.id] || [];
		}
	}
});

export { ActivityStore };
