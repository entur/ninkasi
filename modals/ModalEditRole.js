import React, { Component, PropTypes } from 'react';
import Modal from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

class ModalEditRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: null,
      originalRoleName: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      role: nextProps.role,
      originalRoleName: nextProps.role.name
    });
  }

  render() {
    const { isModalOpen, handleSubmit } = this.props;
    const { role, originalRoleName } = this.state;

    const actions = [
      <FlatButton label="Close" onClick={this.props.handleCloseModal} />,
      <FlatButton label="Update" onClick={() => handleSubmit(role)} />
    ];

    if (!role) return null;

    return (
      <Modal
        actions={actions}
        open={isModalOpen}
        onRequestClose={() => this.props.handleCloseModal()}
        contentStyle={{ width: '30%' }}
        title={'Editing role ' + originalRoleName}
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
                role: {
                  ...role,
                  name: value
                }
              })}
            fullWidth={true}
            style={{ marginTop: -20 }}
          />
          <TextField
            disabled={true}
            defaultValue={role.privateCode}
            hintText="private code"
            floatingLabelText="Private code"
            fullWidth={true}
          />
        </div>
      </Modal>
    );
  }
}

export default ModalEditRole;
