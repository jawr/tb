import React from 'react'
import { Link } from 'react-router'
import AddActivity from '../activity/add.js'
import ActivityStore from '../activity/store.js'
import Keyword from '../keyword/keyword.js'
import style from './style.scss'

export default class Category extends React.Component {
	constructor(props) {
		super(props);

		ActivityStore.on('Get.Cat.' + props.category.id, this.handleCategoryChange);

		ActivityStore.GetByCategory(this.props.category);
	}

	componentWillUnmount() {
		ActivityStore.off('Get.Cat.' + this.props.category.id, this.handleCategoryChange);
	}

	handleCategoryChange = () => {
		this.setState({});
	}

	handleActivityDelete = (activity) => {
		ActivityStore.Delete(activity);
	}

	renderActivities = () => {
		const self = this;
		const activities = ActivityStore.ByCategory(this.props.category).map(
			function(i, idx) {
				// possibly turn in to a component
				const menu = (
					<ul>
						<li><a href="#" onClick={self.handleActivityDelete.bind(self, i)}>Delete</a></li>
					</ul>
				)
				let keywords = null;
				if (i.keywords) {
					keywords = i.keywords.map(function(i, idx) { 
						return <Keyword key={idx} keyword={i} ro={true} />
					});
				}
				return (
					<tr key={idx}>
						<td><Link to={`/tb/activity/${i.name}/${i.id}`}>{i.name}</Link></td>
						<td>{i.slug}</td>
						<td>{keywords}</td>
						<td>{(i.locations) ? i.locations.length : 0}</td>
						<td>{menu}</td>
					</tr>
				)
			}
		);
		return (
			<table className="u-full-width">
				<thead>
					<tr>
						<th>Name</th>
						<th>Slug</th>
						<th>Keywords</th>
						<th>Locations</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{activities}
				</tbody>
			</table>
		)
	}

	render() {
		const category = this.props.category;
		return (
			<div className={style.category}>
				<h5>{category.name}</h5>
				{this.renderActivities()}
				<AddActivity category={category} />
			</div>
		)
	}
}

Category.propTypes = {
	category: React.PropTypes.object.isRequired
}
