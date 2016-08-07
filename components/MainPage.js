import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersContainer from '../components/SuppliersContainer'
import SupplierDetails from '../components/SupplierDetails'
import NotificationContainer from '../components/NotificationContainer'
import cfgreader from '../config/readConfig'
import { Link, browserHistory } from 'react-router'


class MainPage extends React.Component {
  componentDidMount() {
    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this))
  }

  render() {

    return (
      <div className="app">
        <SuppliersContainer/>
        <SupplierDetails/>
        <NotificationContainer/>
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
)(MainPage)
