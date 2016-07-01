import React from 'react'
import Category from './category.js'
import CategoryStore from './store.js'
import AddCategory from './add.js'
import style from './style.scss'

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
			<div>
				<div className={style.categories}>
					<h1>Categories</h1>
					<p>Overview of the categories currently in the system</p>
					<AddCategory />
				</div>
				{categories}
			</div>
		)
	}
}

