import React from 'react'
import Modal from './Modal'
import TextField from 'material-ui/TextField'
import MdClose from 'material-ui/svg-icons/navigation/close'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import MdRemove from 'material-ui/svg-icons/content/remove'
import MdAdd from 'material-ui/svg-icons/content/add'
import IconButton from 'material-ui/IconButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { connect } from 'react-redux'
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions'

class ModalCreateResponsibilitySet extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isCreatingNewRole: false,
      responsibilitySet: {
        name: '',
        codeSpace: '',
        privateCode: '',
        roles: [],
      },
      newRole: {
        typeOfResponsibilityRoleRef: '',
        responsibleOrganisationRef: '',
        entityClassificationRefs: []
      },
      tempEntityClassification: '',
      tempEntityType: '',
      tempEntityTypes: [],
    }
  }

  getEntityClassificationsForType(entityType) {
    OrganizationRegisterActions.getEntityByClassification(entityType)
      .then( response => {
        this.setState({
          tempEntityClassification: entityType,
          tempEntityTypes: response.data
        })
      })
  }

  getRoleString(role) {
      return `ORG=${role.responsibleOrganisationRef}, type=${role.responsibleOrganisationRef}, entities=${role.entityClassificationRefs.join(',')}`;
  }

  handleAddRole() {
    const { newRole } = this.state
    this.setState({
      ...this.state,
      newRole: {
        typeOfResponsibilityRoleRef: '',
        responsibleOrganisationRef: '',
        entityClassificationRefs: []
      },
      tempEntityClassification: '',
      tempEntityType: '',
      tempEntityTypes: [],
      responsibilitySet: {
        ...this.state.responsibilitySet,
        roles: [...this.state.responsibilitySet.roles, newRole],
      },
      isCreatingNewRole: false
    })
  }

  handleRemoveRole() {
    const { roles } = this.refs
    const index = roles.options.selectedIndex

    if (index > -1) {
      this.setState({
        responsibilitySet: {
          ...this.state.responsibilitySet,
          roles: [
            ...this.state.responsibilitySet.roles.slice(0, index),
            ...this.state.responsibilitySet.roles.slice(index + 1)
          ]
        }
      })
    }
  }

  isSavable() {
    const { responsibilitySet } = this.state
    return (responsibilitySet.name.length && responsibilitySet.codeSpace.length
              && responsibilitySet.privateCode.length && responsibilitySet.roles.length > 0)
  }

  render() {

    const titleStyle = {
      fontSize: '2em',
      fontWeight: 600,
      margin: '10px auto',
      width: '80%',
    }

    const { isModalOpen, handleOnClose, codeSpaces, takenPrivateCodes, roles, organizations, handleSubmit, entityTypes } = this.props
    const { isCreatingNewRole, responsibilitySet, newRole, tempEntityClassification, tempEntityType } = this.state
    const isLegalPrivateCode = takenPrivateCodes.indexOf(responsibilitySet.privateCode) == -1

    const isSavable = (this.isSavable() && isLegalPrivateCode)

    return (
      <Modal isOpen={isModalOpen} onClose={() => handleOnClose()} minWidth="50vw" minHeight="auto">
        <div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={titleStyle}>Creating a new responsibility set</div>
            <MdClose style={{marginRight: 10, cursor: 'pointer'}} onClick={() => handleOnClose()}/>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90%', marginTop: 5}}>
              <TextField
                floatingLabelText="Name"
                hintText="Name"
                value={responsibilitySet.name}
                fullWidth={true}
                onChange={ (e, value) => { this.setState({responsibilitySet: {
                  ...this.state.responsibilitySet,
                  name: value
                }})}}
                style={{marginTop: -20}}
              />
              <SelectField
                hintText="Code space"
                floatingLabelText="Code space"
                value={responsibilitySet.codeSpace}
                onChange={ (e, index, value) => { this.setState({responsibilitySet: {
                  ...this.state.responsibilitySet,
                  codeSpace: value
                }})}}
                fullWidth={true}
                style={{marginTop: -10}}
              >
                { codeSpaces.map( codeSpace => (
                  <MenuItem key={codeSpace.id} id={codeSpace.id} value={codeSpace.id} label={codeSpace.id} primaryText={codeSpace.xmlns} />
                ))}
              </SelectField>
              <TextField
                hintText="Private code"
                floatingLabelText="Private code"
                value={responsibilitySet.privateCode}
                errorText={isLegalPrivateCode ? '' : 'This private code is already taken!'}
                fullWidth={true}
                onChange={ (e, value) => { this.setState({responsibilitySet: {
                  ...this.state.responsibilitySet,
                  privateCode: value
                }})}}
                errorStyle={{float: 'right'}}
                style={{marginBottom: 10, marginTop: -10}}
              />
              <div style={{width: '100%', fontSize: 10}}>
                <div style={{width: '100%', fontSize: 10}}>Responsibility roles *</div>
                <select multiple="multiple" style={{width: '100%', fontSize: 10}} ref="roles">
                  { responsibilitySet.roles.map( (role,i) => (
                      <option key={"role-" + i}>{ this.getRoleString(role)}</option>
                  ))}
                </select>
                <div>
                  <IconButton
                    onClick={() => this.setState({isCreatingNewRole: true})}
                  >
                    <MdAdd color="#228B22"/>
                  </IconButton>
                  <IconButton
                    onClick={this.handleRemoveRole.bind(this)}
                  >
                    <MdRemove color="#cc0000"/>
                  </IconButton>
                </div>
                { isCreatingNewRole ?
                  <div style={{border: '1px dotted'}}>
                    <div style={{fontSize: 12, textAlign: 'center', fontWeight: 600}}>New role</div>
                    <SelectField
                      hintText="Role type"
                      floatingLabelText="Role type"
                      value={newRole.typeOfResponsibilityRoleRef}
                      onChange={ (e, index, value) => this.setState({
                        ...this.state,
                        newRole: {
                          ...newRole,
                          typeOfResponsibilityRoleRef: value
                        }
                      })}
                      fullWidth={true}
                    >
                      { roles.map( role => (
                        <MenuItem key={role.id} id={role.id} value={role.id} label={role.id} primaryText={role.name} />
                      ))}
                    </SelectField>
                    <SelectField
                      hintText="Organization"
                      floatingLabelText="Organization"
                      value={newRole.responsibleOrganisationRef}
                      onChange={ (e, index, value) => this.setState({
                        ...this.state,
                        newRole: {
                          ...newRole,
                          responsibleOrganisationRef: value
                        }
                      })}
                      fullWidth={true}
                    >
                      { organizations.map( org => (
                        <MenuItem key={org.id} id={org.id} value={org.id} label={org.id} primaryText={org.name} />
                      ))}
                    </SelectField>
                    <div style={{width: '100%', fontSize: 12}}>Entity classification</div>
                    <select multiple="multiple" style={{width: '100%', fontSize: 12}}>
                      { newRole.entityClassificationRefs.map( (ref, index) => (
                          <option key={'entity-' + index}>{ ref} </option> ))
                      } 
                    </select>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                      <SelectField
                        hintText="Classification"
                        floatingLabelText="Classification"
                        value={tempEntityClassification}
                        onChange={ (e, i, v) => this.getEntityClassificationsForType(v)}
                        fullWidth={true}
                      >
                        { entityTypes.map( entity => (
                          <MenuItem key={entity.id} id={entity.id} value={entity.id} label={entity.name} primaryText={entity.name} />
                        ))}
                      </SelectField>
                      <SelectField
                        hintText="Type"
                        floatingLabelText="Type"
                        value={tempEntityType}
                        onChange={ (e, i, v) => this.setState({tempEntityType: v})}
                        fullWidth={true}
                      >
                        { this.state.tempEntityTypes.map( type => (
                          <MenuItem key={type.id} id={type.id} value={type.id} label={type.name} primaryText={type.name} />
                        ))}
                      </SelectField>
                      <FlatButton
                        label="Add"
                        disabled={!tempEntityClassification.length}
                        onClick={ () => this.setState({
                          newRole: {
                          ...newRole,
                          entityClassificationRefs: [...newRole.entityClassificationRefs, tempEntityType]
                          },
                          tempEntityClassification: '',
                          tempEntityType: '',
                        })}
                      />
                    </div>
                    <RaisedButton
                      label="Add role"
                      primary={true}
                      disabled={!newRole.typeOfResponsibilityRoleRef.length || !newRole.responsibleOrganisationRef.length}
                      style={{display: 'block'}}
                      onClick={this.handleAddRole.bind(this)}
                    />
                  </div>

                  : null
                }
              </div>
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginRight: 15}}>
            <div style={{fontSize: 12, marginLeft: 15}}></div>
            <RaisedButton
              disabled={!isSavable}
              label="Create"
              primary={true}
              onClick={() => handleSubmit(this.state.responsibilitySet)}
            />
          </div>
        </div>
      </Modal>
    )
  }

}

export default connect(null)(ModalCreateResponsibilitySet)