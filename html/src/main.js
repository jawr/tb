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


var App = React.createClass({
	render: function() {
		return (
			<div>
				<Menu />
				<div className="container" ref="container" id="main">
					<div className="row">
						<div className="twelve columns">
							<RouteHandler {...this.props} />
						</div>
					</div>
				</div>
			</div>
		)
	}
});

var routes = (
	<Route name="app" path="/" handler={App}>
		<Route name="index" handler={Index} />
		<DefaultRoute handler={Index} />
	</Route>
);

Router.run(routes, function(Handler, state) {
	var params = state.params;
	React.render(<Handler params={params} />, document.body);
});
