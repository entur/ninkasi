import React from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Actions from '../actions/OrganizationRegisterActions';
import Clipboard from 'clipboard-js';

class ModalNewPassword extends React.Component {
  handleClose() {
    this.props.dispatch(Actions.closePasswordDialog());
  }

  handleCopyToClipBoard(password) {
    Clipboard.copy(password);
  }

  render() {
    const { open, password, username, isNewUser } = this.props.passwordDialogState;

    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.handleClose.bind(this)}
      />
    ];

    return (
      <Dialog
        title={isNewUser ? 'User created' : 'Password reset'}
        actions={actions}
        modal={true}
        open={open}
      >
        <div style={{ fontWeight: 600 }}>
          The new temporary password for {username} is:
        </div>
        <div
          style={{
            background: 'orange',
            display: 'flex',
            textAlign: 'center',
            padding: 2,
            color: '#fff',
            alignItems: 'center',
            border: '1px solid black'
          }}
        >
          <div id="new-password" style={{ flex: 10, fontSize: 18 }}>{password}</div>
          <FlatButton
            style={{ marginRight: 5, flex: 1 }}
            label="Copy"
            labelStyle={{ color: '#fff' }}
            onClick={() => this.handleCopyToClipBoard(password)}
          />
        </div>
        <div style={{ fontSize: 12, marginTop: 5 }}>
          NB. This is only a temporary password, and the user must create its own password upon initial login.
        </div>
        <div style={{ fontSize: 12, marginTop: 10 }}>
          An e-mail notificating this user about the change is sent.
        </div>
      </Dialog>
    );
  }
}

export default connect(null)(ModalNewPassword);
