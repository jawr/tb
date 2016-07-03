import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router'

import Nav from './components/nav/nav.js'
import Categories from './components/category/categories.js'
import Activity from './components/activity/activity.js'
import Modal from './components/modal/modal.js'

class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Nav>
				<Modal />
				<div className="container">
					{this.props.children}
				</div>
			</Nav>
		)
	}
}


const router = (
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Categories} />
			<Route path="categories" component={Categories} />
			<Route path="activity/:name/:id" component={Activity} />
		</Route>
	</Router>
)

// launch app
render(router, document.getElementById('app'));
