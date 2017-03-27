import React, { Component, PropTypes } from 'react'
import Modal from './Modal'
import TextField from 'material-ui/TextField'
import MdClose from 'material-ui/svg-icons/navigation/close'
import RaisedButton from 'material-ui/RaisedButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

const initialState = {
  organization: {
    name: '',
    organisationType: 'AUTHORITY',
    privateCode: '',
    codeSpace: '',
  }
}

class ModalEditOrganization extends React.Component {

  constructor(props) {
    super(props)
    this.state = initialState
  }


  handleOnClose() {
    this.props.handleCloseModal()
  }


  componentWillMount() {
    this.setState({
      organization: this.props.organization
    })
  }

  render() {

    const { isModalOpen, handleSubmit, takenOrganizationNames, takenOrganizationPrivateCodes, codeSpaces } = this.props

    const { organization } = this.state

    const titleStyle = {
      fontSize: '1.8em',
      fontWeight: 600,
      margin: '10px auto',
      width: '80%',
    }

    const isOrganizationNameTaken =
      (takenOrganizationNames.indexOf(organization.name) > -1
      && this.props.organization.name !== organization.name)

    const isOrganizationPrivateCodeTaken = (takenOrganizationPrivateCodes.indexOf(organization.privateCode) > -1
          && this.props.organization.privateCode !== organization.privateCode)

    return (
        <Modal isOpen={isModalOpen} onClose={() => this.handleOnClose()} minWidth="35vw" minHeight="auto">
          <div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={titleStyle}>Editing organization</div>
              <MdClose style={{marginRight: 10, cursor: 'pointer'}} onClick={() => this.handleOnClose()}/>
            </div>
            <div style={{fontSize: '1.1em', textAlign: 'center'}}> { organization.id } </div>
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%', marginTop: '20px'}}>
                <TextField
                  hintText="Name"
                  floatingLabelText="Name"
                  errorText={isOrganizationNameTaken ? 'Organization name already exists' : ''}
                  value={organization.name}
                  onChange={ (e, value) => this.setState({
                    organization: { ...organization, name: value }
                  })}
                  fullWidth={true}
                  style={{marginBottom: 20}}
                />
                <TextField
                  hintText="Private code"
                  floatingLabelText="Private code"
                  errorText={isOrganizationPrivateCodeTaken ? 'Organization private code already exists' : ''}
                  value={organization.privateCode}
                  disabled={true}
                  fullWidth={true}
                  style={{marginBottom: 20}}
                />
                <SelectField
                  hintText="Organization type"
                  floatingLabelText="Organization type"
                  value={organization.organisationType}
                  onChange={ (e, index, value) => this.setState({
                    organization: { ...organization, organisationType: value }
                  })}
                  fullWidth={true}
                  style={{marginBottom: 20}}
                >
                  <MenuItem id="menuItem" value="AUTHORITY" label="AUTHORITY" primaryText="AUTHORITY" />
                </SelectField>
                <SelectField
                  hintText="Code space"
                  floatingLabelText="Code space"
                  value={organization.codeSpace}
                  disabled={true}
                  fullWidth={true}
                  style={{marginBottom: 20}}
                >
                  { codeSpaces.map( codeSpace => (
                     <MenuItem key={codeSpace.id} id={codeSpace.id} value={codeSpace.id} label={codeSpace.id} primaryText={codeSpace.xmlns} />
                  ))}
                </SelectField>
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginRight: 15}}>
              <div style={{fontSize: 12, marginLeft: 15}}></div>
              <RaisedButton
                disabled={isOrganizationNameTaken || isOrganizationPrivateCodeTaken}
                label="Update" primary={true}
                onClick={ () => handleSubmit(organization)}
              />
            </div>
          </div>
        </Modal>
    )
  }

}


export default ModalEditOrganization
