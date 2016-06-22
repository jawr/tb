var React = require('react');

module.exports = React.createClass({
	componentDidMount: function() {
		this.render = function() { return false };
	},
	render: function() {
		return this.props.children;
	}
});
		
