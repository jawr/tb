import React from 'react'
import { AddActivity } from '../activity/add.js'
import { ActivityStore } from '../activity/store.js'

export class Category extends React.Component {
	constructor(props) {
		super(props);

		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.handleActivityDelete = this.handleActivityDelete.bind(this);
		this.renderActivities = this.renderActivities.bind(this);

		ActivityStore.on('Get.' + props.category.id, this.handleCategoryChange);

		ActivityStore.GetByCategory(this.props.category);
	}

	componentWillUnmount() {
		ActivityStore.off('Get.' + this.props.category.id, this.handleCategoryChange);
	}

	handleCategoryChange() {
		this.setState({});
	}

	handleActivityDelete(activity) {
		ActivityStore.Delete(activity);
	}

	renderActivities() {
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
				if (i.keywords)
					keywords = i.keywords.map(function(i, idx) { return <p key={idx}>{i.name}</p> });
				return (
					<tr key={idx}>
						<td>{i.name}</td>
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
			<div className="block">
				<h5>{category.name}</h5>
				{this.renderActivities()}
				<AddActivity category={category} />
			</div>
		)
	}
}
