import React, { Component, PropTypes } from 'react'
import Modal from './Modal'
import TextField from 'material-ui/TextField'

class ModalEditRole extends React.Component {

  render() {

    const { isModalOpen } = this.props


    const titleStyle = {
      fontSize: '2em',
      fontWeight: 600,
      margin: '10px auto',
      width: '80%',
    }

    return (
        <Modal isOpen={isModalOpen} onClose={() => this.props.handleCloseModal()}>
          <div>
            <div style={titleStyle}>Creating a new role</div>
            <div>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%', margin: '20px auto'}}>
                <TextField
                  hintText="Name"
                  fullWidth={true}
                  style={{marginBottom: 20}}
                />
                <TextField
                  hintText="private code"
                  fullWidth={true}
                />
              </div>
            </div>
          </div>
        </Modal>
    )
  }

}


export default ModalEditRole
