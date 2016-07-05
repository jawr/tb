import React from 'react'
import { Link } from 'react-router'
import AddActivity from '../activity/add.js'
import ActivityStore from '../activity/store.js'
import CategoryStore from './store.js'
import Keyword from '../keyword/keyword.js'
import style from './style.scss'
import Spinner from '../utils/spinner/spinner.js'
import Breadcrumb from '../utils/breadcrumb/breadcrumb.js'

export default class Category extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			category: null,
			activities: null
		};

		CategoryStore.on('Get', this.handleGet);
		ActivityStore.on('Get.Cat.' + this.props.params.id, this.handleGetActivities);
		CategoryStore.Get(this.props.params.id);
		ActivityStore.GetByCategory(this.props.params.id);
	}

	componentWillUnmount() {
		CategoryStore.off('Get', this.handleGet);
		ActivityStore.off('Get.Cat.' + this.props.params.id, this.handleGetActivities);
	}

	handleGet = (category) => {
		this.setState({category: category})
	}

	handleGetActivities = (activities) => {
		this.setState({activities: activities})
	}

	handleActivityDelete = (activity) => {
		ActivityStore.Delete(activity);
	}

	renderActivities = () => {
		if (!this.state.activities) return <Spinner />
		const self = this;
		const activities = this.state.activities.map(
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
						<td><Link to={`/activity/${i.id}`}>{i.name}</Link></td>
						<td>{i.slug}</td>
						<td>{keywords || 0}</td>
						<td>{(i.locations) ? i.locations.length : 0}</td>
						<td>n/a</td>
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
						<th>Users</th>
					</tr>
				</thead>
				<tbody>
					{activities}
				</tbody>
			</table>
		)
	}

	render() {
		if (!this.state.category) return <Spinner />
		const category = this.state.category;
		return (
			<div>	
				<Breadcrumb>
					<Link to="/">Categories</Link>
					<span>{category.name}</span>
				</Breadcrumb>
				<div className={style.category}>
					<h5>{category.name}</h5>
					{this.renderActivities()}
					<AddActivity category={category} />
				</div>
			</div>
		)
	}
}
