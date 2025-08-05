/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import Button from '@mui/material/Button';
import Actions from 'actions/OrganizationRegisterActions';
import Clipboard from 'clipboard-js';

class ModalNewPassword extends React.Component {
  handleClose() {
    this.props.dispatch(Actions.closePasswordDialog());
  }

  handleCopyToClipBoard(password) {
    Clipboard.copy(password);
  }

  render() {
    const { open, isNewUser } = this.props.passwordDialogState;

    const actions = [
      <Button
        variant="text"
        color="primary"
        onClick={this.handleClose.bind(this)}
      >
        Close
      </Button>
    ];

    return (
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isNewUser ? 'User created' : 'Password reset'}
        </DialogTitle>
        <DialogContent>
          <div style={{ fontSize: 12, marginTop: 5 }}>
            An email has been sent to the user with further instructions.
          </div>
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    );
  }
}

export default connect(null)(ModalNewPassword);
