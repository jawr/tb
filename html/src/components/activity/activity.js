import React from 'react'
import ActivityStore from './store.js'
import Keywords from '../keyword/keywords.js'
import Locations from '../locations/locations.js'
import { Link } from 'react-router'
import style from './style.scss'
import Spinner from '../utils/spinner/spinner.js'
import Breadcrumb from '../utils/breadcrumb/breadcrumb.js'

export default class Activity extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activity: {}
		};

		ActivityStore.on('Get.' + this.props.params.id, this.handleChange);
		ActivityStore.GetByID(this.props.params.id);
	}

	componentWillUnmount() {
		ActivityStore.off('Get.' + this.props.params.id, this.handleChange);
	}

	handleChange = (activity) => {
		this.setState({activity: activity});
	}

	renderKeywords = () => {
		return <Keywords activity={this.state.activity} />
	}

	renderLocations = () => {
		return <Locations activity={this.state.activity} locations={this.state.activity.locations} />
	}

	render() {
		if ($.isEmptyObject(this.state.activity)) return <Spinner />
		const activity = this.state.activity;
		return (
			<div>
				<Breadcrumb>
					<Link to="/">Categories</Link>
					<Link to={`/category/${activity.category.id}`}>{activity.category.name}</Link>
					<span>{activity.name}</span>
				</Breadcrumb>
				<div className={style.activity}>
					<h4>{activity.name} <small className={style.category}>{activity.category.name}</small></h4>
					<p>{activity.slug}</p>
					
					{this.renderKeywords()}

					{this.renderLocations()}
				</div>
			</div>
		)
	}
}
