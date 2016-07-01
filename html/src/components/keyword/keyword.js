import React from 'react'
import styles from './keyword.scss'

export default class Keyword extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mouseover: false,
			ro: this.props.ro || false
		};
	}

	handleMouseover = () => {
		if (this.state.ro) { return }
		this.setState({mouseover: true});
	}

	handleMouseout = (event) => {
		if (this.state.ro) { return }
		// might not be cross compat - http://stackoverflow.com/questions/4697758/prevent-onmouseout-when-hovering-child-element-of-the-parent-absolute-div-withou
		var e = event.toElement || event.relatedTarget;
		if (e.parentNode.className == styles.keyword 
		|| e.className == styles.keyword) {
			return;
		}
		this.setState({mouseover: false});
	}

	handleDeleteClick = () => {

	}

	renderDelete = () => {
		if (this.state.mouseover) {
			return (
				<span 
					onClick={this.handleDeleteClick}
					className={styles.delete}
				>x</span>
			)
		}
		return null
	}

	render() {
		return (
			<span 
				className={styles.keyword}
				onMouseOver={this.handleMouseover}
				onMouseOut={this.handleMouseout}
			>
				{this.props.keyword.name}
				{this.renderDelete()}
			</span>
		)
	}
}

Keyword.propTypes = {
	keyword: React.PropTypes.object.isRequired,
	ro: React.PropTypes.bool
}
