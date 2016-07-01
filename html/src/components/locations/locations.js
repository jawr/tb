import React from 'react'
import { Table } from 'reactable'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import styles from './locations.scss'
import AddLocation from './add.js'

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
		return (
			<Map
				className={styles.location}
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
		const self = this;
		const locations = this.props.locations.map(function(i, idx) {
			let className = null;
			if (self.state.mouseOver && self.state.mouseOver.id == i.id) 
				className = styles.activeLocation;
			return (
				<tr key={idx}>
					<td className={className}>{i.name}</td>
				</tr>
			)
		});
		return (
			<div>
				<div className="row">
					<div className="four columns">
						<table className="u-full-width">
							<thead>
								<tr>
									<th>Location</th>
								</tr>
							</thead>
							<tbody>
								{locations}
							</tbody>
						</table>
					</div>
					<div className="eight columns">
						{this.renderLocation()}
					</div>
				</div>
				<div className="row">
					<AddLocation activity={this.props.activity} />
				</div>
			</div>
		)
	}
}

Locations.propTypes = {
	locations: React.PropTypes.array.isRequired
}
