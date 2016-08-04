import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersActions from '../actions/SuppliersActions'
import ProviderFilelist from './ProviderFilelist'
import OutboundFilelist from './OutboundFilelist'
import cfgreader from '../config/readConfig'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

require('../sass/components/supplierdetails.scss')
require('../sass/components/lists.scss')


class SupplierDetails extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this))
  }

  importData = () => {

    const {dispatch} = this.props

    // TODO : This could should be updated with a more reacteque way of doing it
    var multiselect = document.querySelector('#outboundFilelist')
    var selectedFiles = []
    for (var i = 0; i < multiselect.length; i++) {
      if (multiselect.options[i].selected) selectedFiles.push(multiselect.options[i].value);
    }

    dispatch(SuppliersActions.importData(this.props.activeId, selectedFiles))
  }

  exportData = () => {
    const {dispatch} = this.props
    dispatch(SuppliersActions.exportData(this.props.activeId))
  }

  cleanDataspace = () => {
    const {dispatch} = this.props
    dispatch(SuppliersActions.cleanDataspace(this.props.activeId))
  }

  deleteProvider = () => {
    const {dispatch} = this.props
    console.log("Delete provider")
  }

  moveUp = () => {

    let outboundFilelist = document.querySelector('#outboundFilelist')
    let options = outboundFilelist && outboundFilelist.options
    let selected = []

    console.log("options", options)

    for (var i = 0, iLen = options.length; i < iLen; i++) {
        if (options[i].selected) {
            selected.push(options[i])
        }
    }

    for (i = 0, iLen = selected.length; i < iLen; i++) {
        var index = selected[i].index

        if(index == 0){
            break
        }

        var temp = selected[i].text
        selected[i].text = options[index - 1].text
        options[index - 1].text = temp

        temp = selected[i].value
        selected[i].value = options[index - 1].value
        options[index - 1].value = temp

        selected[i].selected = false
        options[index - 1].selected = true
      }
  }

  moveDown = () => {

    let outboundFilelist = document.querySelector('#outboundFilelist')
    var options = outboundFilelist && outboundFilelist.options
    var selected = []

    for (var i = 0, iLen = options.length; i < iLen; i++) {
        if (options[i].selected) {
            selected.push(options[i])
        }
    }

    for (i = selected.length - 1, iLen = 0; i >= iLen; i--) {
        var index = selected[i].index

        if(index == (options.length - 1)){
            break
        }

        var temp = selected[i].text
        selected[i].text = options[index + 1].text
        options[index + 1].text = temp

        temp = selected[i].value;
        selected[i].value = options[index + 1].value
        options[index + 1].value = temp

        selected[i].selected = false
        options[index + 1].selected = true
    }
  }

  moveSelectedFiles = () => {
    let providerFilelist = document.querySelector('#providerFilelist')
    let outboundFilelist = document.querySelector('#outboundFilelist')

    var selectedFiles = []
    for (let i = 0; i < providerFilelist.length; i++) {
      if (providerFilelist.options[i].selected)
        selectedFiles.push(providerFilelist[i])
    }

    let i = selectedFiles.length

    while (i--)
      outboundFilelist.appendChild(selectedFiles[i])
  }

  removeSelectedFiles = () => {
    let outboundFilelist = document.querySelector('#outboundFilelist')

    let selectedFiles = []
    for (let i = 0; i < outboundFilelist.length; i++) {
      if (outboundFilelist.options[i].selected) selectedFiles.push(outboundFilelist[i])
    }

    let i = selectedFiles.length

    while(i--) {
      if (outboundFilelist[i]) outboundFilelist.remove(i)
    }

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
            <button onClick={() => browserHistory.push(`/ninkasi/provider/${activeId}/edit/`)}>Edit provider</button>
            <button onClick={this.deleteProvider}>Delete provider</button>
          </div>
          <div>
            <ProviderFilelist></ProviderFilelist>
            <button onClick={this.moveSelectedFiles} className="move-button">=></button>
            <button onClick={this.removeSelectedFiles} className="move-button"><pre>&lt;=</pre></button>
            <OutboundFilelist></OutboundFilelist>
            <button onClick={this.moveDown} className="move-button"><pre>&#x25BC;</pre></button>
            <button onClick={this.moveUp} className="move-button"><pre>&#x25B2;</pre></button>
          </div>
        </div>
      )

    } else {

      return (
        <div className="supplier-details disabled">
          <div className="supplier-header">
            <p>Select provider from the list</p>
          </div>
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
    dispatch: dispatch,
    props: ownProps
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SupplierDetails)
