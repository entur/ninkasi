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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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

  handleOnClose() {
    this.setState(initialState);
    this.props.handleCloseModal();
  }

  render() {
    const { isModalOpen, handleSubmit, takenPrivateCodes } = this.props;

    const { role } = this.state;

    const invalidPrivateCode = takenPrivateCodes.indexOf(role.privateCode) > -1;

    const actions = [
      <Button
        variant="text"
        disabled={invalidPrivateCode}
        onClick={this.handleOnClose.bind(this)}
      >
        Close
      </Button>,
      <Button
        variant="text"
        disabled={invalidPrivateCode}
        onClick={() => handleSubmit(role)}
      >
        Create
      </Button>
    ];

    return (
      <Dialog
        open={isModalOpen}
        onClose={() => this.handleOnClose()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create a new role</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <TextField
              placeholder="Name"
              label="Name"
              value={role.name}
              onChange={e =>
                this.setState({
                  role: { ...role, name: e.target.value }
                })
              }
              fullWidth={true}
            />
            <TextField
              placeholder="private code"
              label="Private code"
              error={invalidPrivateCode}
              helperText={
                invalidPrivateCode ? 'Private code already exists' : ''
              }
              value={role.privateCode}
              onChange={e =>
                this.setState({
                  role: { ...role, privateCode: e.target.value }
                })
              }
              fullWidth={true}
            />
          </div>
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    );
  }
}

export default ModalCreateRole;
