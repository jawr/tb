import React from 'react'
import { Table } from 'reactable'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import AddLocation from './add.js'
import style from './style.scss'

export default class Locations extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			current: this.props.locations[0],
			mouseOver: null
		};
	}

	handleClick = (location) => {
		this.setState({location: location});
	}

	handleMarkerMouseover = (location) => {
		this.setState({mouseOver: location});
	}

	handleMarkerMouseout = () => {
		this.setState({mouseOver: null});
	}


	renderLocation() {
		if (this.props.locations.length == 0) return null
		const self = this;
		const markers = this.props.locations.map(function(i, idx) {
			return (
				<Marker 
					position={i.point} 
					key={idx} 
					onMouseover={self.handleMarkerMouseover.bind(self, i)}
					onMouseout={self.handleMarkerMouseout}
				>
					<Popup>
						<span>{i.address}</span>
					</Popup>
				</Marker>
			)
		});
		const center = this.props.locations[0].point;
		const map = (
			<Map
				className={style.location}
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
		const locations = this.props.locations.map(function(i, idx) {
			let className = null;
			if (self.state.mouseOver && self.state.mouseOver.id == i.id) 
				className = style.active;
			let address = null;
			if (i.meta.address.length > 0)
				address = i.meta.address + ', ' + i.meta.postcode;
			return (
				<tr key={idx} className={className}>
					<td>{i.name}</td>
					<td>{address}</td>
				</tr>
			)
		});
		return (
			<div>
				<div className="row">
					{map}
				</div>
				<div className="row">
					<table className="u-full-width">
						<thead>
							<tr>
								<th>Name</th>
								<th>Address</th>
							</tr>
						</thead>
						<tbody>
							{locations}
						</tbody>
					</table>
				</div>
			</div>
		)
	}

	render() {
		return (
			<div className={style.locations}>
					{this.renderLocation()}
				<div className="row">
					<br />
					<AddLocation activity={this.props.activity} />
				</div>
			</div>
		)
	}
}

Locations.propTypes = {
	locations: React.PropTypes.array.isRequired
}
