var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

module.exports = React.createClass({
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
				<div className="intro">
						<h4 onClick={this.toggleMenu}>TB</h4>
				</div>
		)
		var className = "two columns slide-left minimised";
		if (!this.state.hidden) {
			className = "two columns slide-left show";
			menu = (
					<div className="intro">
						<h4 onClick={this.toggleMenu}>TB</h4>
						<ul>
							<li className="section">My</li>
							<li><Link to="index">Dashboard</Link></li>
						</ul>
					</div>
			)
		}
		return (
				<div className={className} id="nav" ref="menu">
					{menu}
				</div>

		)
	}
});

