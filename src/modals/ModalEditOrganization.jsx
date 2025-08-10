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
import { FormControl, Select, MenuItem } from '@mui/material';

const initialState = {
  organization: {
    name: '',
    organisationType: 'AUTHORITY',
    privateCode: '',
    codeSpace: '',
  },
  originalName: '',
};

class ModalEditOrganization extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentWillMount() {
    this.setState({
      organization: this.props.organization,
      originalName: this.props.organization.name,
    });
  }

  render() {
    const {
      isModalOpen,
      handleSubmit,
      takenOrganizationNames,
      takenOrganizationPrivateCodes,
      codeSpaces,
      handleCloseModal,
    } = this.props;

    const { organization, originalName } = this.state;

    const isOrganizationNameTaken =
      takenOrganizationNames.indexOf(organization.name) > -1 &&
      this.props.organization.name !== organization.name;

    const isOrganizationPrivateCodeTaken =
      takenOrganizationPrivateCodes.indexOf(organization.privateCode) > -1 &&
      this.props.organization.privateCode !== organization.privateCode;

    const actions = [
      <Button variant="text" onClick={() => handleCloseModal()}>
        Cancel
      </Button>,
      <Button
        variant="text"
        disabled={isOrganizationNameTaken || isOrganizationPrivateCodeTaken}
        onClick={() => handleSubmit(organization)}
      >
        Update
      </Button>,
    ];

    return (
      <Dialog open={isModalOpen} onClose={() => handleCloseModal()} maxWidth="sm" fullWidth>
        <DialogTitle>{'Editing organisation ' + originalName}</DialogTitle>
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
              error={isOrganizationNameTaken}
              helperText={isOrganizationNameTaken ? 'Organization name already exists' : ''}
              value={organization.name}
              onChange={e =>
                this.setState({
                  organization: { ...organization, name: e.target.value },
                })
              }
              fullWidth={true}
            />
            <TextField
              placeholder="Private code"
              label="Private code"
              error={isOrganizationPrivateCodeTaken}
              helperText={
                isOrganizationPrivateCodeTaken ? 'Organization private code already exists' : ''
              }
              value={organization.privateCode}
              disabled={true}
              fullWidth={true}
            />
            <FormControl fullWidth>
              <Select
                value={organization.organisationType}
                onChange={e =>
                  this.setState({
                    organization: {
                      ...organization,
                      organisationType: e.target.value,
                    },
                  })
                }
                displayEmpty
              >
                <MenuItem value="AUTHORITY">AUTHORITY</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <Select value={organization.codeSpace} disabled={true} displayEmpty>
                {codeSpaces.map(codeSpace => (
                  <MenuItem key={codeSpace.id} value={codeSpace.id}>
                    {codeSpace.xmlns}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    );
  }
}

export default ModalEditOrganization;
