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
					<h1><i className="fa fa-heartbeat" aria-hidden={true}></i> <small>Training Buddy</small></h1>

					<span className={style.options}>
						<div className={style.menu}>
							<span />
							<span />
							<span />
						</div>
					</span>

					<ul>
						<li><Link to="/">Categories</Link></li>
						<li><Link to="/">Pending</Link></li>
					</ul>
				</div>

				{this.props.children}
			</div>
		)
	}
}
