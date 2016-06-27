import React from 'react'
import { Table } from 'reactable'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

export class Locations extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			current: this.props.locations[0]
		};

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(location) {
		this.setState({location: location});
	}

	renderLocation() {
		const markers = this.props.locations.map(function(i, idx) {
			return <Marker position={i.point} key={idx} />
		});
		const center = this.props.locations[0].point;
		const containerElement = (
			<div style={{height: '100%'}} />
		);
		return (
			<Map
				className="location"
				key={markers.length}
				center={center}
				zoom={8}
				>
				<TileLayer
					url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/>
				{markers}
			</Map>
		)
	}

	render() {
		const locations = this.props.locations.map(function(i, idx) {

			return <li key={idx}>{i.name}</li>
		});
		return (
			<div>
						{this.renderLocation()}
				<div className="row">
					<div className="four columns">
						<ul>
							{locations}
						</ul>
					</div>
					<div className="eight columns">
					</div>
				</div>
			</div>
		)
	}
}
