import React from 'react'
import ModalStore from './store.js'
import style from './style.scss'

export default class Modal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false
		};
		ModalStore.on('Show', this.handleModalChange);	
	}

	componentWillUnmount() {
		ModalStore.off('Show', this.handleModalChange);	
	}

	handleModalChange = (show) => {
		if (show) {
			this.setup();
		} else {
			this.teardown();
		}
		this.setState({show: show});
	}

	// construct jquery requirements
	setup() {
		$('body').addClass(style.body);
		$('.modal').on('click', function(e) {
			if ($(e.target).is('span') || $(e.target).is('a') || $(e.target).is('button')) {
				return
			}
			e.stopPropagation();
		});

		const self = this;
		$(document).keyup(function(e) {
			if (e.keyCode == 27) {
				self.closeModal();
			}
		});
	}

	// deconstruct jquery requirements
	teardown() {
		$('body').removeClass(style.body);
		$('.modal').off('click');
		$(document).off('keyup');
	}

	// close helpers

	closeModal(event) {
		var e = event.target;
		if (e.className == style.overlay) {
			ModalStore.Hide();
		}
	}

	// render
	render() {
		if (!this.state.show) return null;
		return (
			<div className={style.overlay} onClick={this.closeModal}>
				<div className={style.modal}>
					{ModalStore.Child()}
				</div>
			</div>
		)
	}
}

Modal.propTypes = {
	show: React.PropTypes.bool
};
