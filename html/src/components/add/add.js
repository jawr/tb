import React from 'react';
import style from './style.scss';

export default class Add extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			config: props.setup,
			busy: props.busy || false,
			value: '',
			show: props.show || false
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

	handleHeaderClick = () => {
		this.setState({show: !this.state.show});
	}

	render() {
		const config = this.state.config;
		const busy = this.state.busy;

		let child = null;
		if (this.state.show) {
			child = (
				<div>
					<h1>{config.header}</h1>
					<div className="row">
						<form>
							<input 
								type="text"
								value={this.state.value} 
								onChange={this.handleChange} 
							/>
							<button 
								onClick={this.handleClick} 
								disabled={busy}
								>Add</button>
						</form>
					</div>
					<div className="row">
						{this.props.children}
					</div>
				</div>
			)
		} else {
			child = (
				<button 
					onClick={this.handleHeaderClick}
					className="button">{config.header}</button>
			)
		}
		return(
			<div className={style.add}>
				{child}
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
