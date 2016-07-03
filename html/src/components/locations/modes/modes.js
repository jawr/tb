import React from 'react'
import { Map, Marker, TileLayer } from 'react-leaflet'
import LocationModeStore from './store.js'
import style from './style.scss'

export class PostcodeMode extends React.Component {
	constructor(props) {
		super(props);
	}

	handleSubmit = (event) => {
		event.preventDefault();
		const form = event.target;
		const name = form.querySelector('[name="name"]').value;
		const first = form.querySelector('[name="first"]').value;
		const postcode = form.querySelector('[name="postcode"]').value.replace(' ', '');
		// validation

		const location = {
			name: name,
			postcode: postcode,
			address: first
		};
		LocationModeStore.Next(location);
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<div className="row">
					<div className="six columns">
						<label htmlFor="name">Name</label>
						<input 
							className="u-full-width" 
							type="text" 
							placeholder="Awesome Gym!"
							name="name"
						/>
					</div>

					<div className="six columns">
						<label htmlFor="first">First Line</label>
						<input
							className="u-full-width" 
							type="text" 
							placeholder="235 Gym Street"
							name="first"
						/>
						<label htmlFor="postcode">Postcode</label>
						<input
							className="u-full-width" 
							type="text" 
							placeholder="N5 HXP"
							name="postcode"
						/>
					</div>
				</div>

				<input className="button-primary" type="submit" value="Next" />
			</form>
		) 
	}
}

export class MapMode extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: null
		};
	}

	handleMapClick = (event) => {
		this.setState({
			selected: event.latlng
		});
	}

	handleSubmit = (event) => {
		event.preventDefault();
		const form = event.target;
		const name = form.querySelector('[name="name"]').value;
		// validation

		const location = {
			name: name,
			point: this.state.selected
		};

		LocationModeStore.Next(location);
	}

	renderMap = () => {
		// get from users location
		let center = {lat: 51.5074, lng: 0.1278};
		let marker = null;
		if (this.state.selected) {
			marker = <Marker position={this.state.selected} />
		}
		return (
			<Map
				className={style.map}
				center={center}
				zoom={12}
				onClick={this.handleMapClick}
				>
				<TileLayer
					url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/>
				{marker}
			</Map>
		)
	}

	renderForm = () => {
		if (!this.state.selected) return null
		return (
			<form onSubmit={this.handleSubmit}>
				<div className="row">
					<div className="six columns">
						<label htmlFor="name">Name</label>
						<input 
							className="u-full-width" 
							type="text" 
							placeholder="Awesome Gym!"
							name="name"
						/>
					</div>
				</div>

				<input className="button-primary" type="submit" value="Next" />
			</form>
		)
	}

	render() {
		return (
			<div>
				<p>Find and click to select a Location.</p>
				{this.renderMap()}
				{this.renderForm()}
			</div>
		)
	}
}


