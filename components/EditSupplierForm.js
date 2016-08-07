import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersContainer from '../components/SuppliersContainer'
import SupplierDetails from '../components/SupplierDetails'
import NotificationContainer from '../components/NotificationContainer'
import cfgreader from '../config/readConfig'
import {reduxForm} from 'redux-form'
import { browserHistory } from 'react-router'
import SuppliersActions from '../actions/SuppliersActions'


require('../sass/components/forms.scss')


class EditSupplierForm extends React.Component {

  componentDidMount() {
    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this))
  }

  render() {

    const {fields: {name, sftp_account, prefix, referential, organisation, cuser,
          regtopp_version, regtopp_coordinate_projection, data_format, regtopp_calendar_strategy, enable_validation}, handleSubmit, provider}
           = this.props

    return (
      <form className="supplier-form" onSubmit={handleSubmit}>
        <h2>Edit provider</h2>
        <div className="form-row">
          <label>Provider name</label>
          <input type="text" placeholder="Provider name" {...name}/>
        </div>
        <div className="form-row">
          <label>sftp_account</label>
          <input type="text" placeholder="sftp_account" {...sftp_account}/>
        </div>
        <h4>Chouette info</h4>
        <div className="form-row">
          <label>Prefix</label>
          <input type="text" placeholder="prefix" {...prefix}/>
        </div>
        <div className="form-row">
          <label>Referential</label>
          <input type="text" placeholder="referential" {...referential}/>
        </div>
        <div className="form-row">
          <label>Organisation</label>
          <input type="text" placeholder="organisation" {...organisation}/>
        </div>
        <div>
          <label>Cuser</label>
          <input type="text" placeholder="Cuser" {...cuser}/>
        </div>
        <div>
          <label>Regtopp version</label>
          <input type="text" placeholder="regtopp_version" {...regtopp_version}/>
        </div>
        <div>
          <label>Regtopp coordinate projection</label>
          <input type="text" placeholder="regtopp_coordinate_projection" {...regtopp_coordinate_projection}/>
        </div>
        <div>
          <label>Data format</label>
          <input type="text" placeholder="Data format" {...data_format}/>
        </div>
        <div>
          <label>Regtopp calender strategy</label>
          <input type="text" placeholder="regtopp_calendar_strategy" {...regtopp_calendar_strategy}/>
        </div>
        <div>
          <label for="enable_validation">Enable validation</label>
          <input id="enable_validation" type="checkbox" {...enable_validation}/>
        </div>
        <button onClick={(e) => { e.preventDefault(); browserHistory.push('/ninkasi/') }}>Back</button>
        <button type="submit">Submit</button>
      </form>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: {
    name : ownProps.provider.name,
    sftp_account: ownProps.provider.sftpAccount,
    prefix: ownProps.provider.chouetteInfo.prefix,
    referential: ownProps.provider.chouetteInfo.referential,
    organisation: ownProps.provider.chouetteInfo.organisation,
    cuser: ownProps.provider.chouetteInfo.user,
    regtopp_version: ownProps.provider.chouetteInfo.regtoppVersion,
    regtopp_coordinate_projection: ownProps.provider.chouetteInfo.regtoppCoordinateProjection,
    data_format: ownProps.provider.chouetteInfo.dataFormat,
    regtopp_calendar_strategy: ownProps.provider.chouetteInfo.regtoppCalendarStrategy,
    enable_validation: ownProps.provider.chouetteInfo.enableValidation
  }
})

EditSupplierForm = reduxForm({
  form: 'provider',
  fields: ['name', 'sftp_account', 'prefix', 'referential', 'organisation', 'cuser', 'regtopp_version',
          'regtopp_coordinate_projection', 'data_format', 'regtopp_calendar_strategy', 'enable_validation']
}, mapStateToProps)(EditSupplierForm)

export default EditSupplierForm
