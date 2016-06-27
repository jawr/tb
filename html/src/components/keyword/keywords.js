import React from 'react';
import { Keyword } from './keyword.js'

export class Keywords extends React.Component {
	render() {
		const keywords = this.props.keywords.map(function(i, idx) {
			return <Keyword keyword={i} key={idx} />
		});
		return <ul>{keywords}</ul>
	}
}
