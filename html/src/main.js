import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'

import { Nav } from './components/nav/nav.js'
import { Categories } from './components/category/categories.js'

class App extends React.Component {
	render() {
		return (
			<div className="container">
				<Categories />
			</div>
		)
	}
}


const router = (
	<Router history={browserHistory}>
		<Route path="/tb/" component={App}>
		</Route>
	</Router>
)

// launch app
render(router, document.getElementById('app'));
