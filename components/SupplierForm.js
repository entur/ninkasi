import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersContainer from '../components/SuppliersContainer'
import SupplierDetails from '../components/SupplierDetails'
import NotificationContainer from '../components/NotificationContainer'
import cfgreader from '../config/readConfig'

class SupplierForm extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="supplier-form">
        <h2>Edit Provider</h2>
        <input></input>
      </div>

    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
      data: state.suppliersReducer.data
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
)(SupplierForm)
