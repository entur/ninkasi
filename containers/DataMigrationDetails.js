import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import Button from 'muicss/lib/react/button'
import FileList from '../components/FileList'
import SuppliersActions from '../actions/SuppliersActions'

const FaArrowDown = require('react-icons/lib/fa/arrow-down')
const FaArrowUp = require('react-icons/lib/fa/arrow-up')
const FaRemove = require('react-icons/lib/fa/arrow-left')
const FaAdd = require('react-icons/lib/fa/arrow-right')
import MdFileDownLoad from 'react-icons/lib/md/file-download'

class DataMigrationDetails extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      downloadLink: {
        URL: null
      }
    }
  }

  render() {

    const { files, outboundFiles, chouetteInfo } = this.props

    const shouldRenderTransfer = !!chouetteInfo.migrateDataToProvider

    const toolTips = {
      import: 'Import all files listed in the list on the right side below. Files will be imported in the given order. If success, VALIDATE will be called',
      validate: 'Validate data in dataspace. If success, TRANSFER will be called if in level 1 space or EXPORT if in level 2 space',
      transfer: 'Transfer data from this space to the next space (Rutebanken space with id ' + chouetteInfo.migrateDataToProvider+ '). If success, VALIDATE in level 2 space will be called',
      export: 'Export GTFS data and trigger bulding',
      clean: 'Clean data space (delete ALL transport data)'
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
          <FileList key="providerFilelist" wrapperId="providerFilelist" files={files} handleSelectFileToDownload={this.handleSelectFileToDownload.bind(this)}/>
          { files.length
            ?
            <div style={{display: 'flex', alignItem: 'center', flexDirection: 'column', flex: 0.1, cursor: 'pointer'}}>
              <FaAdd style={{transform: 'scale(2)', color: '#2196f3', marginBottom: 30, marginLeft: 20, marginRight: 20}} onClick={this.appendSelectedFiles}/>
              <FaRemove style={{transform: 'scale(2)', color: outboundFiles.length ? '#b91c1c' : '#9e9e9e', marginLeft: 20, marginRight: 20}} onClick={this.removeSelectedFiles}/>
            </div>
            : <div style={{margin: 20, fontWeight: 600}}>No files available</div>
          }
          <FileList key="outboundFilelist" wrapperId="outboundFilelist" files={outboundFiles}/>
          <div style={{flex: 0.2, display: outboundFiles.length ? 'flex' : 'none', alignItems: 'center', flexDirection: 'column', cursor: 'pointer'}}>
            <FaArrowDown style={{transform: 'scale(2)', marginBottom: 30, marginLeft: 20}} onClick={this.moveDown}/>
            <FaArrowUp style={{transform: 'scale(2)', marginLeft: 20}} onClick={this.moveUp}/>
          </div>
        </div>
        <Button color="primary" disabled={!this.state.downloadLink.URL} onClick={this.handleDownloadFile.bind(this)}><MdFileDownLoad style={{marginRight: 5}}/>Download</Button>
      </div>
    )
  }


  handleImportData = () => {
    const { dispatch, outboundFiles } = this.props

    if (outboundFiles.length) {
      dispatch(SuppliersActions.importData(this.props.activeId, outboundFiles))
    } else {
      alert("No files added to import")
    }
  }

  handleDownloadFile() {
    const { URL } = this.state.downloadLink
    let link = document.createElement('a')
    link.setAttribute('href', URL)
    link.setAttribute('download', null)
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent(
      "click", true, false, window, 0, 0, 0, 0, 0
      , false, false, false, false, 0, null
    )
    link.dispatchEvent(event)
  }

  handleSelectFileToDownload(filename) {
    this.setState({
      downloadLink: {
        URL: window.config.mardukBaseUrl+`admin/services/chouette/${this.props.activeId}/files/${filename}`
      }
    })
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
    this.props.dispatch(SuppliersActions.validateProvider(this.props.activeId))
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

export default connect(mapStateToProps,)(DataMigrationDetails)
