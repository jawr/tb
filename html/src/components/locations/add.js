import React from 'react'
import LocationStore from './store.js'
import Add from '../add/add.js'
import ModalStore from '../modal/store.js'
import LocationModeStore from './modes/store.js'
import { StepOne, StepTwo, StepThree, StepFour } from './addSteps.js'
import style from './style.scss'

export default class AddLocation extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			id: Math.random().toString(36).substr(2, 9)
		};

		// store handlers
		// LocationStore.on('Insert.'+this.state.id, this.handleInsert);

	}

	handleAddClick = () => {
		const child = <AddLocationModal id={this.state.id} activity={this.props.activity} />
		ModalStore.Show(child);
	}

	render() {
		return (
			<button className={style.add} onClick={this.handleAddClick}>Add Location</button>
		)

	}
}

AddLocation.propTypes = {
	activity: React.PropTypes.object.isRequired	
};


class AddLocationModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			location: null
		};

		LocationModeStore.on('Next', this.handleNext);
	}

	componentWillUnmount() {
		LocationModeStore.off('Next', this.handleNext);
	}

	handleNext = (location) => {
		this.setState({location: location});
	}

	render() {

		if (this.state.location && this.state.location.meta) {
			return <StepFour location={this.state.location} />
		} else if (this.state.location && this.state.location.point) {
			return <StepThree location={this.state.location} />
		} else if (this.state.location) {
			return <StepTwo location={this.state.location} />
		} else {
			return <StepOne activity={this.props.activity} />
		}
	}
}

AddLocationModal.propTypes = {
	activity: React.PropTypes.object.isRequired	
};


