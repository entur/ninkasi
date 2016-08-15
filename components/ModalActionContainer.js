import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import Modal from './Modal.js'
import SuppliersActions from '../actions/SuppliersActions'

import Button from 'muicss/lib/react/button'

class ModalActionContainer extends React.Component {

  constructor(props) {
    super(props)
  }

  handleFilterChange = (event) => {
    const {dispatch} = this.props
    dispatch(SuppliersActions.logEventFilter(event.target.value))
  }

  render() {

    const {isModalOpen, filteredLoggedEvents} = this.props

    const closeStyle = {
      float: "right",
      marginRight: "5px"
    }

    const selectStyle = {
      height: "100%",
      minHeight: "500px",
      width: "95%",
      margin: "10px"
    }

    const inputStyle = {
      width: "95%",
      margin: "10px"
    }

    const headerSyle = {
      width: "95%",
      marginLeft: "10px",
      fontSize: "1.5em",
      position: "absolute",
      marginTop: "10px"
    }

    return (
        <Modal isOpen={isModalOpen} onClose={() => this.closeModal()}>
          <span style={headerSyle}>Logged events</span>
          <Button style={closeStyle} onClick={() => this.closeModal()}>X</Button>
          <input onChange={this.handleFilterChange.bind(this)} style={inputStyle} type="text" placeholder="Filter"/>
          <select style={selectStyle} multiple>
            { filteredLoggedEvents.map( event => {
              return <option key={event.id}>{event.title}</option>
            })}
          </select>
        </Modal>
    )
  }

  closeModal() {
    const {dispatch} = this.props
    dispatch(SuppliersActions.dismissModalDialog())
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
      isModalOpen: state.UtilsReducer.isModalOpen,
      filteredLoggedEvents: state.UtilsReducer.filteredLoggedEvents
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalActionContainer)
