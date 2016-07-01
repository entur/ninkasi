import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersActions from '../actions/SuppliersActions'


require('../sass/components/supplierdetails.scss')


class SupplierDetails extends React.Component {

  importData = () => {
    this.props.store.dispatch(SuppliersActions.importData(this.props.activeId))
  }

  exportData = () => {
    this.props.store.dispatch(SuppliersActions.exportData(this.props.activeId))
  }

  deleteData = () => {
    this.props.store.dispatch(SuppliersActions.deleteData(this.props.activeId))
  }

  render() {

    const { store, activeId, providers }  = this.props

    if (providers && providers.length > 0) {
        var provider = providers.filter(function(p) { return p.id == activeId })[0]
    }

    if (provider) {

      return (
        <div className="supplier-details">
          <h3 className="supplier-header">{provider.name}</h3>
            <button onClick={this.deleteData}>Delete</button>
            <button onClick={this.importData}>Import</button>
            <button onClick={this.exportData}>Export</button>
        </div>
      )

    } else {

       return (
         <div className="supplier-details">
           <h3>Select provider from the list. </h3>
         </div>
       )
    }

  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    providers: state.suppliersReducer.data,
    activeId: state.suppliersReducer.activeId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SupplierDetails)
