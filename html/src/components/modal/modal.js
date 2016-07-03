import React from 'react'
import ModalStore from './store.js'
import style from './style.scss'

export default class Modal extends React.Component {
	constructor(props) {
		super(props);

		// some jquery is needed
		//
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

	componentWillUnmount() {
		$('body').removeClass(style.body);
		$(document).off('click');
		$(document).off('keyup');
	}

	closeModal(event) {
		var e = event.target;
		console.log(e);
		if (e.className == style.overlay) {
			console.log('click hide');
			ModalStore.Hide();
		}
	}

	render() {
		if (!this.props.show) return null;
		return (
			<div className={style.overlay} onClick={this.closeModal}>
				<div className={style.modal}>
					<h1>MODAL</h1>
				</div>
			</div>
		)
	}
}

Modal.propTypes = {
	show: React.PropTypes.bool
};
