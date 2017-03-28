import React, { Component, PropTypes } from 'react'
import Modal from './Modal'
import TextField from 'material-ui/TextField'
import MdClose from 'material-ui/svg-icons/navigation/close'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import MdRemove from 'material-ui/svg-icons/content/remove'
import MdAdd from 'material-ui/svg-icons/content/add'
import IconButton from 'material-ui/IconButton'

const initialState = {
  user: {
    username: '',
    organisationRef: '',
    responsibilitySetRefs: [],
    contactDetails: {
      email: '',
      phone: '',
      firstName: '',
      lastName: '',
    }
  },
  isAddingResponsibilitySet: false,
  temptResponsibilitySet: '',
}

class ModalEditUser extends React.Component {

  constructor(props) {
    super(props)
    this.state = initialState
  }

  componentWillUnmount() {
    this.state = initialState
  }


  handleOnClose() {
    this.setState(initialState)
    this.props.handleCloseModal()
  }

  componentDidMount() {
    this.setState({
      user: {
        ...this.state.user,
        ...this.props.user
      }
    })
  }

  handleAddResponsibilitySet() {
    const { user, temptResponsibilitySet } = this.state
    this.setState({
      ...this.state,
      isAddingResponsibilitySet: false,
      user: {
        ...user,
        responsibilitySetRefs: [...user.responsibilitySetRefs, temptResponsibilitySet],
      },
      temptResponsibilitySet: '',
    })
  }

  handleRemoveResponsibilitySet() {
    const { responsibilitySets } = this.refs
    const index = responsibilitySets.options.selectedIndex

    if (index > -1) {
      this.setState({
        user: {
          ...this.state.user,
          responsibilitySetRefs: [
            ...this.state.user.responsibilitySetRefs.slice(0, index),
            ...this.state.user.responsibilitySetRefs.slice(index + 1)
          ]
        }
      })
    }
  }

  render() {

    const { isModalOpen, handleSubmit, organizations, responsibilities } = this.props

    const { user, isAddingResponsibilitySet, temptResponsibilitySet } = this.state

    const titleStyle = {
      fontSize: '2em',
      fontWeight: 600,
      margin: '10px auto',
      width: '80%',
    }

    return (
      <Modal isOpen={isModalOpen} onClose={() => this.handleOnClose()} minWidth="35vw" minHeight="auto">
        <div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={titleStyle}>Updating user</div>
            <MdClose style={{marginRight: 10, cursor: 'pointer'}} onClick={() => this.handleOnClose()}/>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%', marginTop: '20px'}}>
              <TextField
                hintText="Username"
                floatingLabelText="Username"
                disabled={true}
                value={user.username}
                onChange={ (e, value) => this.setState({
                  user: { ...user, username: value }
                })}
                fullWidth={true}
                style={{marginTop: -25}}
              />
              <TextField
                hintText="First name"
                floatingLabelText="First name"
                value={user.contactDetails.firstName}
                onChange={ (e, value) => this.setState({
                  user: { ...user, contactDetails: {
                    ...user.contactDetails, firstName: value
                  }}
                })}
                fullWidth={true}
                style={{marginTop: -25}}
              />
              <TextField
                hintText="Last name"
                floatingLabelText="Last name"
                value={user.contactDetails.lastName}
                onChange={ (e, value) => this.setState({
                  user: { ...user, contactDetails: {
                    ...user.contactDetails, lastName: value
                  }}
                })}
                fullWidth={true}
                style={{marginTop: -25}}
              />
              <TextField
                hintText="E-mail"
                floatingLabelText="E-mail"
                value={user.contactDetails.email}
                onChange={ (e, value) => this.setState({
                  user: { ...user, contactDetails: {
                    ...user.contactDetails, email: value
                  }}
                })}
                fullWidth={true}
                style={{marginTop: -25}}
              />
              <TextField
                hintText="Phonenumber"
                floatingLabelText="Phonenumber"
                value={user.contactDetails.phone}
                onChange={ (e, value) => this.setState({
                  user: { ...user, contactDetails: {
                    ...user.contactDetails, phone: value
                  }}
                })}
                fullWidth={true}
                style={{marginTop: -25}}
              />
              <SelectField
                hintText="Organization"
                floatingLabelText="Organization"
                value={user.organisationRef}
                onChange={ (e, index, value) => this.setState({
                  user: { ...user, organisationRef: value }
                })}
                fullWidth={true}
                style={{marginTop: -10}}
              >
                { organizations.map( org => (
                  <MenuItem key={org.id} id={org.id} value={org.id} label={org.id} primaryText={org.name} />
                ))}
              </SelectField>
              <div style={{width: '100%', fontSize: 12}}>Responsibility sets</div>
              <select multiple="multiple" style={{width: '100%', fontSize: 12}} ref="responsibilitySets">
                { user.responsibilitySetRefs.map( (rs, index) => (
                  <option key={'ec-' + index}>{ rs } </option> ))
                }
              </select>
              <div style={{textAlign: 'left', width: '100%'}}>
                <IconButton
                  onClick={() => this.setState({isAddingResponsibilitySet: true})}
                >
                  <MdAdd color="#228B22"/>
                </IconButton>
                <IconButton
                  onClick={this.handleRemoveResponsibilitySet.bind(this)}
                >
                  <MdRemove color="#cc0000"/>
                </IconButton>
              </div>
              { isAddingResponsibilitySet
                ? <div style={{border: '1px dotted', width: '100%'}}>
                  <div style={{fontSize: 12, textAlign: 'center', fontWeight: 600}}>New responsibility set</div>
                  <SelectField
                    hintText="Responsibility set"
                    floatingLabelText="Responsibility set"
                    value={temptResponsibilitySet}
                    onChange={ (e, index, value) => this.setState({
                      temptResponsibilitySet: value
                    })}
                    fullWidth={true}
                    style={{marginTop: -10}}
                  >
                    { responsibilities.filter(r => r.id).map( r => (
                      <MenuItem key={r.id} id={r.id} value={r.id} label={r.id} primaryText={r.name} />
                    ))}
                  </SelectField>
                  <FlatButton
                    label="Add"
                    style={{width: '100%'}}
                    onClick={this.handleAddResponsibilitySet.bind(this)}
                  />
                </div>
                : null
              }
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginRight: 15}}>
            <div style={{fontSize: 12, marginLeft: 15}}></div>
            <RaisedButton label="Update" primary={true} onClick={ () => handleSubmit(user)} />
          </div>
        </div>
      </Modal>
    )
  }

}


export default ModalEditUser
