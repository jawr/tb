import React from 'react';



export class Add extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			config: props.setup,
			busy: props.busy || false,
			value: ''
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({busy: nextProps.busy || false});
	}

	handleChange = (e) => {
		this.setState({value: e.target.value});
	}

	handleClick = () => {
		this.state.config.handleClick(this.state.value);
	}

	render() {
		const config = this.state.config;
		const busy = this.state.busy;
		return(
			<div>
				<h5>{config.header}</h5>
				<p>{config.slug}</p>
				<form>
					<div className="row">
						<div className="three columns">
							<input 
								type="text"
								value={this.state.value} 
								onChange={this.handleChange} 
							/>
						</div>
						<div className="three columns">
							<button 
								onClick={this.handleClick} 
								disabled={busy}
							>Add</button>
						</div>
						<div className="three columns">
							{this.props.children}
						</div>
					</div>
				</form>
			</div>
		)
	}
}

Add.propTypes = {
	setup: React.PropTypes.shape({
		header: React.PropTypes.string.isRequired,
		slug: React.PropTypes.string,
		handleClick: React.PropTypes.func.isRequired
	}).isRequired,
	busy: React.PropTypes.bool
}
