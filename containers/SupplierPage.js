import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersContainer from './SuppliersContainer'
import NotificationContainer from './NotificationContainer'
import cfgreader from '../config/readConfig'
import EditSupplierPage from  './EditSupplierPage'
import Button from 'muicss/lib/react/button'
import Modal from './Modal'

import SuppliersActions from '../actions/SuppliersActions'

class SupplierPage extends React.Component {

  componentWillMount() {

    const {id, dispatch} = this.props

    cfgreader.readConfig( (function(config) {
      window.config = config

      if (id) {
        dispatch(SuppliersActions.fetchProvider(id))
      }

    }).bind(this))

  }

  handleOnSubmit(event) {

    event.preventDefault()

    const {dispatch, id, shouldUpdate} = this.props

    if (shouldUpdate) {
      dispatch(SuppliersActions.updateProvider(id))
    } else {
      dispatch(SuppliersActions.createProvider())
    }

  }

  render() {

    const {provider, dispatch, isModalOpen, shouldUpdate, providers} = this.props

    const closeStyle = {
      float: "right",
      marginRight: "5px"
    }

    return (
      <Modal isOpen={isModalOpen} onClose={() => this.closeModal()} minWidth="70%">
        <Button style={closeStyle} onClick={() => this.closeModal()}>X</Button>
        <div className="supplierPage">
          <EditSupplierPage
            dispatch={dispatch}
            shouldUpdate={shouldUpdate}
            provider={provider}
            providers={providers}
            handleOnSubmit={this.handleOnSubmit.bind(this)}
          />
          <NotificationContainer/>
        </div>
      </Modal>
    )
  }

  closeModal() {
    const {dispatch} = this.props
    dispatch(SuppliersActions.dismissEditProviderDialog())
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    provider: state.UtilsReducer.supplierForm,
    id: state.SuppliersReducer.activeId,
    isModalOpen: state.UtilsReducer.editProviderModal,
    shouldUpdate: state.UtilsReducer.shouldUpdateProvider,
    providers: state.SuppliersReducer.data
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
)(SupplierPage)
