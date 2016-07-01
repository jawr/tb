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
		let headerClass = style.header;
		let form = null;
		if (this.state.show) {
			headerClass = style.headerActive;
			form = (
				<div>
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
		}
		return(
			<div className={style.add}>
				<h1 onClick={this.handleHeaderClick} className={headerClass}>{config.header}</h1>
				{form}
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
