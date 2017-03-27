import React, { Component, PropTypes } from 'react'
import Modal from './Modal'
import TextField from 'material-ui/TextField'
import MdClose from 'material-ui/svg-icons/navigation/close'
import RaisedButton from 'material-ui/RaisedButton'

const initialState = {
  role: {
    name: '',
    privateCode: ''
  }
}

class ModalCreateRole extends React.Component {

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

  render() {

    const { isModalOpen, handleSubmit, takenPrivateCodes } = this.props

    const { role } = this.state

    const titleStyle = {
      fontSize: '2em',
      fontWeight: 600,
      margin: '10px auto',
      width: '80%',
    }

    const invalidPrivateCode = takenPrivateCodes.indexOf(role.privateCode) > -1

    return (
        <Modal isOpen={isModalOpen} onClose={() => this.handleOnClose()} minWidth="35vw" minHeight="auto">
          <div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={titleStyle}>Creating a new role</div>
              <MdClose style={{marginRight: 10, cursor: 'pointer'}} onClick={() => this.handleOnClose()}/>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%', marginTop: '20px'}}>
                <TextField
                  hintText="Name"
                  floatingLabelText="Name"
                  value={role.name}
                  onChange={ (e, value) => this.setState({
                    role: { ...role, name: value }
                  })}
                  fullWidth={true}
                  style={{marginBottom: 20}}
                />
                <TextField
                  hintText="private code"
                  floatingLabelText="Private code"
                  errorText={invalidPrivateCode ? 'Private code already exists' : ''}
                  value={role.privateCode}
                  onChange={ (e, value) => this.setState({
                    role: { ...role, privateCode: value }
                  })}
                  fullWidth={true}
                />
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginRight: 15}}>
              <div style={{fontSize: 12, marginLeft: 15}}></div>
              <RaisedButton disabled={invalidPrivateCode} label="Create" primary={true} onClick={ () => handleSubmit(role)} />
            </div>
          </div>
        </Modal>
    )
  }

}


export default ModalCreateRole
