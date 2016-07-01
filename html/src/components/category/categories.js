import React from 'react'
import Category from './category.js'
import CategoryStore from './store.js'
import AddCategory from './add.js'

export default class Categories extends React.Component {
	constructor(props) {
		super(props);

		// store handlers
		CategoryStore.on('Get', this.handleChange);
		CategoryStore.on('GetAll', this.handleChange);
		CategoryStore.GetAll();
	}

	componentWillUnmount() {
		CategoryStore.off('Get', this.handleChange);
		CategoryStore.off('GetAll', this.handleChange);
	}

	handleChange = (list) => {
		this.setState({});
	}

	render() {
		const categories = CategoryStore.All().map(function(i, idx) {
			return (
				<Category key={idx} category={i} />
			)
		});
		return (
			<div className="row">
				<div className="twelve columns">
					<h3>Categories</h3>
					<p>Overview of the categories currently in the system</p>
					{categories}
					<AddCategory />
				</div>
			</div>
		)
	}
}

