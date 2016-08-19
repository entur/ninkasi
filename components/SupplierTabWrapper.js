import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersActions from '../actions/SuppliersActions'
import StatusList from './StatusList'
import ChouetteJobDetails from './ChouetteJobDetails'
import ChouetteAllJobs from './ChouetteAllJobs'

import DataMigrationDetails from './DataMigrationDetails'

import cfgreader from '../config/readConfig'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import Button from 'muicss/lib/react/button'
import Panel from 'muicss/lib/react/panel'
import Container from 'muicss/lib/react/container'
import Loader from 'halogen/PulseLoader'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'
import Dropdown from 'muicss/lib/react/dropdown'
import DropdownItem from 'muicss/lib/react/dropdown-item'
import Tabs from 'muicss/lib/react/tabs'
import Tab from 'muicss/lib/react/tab'

const FaArrowDown = require('react-icons/lib/fa/arrow-down')
const FaArrowUp = require('react-icons/lib/fa/arrow-up')
const FaEdit = require('react-icons/lib/fa/pencil')
const FaRemove = require('react-icons/lib/fa/times-circle')
const FaAdd = require('react-icons/lib/fa/plus-circle')
const FaFresh = require('react-icons/lib/fa/refresh')

class SupplierTabWrapper extends React.Component {

  componentWillMount() {
    var self = this
    cfgreader.readConfig( (function(config) {
      window.config = config
      self.startPolling()
    }).bind(this))
  }


  handleDeleteProvider = () => {

    const response = confirm("Are you sure you want to delete current provider?")

    if (response == true) {
      const {dispatch} = this.props
      dispatch(SuppliersActions.deleteProvider(this.props.activeId))
    }

  }

  startPolling = () => {
    var self = this
    setTimeout(() => {
      this._timer = setInterval(self.poll, 10000)
    }, 1000)
  }


  poll = () => {

    const {dispatch, activeId, activeTab} = this.props

    if (activeTab === 'chouetteJobs' && activeId) {
       dispatch(SuppliersActions.getChouetteJobStatus())
    }
  }

  onTabChange(i, value, tab, ev) {

   const {dispatch, activeId, choutteJobFilter, actionFilter} = this.props

     switch (value) {
       case 'chouetteJobs':
        dispatch(SuppliersActions.getChouetteJobStatus(activeId, choutteJobFilter, actionFilter))
        dispatch(SuppliersActions.setActiveTab(value))
         break
       case 'events':
        dispatch(SuppliersActions.getProviderStatus(activeId))
        dispatch(SuppliersActions.setActiveTab(value))
        break

       default: break

     }

  }

  onAllProvidersTabChange(i, value, tab, ev) {
    console.log("Does trigger")
  }

  handleRefresh = () => {
    const {dispatch, activeId, filter, actionFilter} = this.props
    dispatch(SuppliersActions.refreshSupplierData(activeId, filter, actionFilter))
  }


  onActive(tab) {
   //console.log(arguments)
  }

  render() {

    const { displayAllSuppliers, store, activeId, suppliers, filelistIsLoading, statusList}  = this.props

    if (filelistIsLoading) {

      return (
        <div className="supplier-details disabled">
          <div className="supplier-header">
            <Loader color="#39a1f4" size="16px" margin="40px"/>
          </div>
        </div>
      )
    }

    if (!displayAllSuppliers && suppliers.length) {
      var supplier = suppliers.filter(function(p) { return p.id == activeId })[0]
    }

    if (displayAllSuppliers || supplier) {

      return (

        <div>
          <div className="supplier-header">
          <Container fluid={true}>
          { !displayAllSuppliers ?
              <Row>
                <Col md="3"><p>{supplier.name}</p></Col>
                <Col md="1"><Button  onClick={this.handleRefresh}><FaFresh/></Button></Col>
                <Col md="2">
                  <Button color="primary" onClick={() => browserHistory.push(`/admin/ninkasi/provider/${activeId}/edit/`)}><FaEdit/> Edit</Button>
                </Col>
                <Col md="2">
                  <Button color="danger" onClick={this.handleDeleteProvider}><FaRemove/> Delete</Button>
                </Col>
              </Row> :
              <Row>
                <Col md="4"><h2>All suppliers ({suppliers.length})</h2></Col>
              </Row>
          }
          </Container>
        </div>

        <Container fluid={true}>

          { !displayAllSuppliers ?

            <Tabs onChange={this.onTabChange.bind(this)} initialSelectedIndex={0}>
              <Tab value="migrateData" label="Migrate data" onActive={this.onActive}>
                <DataMigrationDetails></DataMigrationDetails>
              </Tab>
              <Tab value="events" label="Events">
                <StatusList key="statusList"></StatusList>
              </Tab>
              <Tab value="chouetteJobs" label="Chouette jobs">
                <ChouetteJobDetails></ChouetteJobDetails>
              </Tab>
            </Tabs> :

            <ChouetteAllJobs></ChouetteAllJobs>
          }
          </Container>

        </div>
      )
    }

     else {

      return (
        <div></div>
      )
    }

  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    suppliers: state.SuppliersReducer.data,
    activeId: state.SuppliersReducer.activeId,
    filelistIsLoading: state.MardukReducer.filenames.isLoading,
    activeTab: state.UtilsReducer.activeTab,
    actionFilter: state.MardukReducer.actionFilter,
    displayAllSuppliers: state.MardukReducer.all_suppliers_selected
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
)(SupplierTabWrapper)