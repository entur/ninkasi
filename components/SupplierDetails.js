import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersActions from '../actions/SuppliersActions'
import Multiselect from './Multiselect'
import cfgreader from '../config/readConfig'

require('../sass/components/supplierdetails.scss')
require('../sass/components/lists.scss')


class SupplierDetails extends React.Component {
  componentDidMount() {
    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this))
  }

  importData = () => {

  // TODO : This could should be updated with a more reacteque way of doing it
   var multiselect = document.querySelector('#provider-files')
   var selectedFiles = []
   for (var i = 0; i < multiselect.length; i++) {
       if (multiselect.options[i].selected) selectedFiles.push(multiselect.options[i].value);
   }
    this.props.store.dispatch(SuppliersActions.importData(this.props.activeId, selectedFiles))
  }

  exportData = () => {
    this.props.store.dispatch(SuppliersActions.exportData(this.props.activeId))
  }

  cleanDataspace = () => {
    this.props.store.dispatch(SuppliersActions.cleanDataspace(this.props.activeId))
  }

  deleteProvider = () => {
    console.log("Delete provider")
  }

  editProvider = () => {
    console.log("Edit provider")
  }

  render() {

    const { store, activeId, providers }  = this.props

    if (providers && providers.length > 0) {
        var provider = providers.filter(function(p) { return p.id == activeId })[0]
    }

    if (provider) {

      return (
        <div className="supplier-details">
          <div className="supplier-header"><h3>{provider.name}</h3></div>
            <div className="action-panel">
              <button onClick={this.cleanDataspace}>Clean dataspace</button>
              <button onClick={this.importData}>Import</button>
              <button onClick={this.exportData}>Export</button>
              <button onClick={this.editProvider}>Edit provider</button>
              <button onClick={this.deleteProvider}>Delete provider</button>
            </div>
            <Multiselect></Multiselect>
        </div>
      )

    } else {

       return (
         <div className="supplier-details">
           <div className="supplier-header"><h3>Select provider from the list. </h3></div>
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
