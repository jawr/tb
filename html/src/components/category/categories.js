import React from 'react'
import Category from './category.js'
import CategoryStore from './store.js'
import AddCategory from './add.js'
import style from './style.scss'
import Spinner from '../utils/spinner/spinner.js'
import { Link } from 'react-router'

export default class Categories extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			categories: null
		}


		// store handlers
		CategoryStore.on('Get', this.handleGet);
		CategoryStore.on('GetAll', this.handleGetAll);
		CategoryStore.GetAll();
	}

	componentWillUnmount() {
		CategoryStore.off('Get', this.handleGet);
		CategoryStore.off('GetAll', this.handleGetAll);
	}

	handleGetAll = (categories) => {
		this.setState({categories: categories})
	}

	handleGet = (category) => {
		let categories = this.state.categories || [];
		if (category)
			categories.unshift(category);
		this.setState({categories: categories});
	}

	renderRows = () => {
		return this.state.categories.map(function(i, idx) {
			return (
				<tr key={i.id}>
					<td><Link to={`/category/${i.id}`}>{i.name}</Link></td>
					<td>{i.slug}</td>
					<td>{i.activity_count}</td>
					<td>n/a</td>
				</tr>
			)
		});
	}

	render() {
		if (!this.state.categories) return <Spinner />
		return (
			<div>
				<div className={style.categories}>
					<h1>Categories</h1>
					<table className="u-full-width">
						<thead>
							<tr>
								<th>Name</th>
								<th>Slug</th>
								<th>Activities</th>
								<th>Buddies</th>
							</tr>
						</thead>
						<tbody>
							{this.renderRows()}
						</tbody>
					</table>
					<AddCategory />
				</div>
			</div>
		)
	}
}

