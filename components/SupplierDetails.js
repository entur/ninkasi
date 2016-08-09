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

  handleImportData = () => {

    const {dispatch, outboundFiles} = this.props
    dispatch(SuppliersActions.importData(this.props.activeId, outboundFiles))
  }

  handleExportData = () => {
    const {dispatch} = this.props
    dispatch(SuppliersActions.exportData(this.props.activeId))
  }

  handleCleanDataspace = () => {
    const {dispatch} = this.props
    dispatch(SuppliersActions.cleanDataspace(this.props.activeId))
  }

  handleDeleteProvider = () => {
    const {dispatch} = this.props
    dispatch(SuppliersActions.deleteProvider(this.props.activeId))
  }

  handleValidateProvider = () => {
    const {dispatch} = this.props
    dispatch(SuppliersActions.validateProvider(this.props.activeId))
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

    const {dispatch} = this.props

    const files = Array.map(document.querySelector('#outboundFilelist').options, x => x.text)

    dispatch(SuppliersActions.updateOutboundFilelist(files))
  }

  moveUp = () => {

    let outboundFilelist = document.querySelector('#outboundFilelist')
    let options = outboundFilelist && outboundFilelist.options
    let selected = []

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

    const {dispatch} = this.props

    const files = Array.map(document.querySelector('#outboundFilelist').options, x => x.text)

    dispatch(SuppliersActions.updateOutboundFilelist(files))

  }

  appendSelectedFiles = () => {

    let providerFilelist = document.querySelector('#providerFilelist')

    var selectedFiles = []
    for (let i = 0; i < providerFilelist.length; i++) {
      if (providerFilelist.options[i].selected)
      selectedFiles.push(providerFilelist[i].text)
    }

    const {dispatch} = this.props

    dispatch(SuppliersActions.appendFilesToOutbound(selectedFiles))

  }

  removeSelectedFiles = () => {

    const {dispatch} = this.props

    let outboundFilelist = document.querySelector('#outboundFilelist')

    let selectedFiles = []
    for (let i = 0; i < outboundFilelist.length; i++) {
      if (outboundFilelist.options[i].selected) selectedFiles.push(outboundFilelist[i].text)
    }

    dispatch(SuppliersActions.removeFilesToOutbound(selectedFiles))

  }

  render() {

    const { store, activeId, providers, files, filelistIsLoading, outboundFiles}  = this.props

    if (providers && providers.length > 0) {
      var provider = providers.filter(function(p) { return p.id == activeId })[0]
    }

    if (filelistIsLoading) {

      return (
        <div className="supplier-details disabled">
          <div className="supplier-header">
            <h3>Fetching files ...</h3>
          </div>
        </div>
      )
    }

    if (provider && files) {

      return (
        <div className="supplier-details">
          <div className="supplier-header"><h3>{provider.name}</h3></div>
          <div className="action-panel">
            <button onClick={this.handleCleanDataspace}>Clean dataspace</button>
            <button onClick={this.handleImportData}>Import+validate+export</button>
            <button onClick={this.handleValidateProvider}>validate+export</button>
            <button onClick={this.handleExportData}>Export</button>
            <button onClick={() => browserHistory.push(`/admin/ninkasi/provider/${activeId}/edit/`)}>Edit provider</button>
            <button onClick={this.handleDeleteProvider}>Delete provider</button>
          </div>
          <div>
            <ProviderFilelist files={files}></ProviderFilelist>
            <button onClick={this.appendSelectedFiles} className="move-button">=></button>
            <button onClick={this.removeSelectedFiles} className="move-button"><pre>&lt;=</pre></button>
            <OutboundFilelist files={outboundFiles}></OutboundFilelist>
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
    providers: state.SuppliersReducer.data,
    activeId: state.SuppliersReducer.activeId,
    files: state.MardukReducer.filenames.fetch_filesnames ? state.MardukReducer.filenames.fetch_filesnames['files'] : [],
    filelistIsLoading: state.MardukReducer.filenames.isLoading,
    outboundFiles: state.UtilsReducer.outboundFilelist
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
