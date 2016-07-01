import React from 'react';
import LocationStore from './store.js';
import Add from '../add/add.js';

export default class AddLocation extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			busy: false,
			child: null,
			id: Math.random().toString(36).substr(2, 9)
		};

		// store handlers
		LocationStore.on('Insert.'+this.state.id, this.handleInsert);

	}

	componentWillUnmount() {
		LocationStore.off('Insert.'+this.state.id, this.handleInsert);
	}

	handleInsert = (obj) => {
		this.setState({
			busy: false,
			child: <p>Added {obj.name}</p>
		});
	}

	handleClick = (value) => {
		this.setState({busy: true});
		LocationStore.Insert(this.state.id, value, this.props.activity);
	}

	setup = () => { 
		return {
			header: "Add Location",
			slug: "Create a new Location",
			handleClick: this.handleClick
		}
	}


	render() {
		return (
			<Add setup={this.setup()} busy={this.state.busy}>
				{this.state.child}
			</Add>
		)

	}
}

AddLocation.propTypes = {
	activity: React.PropTypes.object.isRequired	
};

