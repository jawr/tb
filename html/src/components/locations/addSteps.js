import React from 'react'
import { Map, Marker, TileLayer } from 'react-leaflet'
import { PostcodeMode, MapMode } from './modes/modes.js'
import LocationModeStore from './modes/store.js'
import LocationStore from './store.js'
import ModalStore from '../modal/store.js'
import Spinner from '../utils/spinner/spinner.js'
import style from './style.scss'

const MODES = ['map', 'postcode'];

export class StepOne extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: 'map'
		};
	}

	changeMode = (newMode) => {
		this.setState({mode: newMode});
	}

	renderModeTabs = () => {
		const self = this;
		let tabs = MODES.map(function(mode, idx) {
			let className = style.active;
			let clickHandler = () => { return false };
			if (self.state.mode != mode) {
				className = style.mode;
				clickHandler = self.changeMode.bind(this, mode);
			}
			return <span key={idx} onClick={clickHandler} className={className}>{mode}</span>
		});
		return (
			<div className={style.modes}>{tabs}</div>
		)
	}

	renderMode = () => {
		let mode = null;
		switch (this.state.mode) {
			case 'postcode':
				mode = <PostcodeMode />
				break;
			case 'map':
				mode = <MapMode />
				break;
		}
		return mode;
	}

	render() {
		const activity = this.props.activity;
		return (
			<div className={style.addLocation}>
				<h1>New Location</h1>
				<p>Create a new Location for <code>{activity.name} {activity.category.name}</code> using one of the following modes.</p>
				{this.renderModeTabs()}
				{this.renderMode()}
			</div>
		)
	}
}

export class StepTwo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			point: null
		};
		LocationStore.on('Find', this.handleFind);
		LocationStore.Find(this.props.location);
	}
	
	componentWillUnmount() {
		LocationStore.off('Find', this.handleFind);
	}

	handleFind = (point) => {
		this.setState({point: point});
	}

	handleStartAgain = () => {
		LocationModeStore.Next(null);
	}

	handleNext = () => {
		let location = this.props.location;
		location.point = this.state.point;
		LocationModeStore.Next(location);
	}
	
	render() {
		if (!this.state.point) return <Spinner />

		// get from users location
		const center = this.state.point;
		const marker = <Marker position={this.state.point} />

		return (
			<div className={style.step}>
				<Map
					className={style.map}
					center={center}
					zoom={12}
					>
					<TileLayer
						url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
						attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					/>
					{marker}
				</Map>
				<div className="row">
					<button className="button" onClick={this.handleStartAgain}>Try Again</button>
					<button className="button-primary" onClick={this.handleNext}>Next</button>
				</div>
			</div>
		)
	}
}

export class StepThree extends React.Component {
	handleSubmit = (event) => {
		event.preventDefault();
		const form = event.target;
		const phone = form.querySelector('[name="phone"]').value;
		let location = this.props.location;
		location.meta = {
			phone: phone,
			address: location.address,
			postcode: location.postcode
		};
		LocationModeStore.Next(location);
	}

	handleSkip = () => {
		let location = this.props.location;
		location.meta = {};
		LocationModeStore.Next(location);
	}

	render() {
		return (
			<div className={style.step}>
				<h1>Add Additional Info</h1>
				<form onSubmit={this.handleSubmit}>
					<div className="row">
						<div className="six columns">
							<label htmlFor="phone">Phone Number</label>
							<input
								className="u-full-width"
								type="text"
								name="phone"
								placeholder="020 7123 4567"
							/>
						</div>
					</div>
					<input className="button-primary" type="submit" value="Save" />
					<button onClick={this.handleSkip} className="button">Skip & Save</button>
				</form>
			</div>
		)
	}
}

export class StepFour extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: Math.random().toString(36).substr(2, 9)
		};

		LocationStore.on('Insert.'+this.state.id, this.handleInsert);
		LocationStore.Insert(this.state.id, this.props.location, this.props.activity);
	}

	handleInsert = () => {
		ModalStore.Hide();
	}

	componentWillUnmount() {
		LocationStore.off('Insert.'+this.state.id, this.handleInsert);
	}

	render() {
		return 	<Spinner>Saving Location...</Spinner>
	}
}
