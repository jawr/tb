import React from 'react';
import ActivityStore from './store.js';
import Add from '../add/add.js';

export default class AddActivity extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			busy: false,
			child: null,
			id: Math.random().toString(36).substr(2, 9)
		};

		// store handlers
		ActivityStore.on('Insert.'+this.state.id, this.handleInsert);

	}

	componentWillUnmount() {
		ActivityStore.off('Insert.'+this.state.id, this.handleInsert);
	}

	handleInsert = (obj) => {
		this.setState({
			busy: false,
			child: <p>Added {obj.name}</p>
		});
	}

	handleClick = (value) => {
		this.setState({busy: true});
		ActivityStore.Insert(this.state.id, value, this.props.category);
	}

	setup = () => { 
		return {
			header: "Add Activity",
			slug: "Create a new Activity",
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

AddActivity.propTypes = {
	category: React.PropTypes.object.isRequired	
};
