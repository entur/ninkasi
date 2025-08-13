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
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

class ModalEditRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: props.role || null,
      originalRoleName: props.role ? props.role.name : '',
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.role && this.props.role !== prevProps.role) {
      this.setState({
        role: this.props.role,
        originalRoleName: this.props.role.name,
      });
    }
  }

  render() {
    const { isModalOpen, handleSubmit } = this.props;
    const { role, originalRoleName } = this.state;

    const isSavable = role && role.name && role.name.length > 0;

    const actions = [
      <Button variant="text" onClick={this.props.handleCloseModal}>
        Close
      </Button>,
      <Button variant="text" disabled={!isSavable} onClick={() => handleSubmit(role)}>
        Update
      </Button>,
    ];

    if (!role) return null;

    return (
      <Dialog
        open={isModalOpen}
        onClose={() => this.props.handleCloseModal()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{'Editing role ' + originalRoleName}</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <TextField
              placeholder="Name"
              label="Name"
              value={role.name}
              onChange={e =>
                this.setState({
                  role: {
                    ...role,
                    name: e.target.value,
                  },
                })
              }
              fullWidth={true}
              margin="normal"
              required
            />
            <TextField
              disabled={true}
              value={role.privateCode}
              placeholder="Private code"
              label="Private code"
              fullWidth={true}
              margin="normal"
            />
          </div>
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    );
  }
}

export default ModalEditRole;
