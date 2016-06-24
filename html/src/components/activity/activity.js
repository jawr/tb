import React from 'react';

export class Activity extends React.Component {
	render() {
		return (
			<p>{this.props.activity.name}</p>
		)
	}
}
