import React, { Component, PropTypes } from 'react';
import Modal from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const initialState = {
  role: {
    name: '',
    privateCode: ''
  }
};

class ModalCreateRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentWillUnmount() {
    this.state = initialState;
  }

  handleOnClose() {
    this.setState(initialState);
    this.props.handleCloseModal();
  }

  render() {
    const { isModalOpen, handleSubmit, takenPrivateCodes } = this.props;

    const { role } = this.state;

    const titleStyle = {
      fontSize: '2em',
      fontWeight: 600,
      margin: '10px auto',
      width: '80%'
    };

    const invalidPrivateCode = takenPrivateCodes.indexOf(role.privateCode) > -1;

    const actions = [
      <FlatButton
        disabled={invalidPrivateCode}
        label="Close"
        onClick={this.handleOnClose.bind(this)}
      />,
      <FlatButton
        disabled={invalidPrivateCode}
        label="Create"
        onClick={() => handleSubmit(role)}
      />
    ];

    return (
      <Modal
        open={isModalOpen}
        actions={actions}
        contentStyle={{ width: '30%' }}
        title="Create a new role"
        onRequestClose={() => this.handleOnClose()}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <TextField
            hintText="Name"
            floatingLabelText="Name"
            value={role.name}
            onChange={(e, value) =>
              this.setState({
                role: { ...role, name: value }
              })}
            fullWidth={true}
          />
          <TextField
            hintText="private code"
            floatingLabelText="Private code"
            errorText={invalidPrivateCode ? 'Private code already exists' : ''}
            value={role.privateCode}
            onChange={(e, value) =>
              this.setState({
                role: { ...role, privateCode: value }
              })}
            fullWidth={true}
          />
        </div>
      </Modal>
    );
  }
}

export default ModalCreateRole;
