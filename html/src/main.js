import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router'

import Nav from './components/nav/nav.js'
import Categories from './components/category/categories.js'
import Activity from './components/activity/activity.js'
import Modal from './components/modal/modal.js'
import ModalStore from './components/modal/store.js'

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showModal: false
		};

		ModalStore.on('Show', this.handleModalChange);	
	}

	componentWillUnmount() {
		ModalStore.off('Show', this.handleModalChange);	
	}

	handleModalChange = (show) => {
		console.log('got show: ' + show);
		this.setState({showModal: show});
	}

	toggleModal() {
		console.log('click show');
		ModalStore.Show();
	}

	render() {
		return (
			<Nav>
				<Modal show={this.state.showModal}/>
				<div className="container">
					<a onClick={this.toggleModal}>show modal</a>
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
