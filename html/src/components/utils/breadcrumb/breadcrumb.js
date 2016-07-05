import React from 'react'
import style from './style.scss'

export default class Breadcrumb extends React.Component {
	render() {
		const length = this.props.children.length;
		const crumbs = this.props.children.map(function(i, idx) {
			const className = (idx == length - 1) ? 
				style.current :
				style.crumb;
			return (
				<span key={idx} className={className}>{i}</span>
			)
		});
		return (
			<span className={style.bread}>
				{crumbs}
			</span>
		)
	}
}
