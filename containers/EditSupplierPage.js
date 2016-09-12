import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersContainer from './SuppliersContainer'
import NotificationContainer from './NotificationContainer'
import cfgreader from '../config/readConfig'
import {reduxForm} from 'redux-form'
import { browserHistory } from 'react-router'
import SuppliersActions from '../actions/SuppliersActions'

import Form from 'muicss/lib/react/form'
import Input from 'muicss/lib/react/input'
import Button from 'muicss/lib/react/button'
import Checkbox from 'muicss/lib/react/checkbox'

class EditSupplierPage extends React.Component {

  componentDidMount() {
    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this))
  }

  handleValueChange = (key, event) => {

    let value = event.target.value

    if (key === 'enableValidation')  {
      value = event.target.checked
    }

    const {dispatch} = this.props

    dispatch(SuppliersActions.updateSupplierForm(key, value))
  }

  render() {

    const {handleOnSubmit, shouldUpdate, dispatch} = this.props

    let {provider} = this.props

    const header = !shouldUpdate ? "Create new provider" : `Edit - ${provider.name} (${provider.id})`

    if (!shouldUpdate) {
      provider = {
        name: "",
        sftpAccount: "",
        chouetteInfo: {
          prefix: "",
          referential: "",
          organisation: "",
          user: "",
          regtoppVersion: "",
          regtoppCoordinateProjection: "",
          regtoppCalendarStrategy: "",
          dataFormat: "",
          enableValidation: false
        }
      }
    }

    const inputStyle = { margin: "25px auto", width: "90%", height: "23px"}

    const headerStyle = { fontSize: "1.1em", fontWeight: "600", width: "100%", textAlign: "center"}

    const submitStyle = { float: "right", marginTop: "-4%", marginRight: "10%", marginBottom: "2%"}

    return (

      <Form onSubmit={(event) => handleOnSubmit(event)} style={ {background: "#fff"}}>
       <legend style={headerStyle}>{header}</legend>
       <Input onChange={ (event) => this.handleValueChange("name", event)} defaultValue={provider.name} style={inputStyle} floatingLabel={true} label="Provider name" />
       <Input onChange={ (event) => this.handleValueChange("sftpAccount", event)} defaultValue={provider.sftpAccount} style={inputStyle} floatingLabel={true} label="sFtp Account" />
       <Input onChange={ (event) => this.handleValueChange("prefix", event)} defaultValue={provider.chouetteInfo.prefix} style={inputStyle} floatingLabel={true} label="Prefix" />
       <Input onChange={ (event) => this.handleValueChange("referential", event)} defaultValue={provider.chouetteInfo.referential} style={inputStyle} floatingLabel={true} label="Referential" />
       <Input onChange={ (event) => this.handleValueChange("organisation", event)} defaultValue={provider.chouetteInfo.organisation} style={inputStyle} floatingLabel={true} label="Organisation" />
       <Input onChange={ (event) => this.handleValueChange("user", event)} defaultValue={provider.chouetteInfo.user} style={inputStyle} floatingLabel={true} label="Chouette User" />
       <Input onChange={ (event) => this.handleValueChange("regtoppVersion", event)} defaultValue={provider.chouetteInfo.regtoppVersion} style={inputStyle} floatingLabel={true} label="Regtopp Version" />
       <Input onChange={ (event) => this.handleValueChange("regtoppCoordinateProjection", event)} defaultValue={provider.chouetteInfo.regtoppCoordinateProjection} style={inputStyle} floatingLabel={true} label="Regtopp coordinate projection" />
       <Input onChange={ (event) => this.handleValueChange("dateFormat", event)} style={inputStyle} defaultValue={provider.chouetteInfo.dateFormat} floatingLabel={true} label="Date format" />
       <Input onChange={ (event) => this.handleValueChange("regtoppCalendarStrategy", event)} defaultValue={provider.chouetteInfo.regtoppCalendarStrategy} style={inputStyle} floatingLabel={true} label="Regtopp calendar strategy" />
       <Checkbox onChange={ (event) => this.handleValueChange("enableValidation", event)} style={inputStyle} name="enableValidation" defaultChecked={provider.chouetteInfo.enableValidation} label="Enable validation" />
       <Button color="primary" style={submitStyle} variant="raised">Submit</Button>
     </Form>
    )
  }
}


export default EditSupplierPage
