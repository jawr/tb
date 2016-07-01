import React from 'react'
import ActivityStore from './store.js'
import Keywords from '../keyword/keywords.js'
import Locations from '../locations/locations.js'
import styles from './activity.scss'

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
		return <Keywords keywords={this.state.activity.keywords} />
	}

	renderLocations = () => {
		return (
			<div>
				<Locations activity={this.state.activity} locations={this.state.activity.locations} />
			</div>
		)
	}

	render() {
		if ($.isEmptyObject(this.state.activity)) return null
		const activity = this.state.activity;
		return (
			<div className="block">
				<h4>{activity.name} <small className={styles.category}>{activity.category.name}</small></h4>
				<p>{activity.slug}</p>
				
				{this.renderKeywords()}

				{this.renderLocations()}
			</div>
		)
	}
}
