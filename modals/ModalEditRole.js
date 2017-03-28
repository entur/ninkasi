import React, { Component, PropTypes } from 'react'
import Modal from './Modal'
import TextField from 'material-ui/TextField'
import MdClose from 'material-ui/svg-icons/navigation/close'
import RaisedButton from 'material-ui/RaisedButton'

class ModalEditRole extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      role: null
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      role: nextProps.role
    })
  }

  render() {

    const { isModalOpen, handleSubmit } = this.props
    const { role } = this.state

    const titleStyle = {
      fontSize: '2em',
      fontWeight: 600,
      margin: '10px auto',
      width: '80%',
    }

    if (!role) return null

    return (
        <Modal isOpen={isModalOpen} onClose={() => this.props.handleCloseModal()} minWidth="35vw" minHeight="auto">
          <div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={titleStyle}>Editing role</div>
              <MdClose style={{marginRight: 10, cursor: 'pointer'}} onClick={() => this.props.handleCloseModal()}/>
            </div>
            <div style={{fontSize: '1.1em', textAlign: 'center'}}> { role.privateCode } </div>
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%', marginTop: '20px'}}>
                <TextField
                  hintText="Name"
                  floatingLabelText="Name"
                  value={role.name}
                  onChange={ (e, value) => this.setState({role: {
                    ...role,
                    name: value
                  }})}
                  fullWidth={true}
                  style={{marginTop: -20}}
                />
                <TextField
                  disabled={true}
                  defaultValue={role.privateCode}
                  hintText="private code"
                  floatingLabelText="Private code"
                  fullWidth={true}
                />
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginRight: 15}}>
              <div style={{fontSize: 12, marginLeft: 15}}></div>
              <RaisedButton label="Update" primary={true} onClick={() => handleSubmit(role) }/>
            </div>
          </div>
        </Modal>
    )
  }

}


export default ModalEditRole
