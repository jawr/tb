import React from 'react';
import style from './style.scss';
import { Link } from 'react-router'

export default class Nav extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={style.wrapper}>
				<div className={style.bar}>
					<h1><Link to="/tb/">TB</Link></h1>

					<ul>
						<li><Link to="/">Home</Link></li>
						<li><Link to="/about">About</Link></li>
					</ul>
				</div>

				{this.props.children}
			</div>
		)
	}
}
