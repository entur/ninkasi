import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersContainer from '../components/SuppliersContainer'
import SupplierDetails from '../components/SupplierDetails'
import NotificationContainer from '../components/NotificationContainer'
import cfgreader from '../config/readConfig'
import {reduxForm} from 'redux-form'


class SupplierForm extends React.Component {

  componentDidMount() {
    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this))
  }

  constructor(props) {
    super(props)
  }

  handleSubmit(values, dispatch) {
    console.log("values in form", values)
  }

  render() {
    const {fields: {name}} = this.props
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Provider name</label>
          <input type="text" placeholder="Provider name" {...name}/>
        </div>
        <button type="submit">Submit</button>
      </form>
    )
  }
}

SupplierForm = reduxForm({
  form: 'provider',
  fields: ['name']
})(SupplierForm)

export default SupplierForm
