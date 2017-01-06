import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersActions from '../actions/SuppliersActions'
import EventDetails from './EventDetails'
import ChouetteJobDetails from './ChouetteJobDetails'
import ChouetteAllJobs from './ChouetteAllJobs'

import DataMigrationDetails from './DataMigrationDetails'

import cfgreader from '../config/readConfig'
import Container from 'muicss/lib/react/container'
import Loader from 'halogen/PulseLoader'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'
import Tabs from 'muicss/lib/react/tabs'
import Tab from 'muicss/lib/react/tab'

const FaEdit = require('react-icons/lib/fa/pencil')
const FaFresh = require('react-icons/lib/fa/refresh')

require('../sass/main.scss')


class SupplierTabWrapper extends React.Component {
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

  handleRefresh = () => {
    const {dispatch, activeId, filter, actionFilter} = this.props
    dispatch(SuppliersActions.refreshSupplierData(activeId, filter, actionFilter))
  }


  onActive(tab) {
   //console.log(arguments)
  }

  handleEditProvider = () => {
    this.props.dispatch(SuppliersActions.openEditProviderDialog())
  }

  render() {

    const { displayAllSuppliers, activeId, suppliers, filelistIsLoading}  = this.props

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

      let tabsToRender = null

      if (!displayAllSuppliers) {

        tabsToRender =
          <Tabs onChange={this.onTabChange.bind(this)} initialSelectedIndex={0}>
              <Tab value="migrateData" label="Migrate data" onActive={this.onActive}>
                <DataMigrationDetails></DataMigrationDetails>
              </Tab>
              <Tab value="events" label="Events">
                <EventDetails key="statusList"></EventDetails>
              </Tab>
              <Tab value="chouetteJobs" label="Chouette jobs">
                <ChouetteJobDetails></ChouetteJobDetails>
              </Tab>
          </Tabs>

      } else {
          tabsToRender =
            <Tabs initialSelectedIndex={0}>
              <Tab value="chouetteJobs" label="Chouette jobs">
                <ChouetteAllJobs></ChouetteAllJobs>
              </Tab>
              <Tab value="statistics" label="Statistics">
                <p>Statics for providers</p>
              </Tab>
          </Tabs>
      }

      return (

        <div className="supplier-info">
          <div className="supplier-header">
          <div>
          { !displayAllSuppliers ?
              <div style={{display: 'flex', alignItems: 'center'}}>
                  <span>{supplier.id} {supplier.name}</span>
                  <div className="small-button" onClick={() => this.handleEditProvider()}><FaEdit/></div>
                  <div style={{marginLeft: 'auto', paddingRight: 20}}><FaFresh onClick={this.handleRefresh}/></div>
              </div> :
              <div>
                <span>All providers ({suppliers.length})</span>
              </div>
          }
          </div>
        </div>

        <Container fluid={true}>
            {(tabsToRender)}
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
    displayAllSuppliers: state.SuppliersReducer.all_suppliers_selected
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