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
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import ResponsiblitySetList from './ResponsiblitySetList';
import UserRespSetPopover from './UserRespSetPopover';

const initialState = {
  client: {
    name: '',
    privateCode: '',
    enturOrganisationId: '',
    issuer: 'Internal',
    responsibilitySetRefs: [],
  },
  isAddingResponsibilitySet: false,
  temptResponsibilitySet: '',
  addRespAnchorEl: null,
  privateCodeValid: true,
  orgIdValid: true,
};

class ModalCreateM2MClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleOnClose() {
    this.setState(initialState);
    this.props.handleCloseModal();
  }

  handleChangePrivateCode(e, value) {
    const isValid = value.trim().length > 0;
    this.setState(prevState => ({
      client: { ...prevState.client, privateCode: value },
      privateCodeValid: isValid,
    }));
  }

  handleChangeEnturOrgId(e, value) {
    const isValid = /^\d+$/.test(value) || value === '';
    this.setState(prevState => ({
      client: { ...prevState.client, enturOrganisationId: value },
      orgIdValid: isValid,
    }));
  }

  handleAddResponsibilitySet(temptResponsibilitySet) {
    const { client } = this.state;
    this.setState({
      isAddingResponsibilitySet: false,
      client: {
        ...client,
        responsibilitySetRefs: [...client.responsibilitySetRefs, temptResponsibilitySet],
      },
      temptResponsibilitySet: '',
    });
  }

  isClientRequiredFieldsProvided() {
    const { client } = this.state;
    return (
      client.name.trim() !== '' &&
      client.privateCode.trim() !== '' &&
      client.enturOrganisationId.trim() !== '' &&
      client.issuer !== ''
    );
  }

  removeResponsibilitySet(index) {
    if (index > -1) {
      this.setState({
        client: {
          ...this.state.client,
          responsibilitySetRefs: [
            ...this.state.client.responsibilitySetRefs.slice(0, index),
            ...this.state.client.responsibilitySetRefs.slice(index + 1),
          ],
        },
      });
    }
  }

  handleSubmit() {
    const { client } = this.state;
    // Convert enturOrganisationId to integer
    const submissionData = {
      ...client,
      enturOrganisationId: parseInt(client.enturOrganisationId, 10),
    };
    this.props.handleSubmit(submissionData);
  }

  render() {
    const { isModalOpen, takenClientIds, responsibilities } = this.props;
    const { client, isAddingResponsibilitySet, privateCodeValid, orgIdValid } = this.state;

    const invalidPrivateCode = takenClientIds.indexOf(client.privateCode) > -1;
    const disableCreate =
      invalidPrivateCode ||
      !this.isClientRequiredFieldsProvided() ||
      !privateCodeValid ||
      !orgIdValid;

    const actions = [
      <Button key="cancel" variant="text" onClick={() => this.handleOnClose()}>
        Cancel
      </Button>,
      <Button
        key="create"
        variant="text"
        disabled={disableCreate}
        color="primary"
        onClick={() => this.handleSubmit()}
      >
        Create
      </Button>,
    ];

    return (
      <Dialog open={isModalOpen} onClose={() => this.handleOnClose()} maxWidth="md" fullWidth>
        <DialogTitle>Creating a new M2M Client</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TextField
              placeholder="Client name"
              label="Client name"
              value={client.name}
              onChange={e =>
                this.setState({
                  client: { ...client, name: e.target.value },
                })
              }
              fullWidth={true}
              margin="normal"
              required
            />
            <TextField
              placeholder="Client id"
              label="Client id"
              value={client.privateCode}
              error={invalidPrivateCode || (!privateCodeValid && client.privateCode)}
              helperText={
                invalidPrivateCode
                  ? 'Client id already exists'
                  : !privateCodeValid && client.privateCode
                    ? 'Client id is required'
                    : ''
              }
              onChange={e => this.handleChangePrivateCode(e, e.target.value)}
              fullWidth={true}
              margin="normal"
              required
            />
            <TextField
              placeholder="Entur organisation ID"
              label="Entur organisation ID"
              value={client.enturOrganisationId}
              error={!orgIdValid && client.enturOrganisationId}
              helperText={
                !orgIdValid && client.enturOrganisationId ? 'Must be a valid integer' : ''
              }
              onChange={e => this.handleChangeEnturOrgId(e, e.target.value)}
              fullWidth={true}
              margin="normal"
              required
              type="text"
            />
            <FormControl component="fieldset" margin="normal" required>
              <FormLabel component="legend">Issuer</FormLabel>
              <RadioGroup
                value={client.issuer}
                onChange={e =>
                  this.setState({
                    client: { ...client, issuer: e.target.value },
                  })
                }
              >
                <FormControlLabel value="Internal" control={<Radio />} label="Internal" />
                <FormControlLabel value="Partner" control={<Radio />} label="Partner" />
              </RadioGroup>
            </FormControl>
            <UserRespSetPopover
              responsibilities={responsibilities}
              addedRespSets={this.state.client.responsibilitySetRefs}
              anchorEl={this.state.addRespAnchorEl}
              handleAdd={this.handleAddResponsibilitySet.bind(this)}
              handleClose={() => this.setState({ isAddingResponsibilitySet: false })}
              open={isAddingResponsibilitySet}
            />
            <ResponsiblitySetList
              user={client}
              responsiblities={responsibilities}
              handleAdd={e =>
                this.setState({
                  isAddingResponsibilitySet: true,
                  addRespAnchorEl: e.currentTarget,
                })
              }
              handleRemove={this.removeResponsibilitySet.bind(this)}
            />
          </div>
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    );
  }
}

export default ModalCreateM2MClient;
