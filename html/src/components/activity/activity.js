import React from 'react'
import { ActivityStore } from './store.js'
import { Keywords } from '../keyword/keywords.js'
import { Locations } from '../locations/locations.js'

export class Activity extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activity: {}
		};

		this.handleChange = this.handleChange.bind(this);
		this.renderKeywords = this.renderKeywords.bind(this);
		this.renderLocations = this.renderLocations.bind(this);

		ActivityStore.on('Get.' + this.props.params.id, this.handleChange);
		ActivityStore.GetByID(this.props.params.id);
	}

	componentWillUnmount() {
		ActivityStore.off('Get.' + this.props.params.id, this.handleChange);
	}

	handleChange(activity) {
		this.setState({activity: activity});
	}

	renderKeywords() {
		return (
			<div>
				<h5>Keywords</h5>
				<Keywords keywords={this.state.activity.keywords} />
			</div>
		)
	}

	renderLocations() {
		return (
			<div>
				<h5>Locations</h5>
				<Locations locations={this.state.activity.locations} />
			</div>
		)
	}

	render() {
		if ($.isEmptyObject(this.state.activity)) return null
		const activity = this.state.activity;
		return (
			<div className="block">
				<h4>{activity.name} <small>{activity.category.name}</small></h4>
				<p>{activity.slug}</p>
				
				{this.renderKeywords()}

				{this.renderLocations()}
			</div>
		)
	}
}
