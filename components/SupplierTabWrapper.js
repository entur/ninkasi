import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersActions from '../actions/SuppliersActions'
import StatusList from './StatusList'
import ChouetteJobDetails from './ChouetteJobDetails'
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

  constructor(props) {
    super(props)
    this.activeTab = 'migrateData'
  }

  componentWillMount() {
    var self = this
    cfgreader.readConfig( (function(config) {
      window.config = config
      self.startPolling()
    }).bind(this))
  }


  startPolling = () => {
    var self = this
    setTimeout(() => {
      this._timer = setInterval(self.poll, 15000)
    }, 1000)
  }

  handleDeleteProvider = () => {

    const response = confirm("Are you sure you want to delete current provider?")

    if (response == true) {
      const {dispatch} = this.props
      dispatch(SuppliersActions.deleteProvider(this.props.activeId))
      dispatch(SuppliersActions.selectActiveSupplier(0))
      dispatch(SuppliersActions.fetchSuppliers())
    }

  }


  poll = () => {

    const {dispatch, activeId} = this.props

    if (this.activeTab && this.activeTab === 'chouetteJobs' && activeId) {
      dispatch(SuppliersActions.getChouetteJobStatus(activeId))
    }
  }

  onChange(i, value, tab, ev) {

   const {dispatch, activeId} = this.props
   this.activeTab = value

     switch (value) {
       case 'chouetteJobs':
        dispatch(SuppliersActions.getChouetteJobStatus(activeId))
         break
       case 'events':
        dispatch(SuppliersActions.getProviderStatus(activeId))
        break

       default: break

     }

  }

  onActive(tab) {
   //console.log(arguments)
  }

  render() {

    const { store, activeId, suppliers, files, filelistIsLoading, outboundFiles, statusList, chouetteJobStatus}  = this.props

    if (suppliers && suppliers.length > 0) {
      var supplier = suppliers.filter(function(p) { return p.id == activeId })[0]
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

    if (supplier) {

      return (

        <div>
        <div className="supplier-header">
          <h2>{supplier.name}</h2>
        </div>
          <Tabs onChange={this.onChange.bind(this)} initialSelectedIndex={0}>
            <Tab value="migrateData" label="Migrate data" onActive={this.onActive}>
              <DataMigrationDetails></DataMigrationDetails>
            </Tab>
            <Tab value="events" label="Events">
              <StatusList key="statusList"></StatusList>
            </Tab>
            <Tab value="chouetteJobs" label="Chouette jobs">
              <ChouetteJobDetails></ChouetteJobDetails>
            </Tab>
          </Tabs>
          <Container fluid={true}>
            <Row>
              <Col className="edit-dashboard" md="20">
                <Button onClick={() => browserHistory.push(`/admin/ninkasi/provider/${activeId}/edit/`)}><FaEdit/> Edit</Button>
                <Button color="danger" onClick={this.handleDeleteProvider}><FaRemove/> Delete</Button>
              </Col>
            </Row>
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
    files: state.MardukReducer.filenames.fetch_filesnames ? state.MardukReducer.filenames.fetch_filesnames['files'] : [],
    filelistIsLoading: state.MardukReducer.filenames.isLoading,
    outboundFiles: state.UtilsReducer.outboundFilelist,
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
