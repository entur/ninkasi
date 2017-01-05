import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import SuppliersActions from '../actions/SuppliersActions'

import Form from 'muicss/lib/react/form'
import Button from 'muicss/lib/react/button'
import Checkbox from 'muicss/lib/react/checkbox'
import Select from 'muicss/lib/react/select'
import Option from 'muicss/lib/react/option'

class EditSupplierPage extends React.Component {

  componentDidMount() {
    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this))
  }

  handleSelectChange = (event) => {

    const { value } = event.target

    if (value.indexOf('option') > -1) {
      const optionValue = value.replace('option-', '')
      this.props.dispatch(SuppliersActions.updateSupplierForm("migrateDataToProvider", optionValue))
    }

  }

  handleValueChange = (key, event) => {

    let value = ""

    if (key === 'enableValidation')  {
      value = event.target.checked
    } else {
      value = event.target.value
    }

    this.props.dispatch(SuppliersActions.updateSupplierForm(key, value))
  }

  render() {

    const {handleOnSubmit, shouldUpdate, providers, provider} = this.props

    if (shouldUpdate && !provider) return <div>Loading ... </div>

    const header = !shouldUpdate ? "Create new provider" : `Edit - ${provider.name} (${provider.id})`

    let defaultMigrationProvider = 'option-none'

    if (provider.chouetteInfo.migrateDataToProvider) {
      defaultMigrationProvider = 'option-' + provider.chouetteInfo.migrateDataToProvider
    }

    const inputStyle = { margin: "10px auto", width: "90%", height: "25px"}

    const headerStyle = { fontSize: "1.1em", fontWeight: "600", width: "100%", textAlign: "center"}

    const submitStyle = { float: "right", marginTop: "-2%", marginRight: "10%", marginBottom: "2%"}

    const selectStyle = Object.assign({}, inputStyle, { marginTop: "1%", marginBottom: "3%", marginLeft: 0 })

    const checkboxStyle = Object.assign({}, inputStyle, { marginTop: "10%", marginLeft: 0 })

    return (

      <Form onSubmit={(event) => handleOnSubmit(event)} style={ {background: "#fff"}}>
        <div style={{marginLeft: 100}}>
         <legend style={headerStyle}>{header}</legend>
         <div style={{fontWeight: 600}}>Provider name</div>
         <input onChange={ (event) => this.handleValueChange("name", event)} value={provider.name} style={inputStyle} />
         <div style={{fontWeight: 600}}>sFtp Account</div>
         <input onChange={ (event) => this.handleValueChange("sftpAccount", event)} defaultValue={provider.sftpAccount} style={inputStyle} />
          <div style={{fontWeight: 600}}>Prefix</div>
          <input onChange={ (event) => this.handleValueChange("prefix", event)} defaultValue={provider.chouetteInfo.prefix} style={inputStyle} />
          <div style={{fontWeight: 600}}>Referential</div>
          <input onChange={ (event) => this.handleValueChange("referential", event)} defaultValue={provider.chouetteInfo.referential} style={inputStyle} />
          <div style={{fontWeight: 600}}>Organisation</div>
         <input onChange={ (event) => this.handleValueChange("organisation", event)} defaultValue={provider.chouetteInfo.organisation} style={inputStyle}/>
          <div style={{fontWeight: 600}}>Chouette user</div>
          <input onChange={ (event) => this.handleValueChange("user", event)} defaultValue={provider.chouetteInfo.user} style={inputStyle}  />
          <div style={{fontWeight: 600}}>Regtopp version</div>
          <input onChange={ (event) => this.handleValueChange("regtoppVersion", event)} defaultValue={provider.chouetteInfo.regtoppVersion} style={inputStyle}  />
          <div style={{fontWeight: 600}}>Regtopp coordinate projection</div>
         <input onChange={ (event) => this.handleValueChange("regtoppCoordinateProjection", event)} defaultValue={provider.chouetteInfo.regtoppCoordinateProjection} style={inputStyle} />
          <div style={{fontWeight: 600}}>Date format</div>
          <input onChange={ (event) => this.handleValueChange("dateFormat", event)} style={inputStyle} defaultValue={provider.chouetteInfo.dateFormat} />
          <div style={{fontWeight: 600}}>Regtopp calendar strategy</div>
         <input onChange={ (event) => this.handleValueChange("regtoppCalendarStrategy", event)} defaultValue={provider.chouetteInfo.regtoppCalendarStrategy} style={inputStyle}/>
         <Select style={selectStyle}  label="Provider for data migration" value={defaultMigrationProvider} onChange={this.handleSelectChange}>
           <Option key="option-none" value="option-none" label="None"/>
           { providers.map( (provider) => (<Option key={"option-" + provider.id} value={"option-" + provider.id} label={provider.id + " - " + provider.name} />) ) }
         </Select>
         <Checkbox onChange={ (event) => this.handleValueChange("enableValidation", event)} style={checkboxStyle} name="enableValidation" defaultChecked={provider.chouetteInfo.enableValidation} label="Enable validation" />
         <Button color="primary" style={submitStyle} variant="raised">Submit</Button>
      </div>
     </Form>
    )
  }
}


export default EditSupplierPage
