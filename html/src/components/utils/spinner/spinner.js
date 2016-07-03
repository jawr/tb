import React from 'react'
import style from './style.scss'

export default class Spinner extends React.Component {
	render() {
		return (
			<div className={style.overlay}>
				<div className={style.spinner} />
				<p>{this.props.children}</p>
			</div>
		)
	}
}
