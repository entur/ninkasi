import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersContainer from '../components/SuppliersContainer'
import NotificationContainer from '../components/NotificationContainer'
import cfgreader from '../config/readConfig'
import {reduxForm} from 'redux-form'
import { browserHistory } from 'react-router'


require('../sass/components/forms.scss')


class NewSupplierPage extends React.Component {

  componentWillMount() {
    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this))
  }

  render() {

    const {fields: {name, sftp_account, prefix, referential, organisation, cuser,
          regtopp_version, regtopp_coordinate_projection, data_format, regtopp_calendar_strategy, enable_validation}, handleSubmit}
           = this.props

    return (

      <form className="supplier-form" onSubmit={handleSubmit}>
        <h2>Create provider</h2>
        <div className="form-row">
          <label>Provider name</label>
          <input value="" type="text" placeholder="Provider name" {...name}/>
        </div>
        <div className="form-row">
          <label>sftp_account</label>
          <input value="" type="text" placeholder="sftp_account" {...sftp_account}/>
        </div>
        <h4>Chouette info</h4>
        <div className="form-row">
          <label>Prefix</label>
          <input  value="" type="text" placeholder="prefix" {...prefix}/>
        </div>
        <div className="form-row">
          <label>Referential</label>
          <input value="" type="text" placeholder="referential" {...referential}/>
        </div>
        <div className="form-row">
          <label>Organisation</label>
          <input value="" type="text" placeholder="organisation" {...organisation}/>
        </div>
        <div>
          <label>Cuser</label>
          <input value="" type="text" placeholder="Cuser" {...cuser}/>
        </div>
        <div>
          <label>Regtopp version</label>
          <input value="" type="text" placeholder="regtopp_version" {...regtopp_version}/>
        </div>
        <div>
          <label>Regtopp coordinate projection</label>
          <input value="" type="text" placeholder="regtopp_coordinate_projection" {...regtopp_coordinate_projection}/>
        </div>
        <div>
          <label>Data format</label>
          <input value="" type="text" placeholder="Data format" {...data_format}/>
        </div>
        <div>
          <label>Regtopp calender strategy</label>
          <input value="" type="text" placeholder="regtopp_calendar_strategy" {...regtopp_calendar_strategy}/>
        </div>
        <div>
          <label>Enable validation</label>
          <input value="" type="checkbox" {...enable_validation}/>
        </div>
        <div className="button-panel">
          <button id="back" onClick={(e) => { e.preventDefault(); browserHistory.push('/admin/ninkasi/') }}>Back</button>
          <button className="primary" type="submit">Submit</button>
        </div>
      </form>
    )
  }
}

NewSupplierPage = reduxForm({
  form: 'provider',
  fields: ['name', 'sftp_account', 'prefix', 'referential', 'organisation', 'cuser', 'regtopp_version',
          'regtopp_coordinate_projection', 'data_format', 'regtopp_calendar_strategy', 'enable_validation']
})(NewSupplierPage)

export default NewSupplierPage
