import React from 'react'
import ReactDOM from 'react-dom'
import style from './style.scss'

export default class Dropdown extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}

	handleOpen = () => {
		// click to close
		document.addEventListener('click', this.handleClick, false);
		this.setState({open: true});
	}

	handleClose = () => {
		document.removeEventListener('click', this.handleClick, false);
		this.setState({open: false});
	}

	handleClick = (event) => {
		const node = ReactDOM.findDOMNode(this);
		if (node.contains(event.target)) {
			return;
		}
		this.handleClose();
	}
	
	renderChildren = () => {
		if (!this.state.open) return null
		const children = this.props.children.map(function(i, idx) {
			if (idx == 0) return false;
			return (
				<div className={style.child} key={idx}>{i}</div>
			)
		});
		return <div className={style.dropdown}>{children}</div>
	}

	render() {	
		const main = React.cloneElement(this.props.children[0], {
			onClick: this.handleOpen
		});
		return (
			<span {...this.props}>
				{main}
				{this.renderChildren()}
			</span>
		)
	}
}
