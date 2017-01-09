import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import Button from 'muicss/lib/react/button'
import FileList from '../components/FileList'
import SuppliersActions from '../actions/SuppliersActions'

const FaArrowDown = require('react-icons/lib/fa/arrow-down')
const FaArrowUp = require('react-icons/lib/fa/arrow-up')
const FaRemove = require('react-icons/lib/fa/arrow-left')
const FaAdd = require('react-icons/lib/fa/arrow-right')

class DataMigrationDetails extends React.Component {

  render() {

    const { files, outboundFiles, chouetteInfo } = this.props

    const shouldRenderTransfer = !!chouetteInfo.migrateDataToProvider

    const toolTips = {
      import: 'Import all files listed in the list below',
      validate: 'Validate files in space',
      transfer: 'Transfer files to provider with id ' + chouetteInfo.migrateDataToProvider,
      export: 'Export files',
      clean: 'Clean data space'
    }

    return (

      <div>
        <div style={{display: 'flex', justfiyContent: 'flex-start'}}>
          <Button title={toolTips.import} color="primary" onClick={this.handleImportData}>Import</Button>
          <Button title={toolTips.validate} color="primary" onClick={this.handleValidateProvider}>Validate</Button>
          { shouldRenderTransfer
            ? <Button title={toolTips.transfer} color="primary" onClick={this.handleTransferData}>Transfer</Button>
            : <Button title={toolTips.export} color="primary" onClick={this.handleExportData}>Export</Button>
          }
          <Button title={toolTips.clean} color="danger" onClick={this.handleCleanDataspace}>Clean</Button>
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <FileList key="providerFilelist" wrapperId="providerFilelist" files={files}/>
          { files.length
            ?
            <div style={{display: 'flex', alignItem: 'center', flexDirection: 'column', flex: 0.1, cursor: 'pointer'}}>
              <FaAdd style={{transform: 'scale(2)', color: '#2196f3', marginBottom: 30, marginLeft: 20, marginRight: 20}} onClick={this.appendSelectedFiles}/>
              <FaRemove style={{transform: 'scale(2)', color: outboundFiles.length ? '#b91c1c' : '#9e9e9e', marginLeft: 20, marginRight: 20}} onClick={this.removeSelectedFiles}/>
            </div>
            : null
          }
          <FileList key="outboundFilelist" wrapperId="outboundFilelist" files={outboundFiles}/>
          <div style={{flex: 0.2, display: outboundFiles.length ? 'flex' : 'none', alignItems: 'center', flexDirection: 'column', cursor: 'pointer'}}>
            <FaArrowDown style={{transform: 'scale(2)', marginBottom: 30, marginLeft: 20}} onClick={this.moveDown}/>
            <FaArrowUp style={{transform: 'scale(2)', marginLeft: 20}} onClick={this.moveUp}/>
          </div>
        </div>
      </div>
    )
  }


  handleImportData = () => {
    const {dispatch, outboundFiles} = this.props

    if (outboundFiles.length) {
      dispatch(SuppliersActions.importData(this.props.activeId, outboundFiles))
    } else {
      alert("No files added to import")
    }
  }

  handleExportData = () => {
    this.props.dispatch(SuppliersActions.exportData(this.props.activeId))
  }

  handleTransferData = () => {
    this.props.dispatch(SuppliersActions.transferData(this.props.activeId))
  }

  handleCleanDataspace = () => {

    const response = confirm("Are you sure you want to clean up the dataspace current provider?")

    if (response == true) {
      const {dispatch} = this.props
      dispatch(SuppliersActions.cleanDataspace(this.props.activeId))
    }

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

      if(index == 0) break

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
      if (providerFilelist.options[i].selected) {
        selectedFiles.push(providerFilelist[i].text)
      }
    }

    const { dispatch } = this.props

    dispatch(SuppliersActions.appendFilesToOutbound(selectedFiles))

    Array.prototype.forEach.call(document.querySelectorAll("#providerFilelist :checked"), (el) => { el.selected = false })

  }

  removeSelectedFiles = () => {

    let outboundFilelist = document.querySelector('#outboundFilelist')

    let selectedFiles = []
    for (let i = 0; i < outboundFilelist.length; i++) {
      if (outboundFilelist.options[i].selected) selectedFiles.push(outboundFilelist[i].text)
    }

    this.props.dispatch(SuppliersActions.removeFilesToOutbound(selectedFiles))

    Array.prototype.forEach.call(document.querySelectorAll("#outboundFilelist :checked"), (el) => { el.selected = false })
  }
}

const mapStateToProps = (state, ownProps) => {

  const files = state.MardukReducer.filenames.fetch_filesnames['files'].map( (file) => file.name)

  return {
    providers: state.SuppliersReducer.data,
    activeId: state.SuppliersReducer.activeId,
    files: files || [],
    filelistIsLoading: state.MardukReducer.filenames.isLoading,
    outboundFiles: state.UtilsReducer.outboundFilelist,
    statusList: state.SuppliersReducer.statusList,
    filter: state.MardukReducer.chouetteJobFilter,
    chouetteInfo: state.UtilsReducer.supplierForm.chouetteInfo
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
)(DataMigrationDetails)
