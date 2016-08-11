import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersActions from '../actions/SuppliersActions'
import ProviderFilelist from './ProviderFilelist'
import OutboundFilelist from './OutboundFilelist'
import StatusList from './StatusList'

import cfgreader from '../config/readConfig'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import Button from 'muicss/lib/react/Button'
import Panel from 'muicss/lib/react/panel'
import Container from 'muicss/lib/react/container'
import Loader from 'halogen/PulseLoader'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'
import Dropdown from 'muicss/lib/react/dropdown'
import DropdownItem from 'muicss/lib/react/dropdown-item'


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
    dispatch(SuppliersActions.selectActiveSupplier(0))
    dispatch(SuppliersActions.fetchSuppliers())
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

    const { store, activeId, providers, files, filelistIsLoading, outboundFiles, statusList}  = this.props

    if (providers && providers.length > 0) {
      var provider = providers.filter(function(p) { return p.id == activeId })[0]
    }

    if (filelistIsLoading) {

      return (
        <div className="supplier-details disabled">
          <div className="supplier-header">
            <Loader color="#39a1f4" size="16px" margin="40px"/>
          </div>
        </div>
      )
    }

    if (provider && files) {

      return (
        <div className="supplier-details">
          <Container fluid={true}>
            <Row>
              <Col md="8">
                <h3 id="supplier-name">{provider.name}</h3>
              </Col>
            </Row>
            <Row>
              <Col md="8">
                <Dropdown color="primary" label="Data actions">
                  <DropdownItem onClick={this.handleImportData}>Import+validate+export</DropdownItem>
                  <DropdownItem onClick={this.handleValidateProvider}>Validate</DropdownItem>
                  <DropdownItem onClick={this.handleExportData}>Export</DropdownItem>
                  <DropdownItem onClick={this.handleCleanDataspace}>Clean dataspace</DropdownItem>
                </Dropdown>
              </Col>
            </Row>
          </Container>
          <Container fluid={true}>
            <Row>
              <Col md="8">
                <ProviderFilelist files={files}></ProviderFilelist>
              </Col>
            </Row>
            <Row>
              <Col md="8">
                <Button onClick={this.appendSelectedFiles}>Append</Button>
                <Button onClick={this.removeSelectedFiles}>Remove</Button>
              </Col>
            </Row>
            <Row>
              <Col md="8">
                <OutboundFilelist files={outboundFiles}></OutboundFilelist>
              </Col>
            </Row>
            <Row>
              <Col md="8">
                <Button onClick={this.moveDown}>Down</Button>
                <Button onClick={this.moveUp}>UP</Button>
              </Col>
            </Row>
          </Container>
          <div className="mui--divider-bottom"></div>
          <StatusList list={statusList}></StatusList>
            <div className="mui--divider-bottom"></div>

          <Container fluid={true}>
            <Row>
              <Col className="edit-dashboard" md="8">
                <Button onClick={() => browserHistory.push(`/admin/ninkasi/provider/${activeId}/edit/`)}>Edit</Button>
                <Button color="danger" onClick={this.handleDeleteProvider}>Delete</Button>
              </Col>
            </Row>
          </Container>
        </div>
      )

    } else {

      return (
        <div className="supplier-details disabled">
          <div className="supplier-header">
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
    outboundFiles: state.UtilsReducer.outboundFilelist,
    statusList: state.SuppliersReducer.statusList
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
