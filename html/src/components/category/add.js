import React from 'react';
import CategoryStore from './store.js';
import Add from '../add/add.js';

export default class AddCategory extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			busy: false,
			child: null,
			id: Math.random().toString(36).substr(2, 9)
		};

		// store handlers
		CategoryStore.on('Insert.'+this.state.id, this.handleInsert);

	}

	componentWillUnmount() {
		CategoryStore.off('Insert.'+this.state.id, this.handleInsert);
	}

	handleInsert = (obj) => {
		this.setState({
			busy: false,
			child: <p>Added {obj.name}</p>
		});
	}

	handleClick = (value) => {
		this.setState({busy: true});
		CategoryStore.Insert(this.state.id, value);
	}

	setup = () => {
		return {
			header: "Add Category",
			slug: "Create a new Category",
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
