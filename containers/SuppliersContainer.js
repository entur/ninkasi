import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersActions from '../actions/SuppliersActions'
import cfgreader from '../config/readConfig'
import Option from 'muicss/lib/react/option'
import Select from 'muicss/lib/react/select'
import Button from 'muicss/lib/react/button'
const FaAdd = require('react-icons/lib/fa/plus')
const FaHistory = require('react-icons/lib/fa/history')
const FaExclamation = require('react-icons/lib/fa/exclamation-triangle')
import Dropdown from 'muicss/lib/react/dropdown'
import DropdownItem from 'muicss/lib/react/dropdown-item'

class SuppliersContainer extends React.Component {

  componentWillMount() {
   const { dispatch } = this.props
    cfgreader.readConfig( (function(config) {
      window.config = config
      dispatch(SuppliersActions.fetchSuppliers())
    }).bind(this))
  }

  handleBuildGraph() {
   this.props.dispatch(SuppliersActions.buildGraph())
  }

  handleFetchOSM() {
    this.props.dispatch(SuppliersActions.fetchOSM())
  }

  openModal() {
    this.props.dispatch(SuppliersActions.openModalDialog())
  }

  selectSupplier(event) {
    const { dispatch } = this.props
    const { value } = event.target

    if (value > 0) {
      dispatch(SuppliersActions.selectActiveSupplier(value))
    } else {
      dispatch(SuppliersActions.selectAllSuppliers())
    }
  }

  handleNewProvider() {
    this.props.dispatch(SuppliersActions.openNewProviderDialog())
  }

  handleCancelAllJobs() {
    const confirmedByUser = confirm('Are you want to cancel all chouette jobs for all providers?');

    if (confirmedByUser) {
      this.props.dispatch(SuppliersActions.cancelAllChouetteJobsforAllProviders())
    }
  }

  handleCleanAllDataSpaces(filter) {
    const confirmedByUser = confirm(`Are you sure you want to clean all dataspaces with filter ${filter}?`)

    if (confirmedByUser) {
      this.props.dispatch(SuppliersActions.cleanAllDataspaces(filter))
    }
  }

  handleCleanFileFilter() {
    const confirmedByUser = confirm('Are you sure you want to clean file filter?')

    if (confirmedByUser) {
      this.props.dispatch(SuppliersActions.cleanFileFilter())
    }
  }


  render() {

    const {suppliers, activeProviderId} = this.props

    let selectedValue = (typeof(activeProviderId) !== 'undefined') ? String(activeProviderId) : "0"

    let innerContainerStyle = {
      display: 'flex',
      background: '#2f2f2f',
      color: '#fff',
      justifyContent: 'flex-end',
      padding: '10px 20px'
    }

    return (

      <div className="suppliers-container">
          <div style={innerContainerStyle}>
            <Button style={{fontSize: 12}} color="dark" onClick={() => this.openModal()}><FaHistory color="#fff"/> History</Button>
            <Button style={{fontSize: 12}} color="dark" onClick={this.handleBuildGraph.bind(this)}>Build Graph</Button>
            <Button style={{fontSize: 12}} color="dark" onClick={this.handleFetchOSM.bind(this)}>Fetch OSM</Button>
            <Button style={{fontSize: 12}} color="dark" onClick={() => this.handleCleanFileFilter()}><FaExclamation color="#b8c500"/> Clean file filter</Button>
            <Button style={{fontSize: 12}} color="dark" onClick={() => this.handleCancelAllJobs()}><FaExclamation color="#b8c500"/> Cancel all jobs</Button>
            <Dropdown id="dropdown-clean-all" color="dark" label="Clean all">
              <DropdownItem onClick={() => this.handleCleanAllDataSpaces('all')}>All</DropdownItem>
              <DropdownItem onClick={() => this.handleCleanAllDataSpaces('level1')}>Level 1</DropdownItem>
              <DropdownItem onClick={() => this.handleCleanAllDataSpaces('level2')}>Level 2</DropdownItem>
            </Dropdown>
          </div>
        <div>
          <Select style={{display: 'inline-block', margin: 15}} className="select-supplier" value={ selectedValue } id="select-supplier" label="Provider" onChange={ (value) => this.selectSupplier(value)}>
              <Option key="supplier-all" value="-1" label={"All providers"}></Option>
              {suppliers.map(supplier => {
                return (
                    <Option key={supplier.id} value={String(supplier.id)} label={`${supplier.id} ${supplier.name}`}>
                    </Option>
                )
              })}
            </Select>
          <div className="new-provider" style={{display: 'inline-block', marginLeft: 10}} onClick={() => this.handleNewProvider()}><FaAdd/> New</div>
        </div>
    </div>
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
