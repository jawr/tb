import React from 'react'

export class Keyword extends React.Component {
	render() {
		return (
			<span>{this.props.keyword.name}</span>
		)
	}
}
