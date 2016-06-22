(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Transition = Router.Transition;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Index = require('./components/index/index.js');
var Menu = require('./components/menu/menu.js');

// setup basic auth, very temp
function getHash(username, password) {
	var hash = username + ":" + password
	hash = btoa(unescape(encodeURIComponent(hash)));
	return hash;
}

$.ajaxSetup({
	headers: {
		'Authorization': 'Basic ' + getHash()
	}	
});


var App = React.createClass({displayName: "App",
	render: function() {
		return (
			React.createElement("div", null, 
				React.createElement(Menu, null), 
				React.createElement("div", {className: "container", ref: "container", id: "main"}, 
					React.createElement("div", {className: "row"}, 
						React.createElement("div", {className: "twelve columns"}, 
							React.createElement(RouteHandler, React.__spread({},  this.props))
						)
					)
				)
			)
		)
	}
});

var routes = (
	React.createElement(Route, {name: "app", path: "/", handler: App}, 
		React.createElement(Route, {name: "index", handler: Index}), 
		React.createElement(DefaultRoute, {handler: Index})
	)
);

Router.run(routes, function(Handler, state) {
	var params = state.params;
	React.render(React.createElement(Handler, {params: params}), document.body);
});

},{"./components/index/index.js":2,"./components/menu/menu.js":4,"react":undefined,"react-router":undefined}],2:[function(require,module,exports){
var React = require('react');
var Maps = require('react-google-maps');
var GoogleMaps = Maps.GoogleMaps;
var Marker = Maps.Marker;
var Store = require('./store.js');

module.exports = React.createClass({displayName: "exports",
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
				React.createElement("div", null)	
			);
		}
		var markers = [];
		var locations = [];
		list.map(function(i, idx) {
			markers.push(
				React.createElement(Marker, {
					position: i.point, 
					key: idx}
				)
			);
			locations.push(
				React.createElement("tr", null, 
					React.createElement("td", null, i.name)	
				)
			);
		});
		var center = list[0].point;
		var selected = null;
		return (
			React.createElement("div", null, 
				React.createElement("h3", null, "Locations"), 
				React.createElement("p", null, "View and manage your locations."), 
				React.createElement("div", {id: "map"}, 
					React.createElement(GoogleMaps, {
						key: markers.length, 
						containerProps: {
							style: {
								height: '100%',
								width: $(document).width(),
								position: 'relative',
								left: "-10rem",
								right: 0
							},
						}, 
						googleMapsApi: google.maps, 
						zoom: 8, 
						center: center
						}, 
						markers
					)
				), 
				React.createElement("table", {className: "u-full-width"}, 
					React.createElement("thead", null, 
						React.createElement("tr", null, 
							React.createElement("th", null, "Name")
						)
					), 
					React.createElement("tbody", null, 
						locations
					)
				)
			)
		)
	}
});

},{"./store.js":3,"react":undefined,"react-google-maps":undefined}],3:[function(require,module,exports){
var Flux = require('flux-react');

var Actions = Flux.createActions([
	'getLocations'
]);

module.exports = Flux.createStore({
	locations: [],
	actions: [
		Actions.getLocations
	],
	getLocations: function() {
		var self = this;
		$.get('/tb/api/v1/locations/')
		.done(function(data) {
			self.locations = $.parseJSON(data);
			self.emit('getLocations.done');
		})
		.fail(function(data) {
			console.log('getLocations fail');
		});
	},
	exports: {
		GetLocations: function() {
			Actions.getLocations();
		},
		Locations: function() {
			return this.locations;
		}
	}
});

},{"flux-react":undefined}],4:[function(require,module,exports){
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

module.exports = React.createClass({displayName: "exports",
	getInitialState: function() {
		return {
			hidden: true
		};
	},
	toggleMenu: function() {
		this.setState({hidden: !this.state.hidden});
	},
	render: function() {
		var menu = (
				React.createElement("div", {className: "intro"}, 
						React.createElement("h4", {onClick: this.toggleMenu}, "TB")
				)
		)
		var className = "two columns slide-left minimised";
		if (!this.state.hidden) {
			className = "two columns slide-left show";
			menu = (
					React.createElement("div", {className: "intro"}, 
						React.createElement("h4", {onClick: this.toggleMenu}, "TB"), 
						React.createElement("ul", null, 
							React.createElement("li", {className: "section"}, "My"), 
							React.createElement("li", null, React.createElement(Link, {to: "index"}, "Dashboard"))
						)
					)
			)
		}
		return (
				React.createElement("div", {className: className, id: "nav", ref: "menu"}, 
					menu
				)

		)
	}
});

},{"react":undefined,"react-router":undefined}]},{},[1]);
