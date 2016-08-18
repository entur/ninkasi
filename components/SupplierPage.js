import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersContainer from '../components/SuppliersContainer'
import NotificationContainer from '../components/NotificationContainer'
import cfgreader from '../config/readConfig'
import { Link, browserHistory } from 'react-router'
import EditSupplierPage from  '../components/EditSupplierPage'
import NewSupplierPage from  '../components/NewSupplierPage'

import SuppliersActions from '../actions/SuppliersActions'

class SupplierPage extends React.Component {

  componentWillMount() {

    const {id, dispatch} = this.props

    cfgreader.readConfig( (function(config) {
      window.config = config

      if (id) {
        console.log("DOES THIS EVER HAPPEN YO")
        dispatch(SuppliersActions.fetchProvider(id))
      }

    }).bind(this))

  }

  handleSubmit(data) {

    cfgreader.readConfig( (function(config) {
      window.config = config

      const {dispatch, id} = this.props

      let provider = {}

      provider.name = data.name
      provider.sftpAccount = data.sftp_account

      provider.chouetteInfo = {
          prefix: data.prefix,
          referential: data.referential,
          organisation: data.organisation,
          user: data.cuser,
          regtoppVersion: data.regtopp_version,
          regtoppCoordinateProjection: data.regtopp_coordinate_projection,
          regtoppCalendarStrategy: data.regtopp_calendar_strategy,
          dataFormat: data.data_format,
          enableValidation: data.enable_validation
      }

      if (id) {
        provider.id = provider.chouetteInfo.id = id
        dispatch(SuppliersActions.updateProvider(provider))
      } else {
        dispatch(SuppliersActions.createProvider(provider))
      }

    }).bind(this))

  }

  render() {

    const {id} = this.props

    const providerDummy = {
        name:"",
        sftpAccount:"",
        chouetteInfo: {
          prefix: "",
          referential: "",
          organisation: "",
          user: "",
          regtoppVersion: "",
          regtoppCoordinateProjection: "",
          data_format: "",
          regtoppCalendarStrategy: "",
          enable_validation: false
        }
    }

    const provider = this.props.provider || providerDummy

    return (
      <div className="supplierPage">
        {(id ?
          <EditSupplierPage provider={provider} onSubmit={this.handleSubmit.bind(this)}/> :
          <NewSupplierPage provider={provider} onSubmit={this.handleSubmit.bind(this)}/>
        )}
        <NotificationContainer/>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  const provider = state.SuppliersReducer.provider

  return {
    id: ownProps.params.id,
    provider: provider
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
)(SupplierPage)
