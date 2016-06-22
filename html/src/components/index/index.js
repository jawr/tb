var React = require('react');
var Maps = require('react-google-maps');
var GoogleMaps = Maps.GoogleMaps;
var Marker = Maps.Marker;
var Store = require('./store.js');

module.exports = React.createClass({
	componentWillMount: function() {
		Store.on('getLocations.done', this.onChange);
		Store.GetLocations();
	},
	componentDidUnmount: function() {
		Store.off('getLocations.done', this.onChange);
	},
	onChange: function() {
		this.setState({});
	},
	render: function() {
		var list = Store.Locations();
		if (list.length == 0) {
			return (
				<div></div>	
			);
		}
		var markers = [];
		var locations = [];
		list.map(function(i, idx) {
			markers.push(
				<Marker
					position={i.point}
					key={idx}
				/>
			);
			locations.push(
				<tr>
					<td>{i.name}</td>	
				</tr>
			);
		});
		var center = list[0].point;
		var selected = null;
		return (
			<div>
				<h3>Locations</h3>
				<p>View and manage your locations.</p>
				<div id="map">
					<GoogleMaps
						key={markers.length}
						containerProps={{
							style: {
								height: '100%',
								width: $(document).width(),
								position: 'relative',
								left: "-10rem",
								right: 0
							},
						}}
						googleMapsApi={google.maps}
						zoom={8}
						center={center}
						>
						{markers}
					</GoogleMaps>
				</div>
				<table className="u-full-width">
					<thead>
						<tr>
							<th>Name</th>
						</tr>
					</thead>
					<tbody>
						{locations}
					</tbody>
				</table>
			</div>
		)
	}
});
