import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'

require('../sass/components/supplierdetails.scss')

class SupplierDetails extends React.Component {

  render() {

    const { store, activeId, providers }  = this.props

    if (providers && providers.length > 0) {
        var provider = providers.filter(function(p) { return p.id == activeId })[0]
    }

    if (provider) {

      return (
        <div className="supplier-details">
          <h3 className="supplier-header">{provider.name}</h3>
          <button>Import</button>
          <button>Export</button>
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
