import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersActions from '../actions/SuppliersActions'
import cfgreader from '../config/readConfig'
import Option from 'muicss/lib/react/option'
import Select from 'muicss/lib/react/select'
import Container from 'muicss/lib/react/container'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'

const FaAdd = require('react-icons/lib/fa/plus-circle')
const FaHistory = require('react-icons/lib/fa/history')
const FaExclamation = require('react-icons/lib/fa/exclamation-triangle')
import Dropdown from 'muicss/lib/react/dropdown'
import DropdownItem from 'muicss/lib/react/dropdown-item'

class SuppliersContainer extends React.Component {


  componentWillMount() {

   const {dispatch} = this.props

    cfgreader.readConfig( (function(config) {
      window.config = config
      dispatch(SuppliersActions.fetchSuppliers())
    }).bind(this))
  }

  handleBuildGraph() {
    const {dispatch} = this.props
    dispatch(SuppliersActions.buildGraph())
  }

  handleFetchOSM() {
    const {dispatch} = this.props
    dispatch(SuppliersActions.fetchOSM())
  }

  openModal() {
    const {dispatch} = this.props
    dispatch(SuppliersActions.openModalDialog())
  }

  selectSupplier(event) {
    const {dispatch} = this.props
    const {value} = event.target

    if (value > 0) {
      dispatch(SuppliersActions.selectActiveSupplier(value))
    } else {
      dispatch(SuppliersActions.selectAllSuppliers())
    }

  }

  handleNewProvider() {
    const {dispatch} = this.props
    dispatch(SuppliersActions.openNewProviderDialog())
  }

  handleCancelAllJobs() {
    const confirmedByUser = confirm('Are you want to cancel all chouette jobs for all providers?');

    if (confirmedByUser) {
      const {dispatch} = this.props
      dispatch(SuppliersActions.cancelAllChouetteJobsforAllProviders())
    }
  }

  handleCleanAllDataSpaces(filter) {
    const confirmedByUser = confirm(`Are you sure you want to clean all dataspaces with filter ${filter}?`)

    if (confirmedByUser) {
      const {dispatch} = this.props
      dispatch(SuppliersActions.cleanAllDataspaces(filter))
    }
  }

  handleCleanFileFilter() {
    const confirmedByUser = confirm('Are you sure you want to clean file filter?')

    if (confirmedByUser) {
      const {dispatch} = this.props
      dispatch(SuppliersActions.cleanFileFilter())
    }
  }


  render() {

    const {suppliers, activeProviderId} = this.props

    let selectedValue = (typeof(activeProviderId) !== 'undefined') ? String(activeProviderId) : "0"

    return (

      <Container className="suppliers-container">
        <h1>Ninkasi</h1>
        <Row>
          <Col md="18">
            <div style={{float: 'right'}}>
              <Dropdown className="subtle-button" label="Clean all">
                <DropdownItem onClick={() => this.handleCleanAllDataSpaces('all')}>All</DropdownItem>
                <DropdownItem onClick={() => this.handleCleanAllDataSpaces('level1')}>Level 1</DropdownItem>
                <DropdownItem onClick={() => this.handleCleanAllDataSpaces('level2')}>Level 2</DropdownItem>
              </Dropdown>
              <div className="subtle-button mui-btn mui-btn--raised" style={{marginLeft: 7}} onClick={() => this.handleCleanFileFilter()}><FaExclamation color="#972702"/> Clean file filter</div>
              <div className="subtle-button mui-btn mui-btn--raised" style={{marginLeft: 7}} onClick={() => this.handleCancelAllJobs()}><FaExclamation color="#972702"/> Cancel all jobs</div>
              <div className="subtle-button mui-btn mui-btn--raised" onClick={this.handleBuildGraph.bind(this)}>Build Graph</div>
              <div className="subtle-button mui-btn mui-btn--raised" onClick={this.handleFetchOSM.bind(this)}>Fetch OSM</div>
              <div className="subtle-button mui-btn mui-btn--raised" onClick={() => this.openModal()}><FaHistory color="#024797"/> History</div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="5">
            <Select className="select-supplier" value={ selectedValue } id="select-supplier" label="Provider" onChange={ (value) => this.selectSupplier(value)}>
              <Option key="supplier-all" value="-1" label={"All providers"}></Option>
              {suppliers.map(supplier => {
                return (
                    <Option key={supplier.id} value={String(supplier.id)} label={`${supplier.id} ${supplier.name}`}>
                    </Option>
                )
              })}
            </Select>
          </Col>
          <Col md="2">
            <div className="new-provider" onClick={() => this.handleNewProvider()}><FaAdd/> New</div>
          </Col>
      </Row>
    </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    suppliers: state.SuppliersReducer.data,
    activeProviderId: state.SuppliersReducer.activeId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuppliersContainer)
