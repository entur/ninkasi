import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import { browserHistory } from 'react-router'


import Button from 'muicss/lib/react/button'
import Panel from 'muicss/lib/react/panel'
import Container from 'muicss/lib/react/container'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'

import ProviderFilelist from './ProviderFilelist'
import OutboundFilelist from './OutboundFilelist'
import SuppliersActions from '../actions/SuppliersActions'

const FaArrowDown = require('react-icons/lib/fa/arrow-down')
const FaArrowUp = require('react-icons/lib/fa/arrow-up')
const FaEdit = require('react-icons/lib/fa/pencil')
const FaRemove = require('react-icons/lib/fa/times-circle')
const FaAdd = require('react-icons/lib/fa/plus-circle')
const FaFresh = require('react-icons/lib/fa/refresh')

class DataMigrationDetails extends React.Component {

  render() {

    const {files, outboundFiles, activeId} = this.props

    return (

          <div>

            <div className="button-group">
                <Button color="primary" onClick={this.handleImportData}>Import</Button>
                <Button color="primary" onClick={this.handleValidateProvider}>Validate</Button>
                <Button color="primary" onClick={this.handleExportData}>Export</Button>
                <Button color="danger" onClick={this.handleCleanDataspace}>Clean</Button>
            </div>

            <Container fluid={true}>
              <Row>
                <div>
                  <div className="description-title">Files from S3</div>
                  <ProviderFilelist files={files}></ProviderFilelist>
                </div>
              </Row>
              <Row>
                <Col md="8">
                  <Button onClick={this.appendSelectedFiles}><FaAdd/> Add</Button>
                  <Button onClick={this.removeSelectedFiles}><FaRemove/> Remove</Button>
                </Col>
              </Row>
              <Row>
                <div>
                  <OutboundFilelist files={outboundFiles}></OutboundFilelist>
                </div>
              </Row>
              {outboundFiles.length ? <Row>
                <Col md="8">
                  <Button onClick={this.moveDown}><FaArrowDown/> Down</Button>
                  <Button onClick={this.moveUp}><FaArrowUp/> Up</Button>
                </Col>
              </Row> : <Row></Row>}
            </Container>

            <div className="mui--divider-bottom"></div>
            <div className="mui--divider-bottom"></div>
          </div> )
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

}

const mapStateToProps = (state, ownProps) => {
  return {
    providers: state.SuppliersReducer.data,
    activeId: state.SuppliersReducer.activeId,
    files: state.MardukReducer.filenames.fetch_filesnames['files'],
    filelistIsLoading: state.MardukReducer.filenames.isLoading,
    outboundFiles: state.UtilsReducer.outboundFilelist,
    statusList: state.SuppliersReducer.statusList,
    filter: state.MardukReducer.chouetteJobFilter,
    actionFilter: state.MardukReducer.actionFilter
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
