import React from 'react';
import Keyword from './keyword.js'

export default class Keywords extends React.Component {
	render() {
		const keywords = this.props.activity.keywords.map(function(i, idx) {
			return <Keyword keyword={i} key={idx} />
		});
		return <ul>{keywords}</ul>
	}
}

Keywords.propTypes = {
	activity: React.PropTypes.object.isRequired
}
