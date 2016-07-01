import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersContainer from '../components/SuppliersContainer'
import SupplierDetails from '../components/SupplierDetails'
import NotificationContainer from '../components/NotificationContainer'

class AppContainer extends React.Component {

  render() {

    const { store }  = this.props

    return (
      <div className="app">
        <SuppliersContainer store={store}/>
        <SupplierDetails store={store}/>
        <NotificationContainer store={store}/>
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
  }
}


AppContainer.propTypes = {
  store: PropTypes.object.isRequired,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer)
