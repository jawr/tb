import React from 'react'

export class InlineAdd extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			config: props.setup,
			value: ''
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleChange(e) {
		this.setState({value: e.target.value});
	}

	handleClick() {
		this.state.config.handleClick(this.state.value);
	}

	render() {
		const config = this.state.config;
		const busy = this.state.busy;
		return(
			<form>
				<input
					type="text"
					value={this.state.value}
					onChange={this.handleChange}
				/>
			</form>
		)
	}
}