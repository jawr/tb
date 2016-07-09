import React from 'react';
import style from './style.scss';
import { Link } from 'react-router'
import Dropdown from '../utils/dropdown/dropdown.js'

export default class Nav extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={style.wrapper}>
				<div className={style.bar}>
					<h1><i className="fa fa-heartbeat" aria-hidden={true}></i> <small>Training Buddy</small></h1>

					<Dropdown className={style.options}>
						<div className={style.menu}>
							<span />
							<span />
							<span />
						</div>

						<span onClick={() => { console.log('derp')}}>Something</span>
						<span>Something else</span>
						<span>Something</span>
						<span>Something else</span>
					</Dropdown>

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
