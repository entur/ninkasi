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

import { useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import ResponsiblitySetList from './ResponsiblitySetList';
import UserRespSetPopover from './UserRespSetPopover';

interface Client {
  name: string;
  privateCode: string;
  enturOrganisationId: string;
  issuer: string;
  responsibilitySetRefs: string[];
}

interface Responsibility {
  id: string;
  name: string;
}

interface ModalCreateM2MClientProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleSubmit: (client: any) => void;
  takenClientIds: string[];
  responsibilities: Responsibility[];
}

const emptyClient: Client = {
  name: '',
  privateCode: '',
  enturOrganisationId: '',
  issuer: 'Internal',
  responsibilitySetRefs: [],
};

const ModalCreateM2MClient = ({
  isModalOpen,
  handleCloseModal,
  handleSubmit,
  takenClientIds,
  responsibilities,
}: ModalCreateM2MClientProps) => {
  const [client, setClient] = useState<Client>(emptyClient);
  const [isAddingResponsibilitySet, setIsAddingResponsibilitySet] = useState(false);
  const [addRespAnchorEl, setAddRespAnchorEl] = useState<HTMLElement | null>(null);
  const [privateCodeValid, setPrivateCodeValid] = useState(true);
  const [orgIdValid, setOrgIdValid] = useState(true);

  const handleOnClose = () => {
    setClient(emptyClient);
    setIsAddingResponsibilitySet(false);
    setAddRespAnchorEl(null);
    setPrivateCodeValid(true);
    setOrgIdValid(true);
    handleCloseModal();
  };

  const handleChangePrivateCode = (value: string) => {
    const isValid = value.trim().length > 0;
    setClient(prev => ({ ...prev, privateCode: value }));
    setPrivateCodeValid(isValid);
  };

  const handleChangeEnturOrgId = (value: string) => {
    const isValid = /^\d+$/.test(value) || value === '';
    setClient(prev => ({ ...prev, enturOrganisationId: value }));
    setOrgIdValid(isValid);
  };

  const handleAddResponsibilitySet = (respSetId: string) => {
    setIsAddingResponsibilitySet(false);
    setClient(prev => ({
      ...prev,
      responsibilitySetRefs: [...prev.responsibilitySetRefs, respSetId],
    }));
  };

  const isClientRequiredFieldsProvided = () =>
    client.name.trim() !== '' &&
    client.privateCode.trim() !== '' &&
    client.enturOrganisationId.trim() !== '' &&
    client.issuer !== '';

  const removeResponsibilitySet = (index: number) => {
    if (index > -1) {
      setClient(prev => ({
        ...prev,
        responsibilitySetRefs: [
          ...prev.responsibilitySetRefs.slice(0, index),
          ...prev.responsibilitySetRefs.slice(index + 1),
        ],
      }));
    }
  };

  const onSubmit = () => {
    const submissionData = {
      ...client,
      enturOrganisationId: parseInt(client.enturOrganisationId, 10),
    };
    handleSubmit(submissionData);
  };

  const invalidPrivateCode = takenClientIds.indexOf(client.privateCode) > -1;
  const disableCreate =
    invalidPrivateCode || !isClientRequiredFieldsProvided() || !privateCodeValid || !orgIdValid;

  const actions = [
    <Button key="cancel" variant="outlined" onClick={handleOnClose}>
      Cancel
    </Button>,
    <Button
      key="create"
      variant="contained"
      disabled={disableCreate}
      color="primary"
      onClick={onSubmit}
    >
      Create
    </Button>,
  ];

  return (
    <Dialog open={isModalOpen} onClose={handleOnClose} maxWidth="md" fullWidth>
      <DialogTitle>Creating a new M2M Client</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <TextField
            placeholder="Client name"
            label="Client name"
            value={client.name}
            onChange={e => setClient({ ...client, name: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            placeholder="Client id"
            label="Client id"
            value={client.privateCode}
            error={invalidPrivateCode || (!privateCodeValid && !!client.privateCode)}
            helperText={
              invalidPrivateCode
                ? 'Client id already exists'
                : !privateCodeValid && client.privateCode
                  ? 'Client id is required'
                  : ''
            }
            onChange={e => handleChangePrivateCode(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            placeholder="Entur organisation ID"
            label="Entur organisation ID"
            value={client.enturOrganisationId}
            error={!orgIdValid && !!client.enturOrganisationId}
            helperText={!orgIdValid && client.enturOrganisationId ? 'Must be a valid integer' : ''}
            onChange={e => handleChangeEnturOrgId(e.target.value)}
            fullWidth
            margin="normal"
            required
            type="text"
          />
          <FormControl component="fieldset" margin="normal" required>
            <FormLabel component="legend">Issuer</FormLabel>
            <RadioGroup
              value={client.issuer}
              onChange={e => setClient({ ...client, issuer: e.target.value })}
            >
              <FormControlLabel value="Internal" control={<Radio />} label="Internal" />
              <FormControlLabel value="Partner" control={<Radio />} label="Partner" />
            </RadioGroup>
          </FormControl>
          <UserRespSetPopover
            responsibilities={responsibilities}
            addedRespSets={client.responsibilitySetRefs}
            anchorEl={addRespAnchorEl}
            handleAdd={handleAddResponsibilitySet}
            handleClose={() => setIsAddingResponsibilitySet(false)}
            open={isAddingResponsibilitySet}
          />
          <ResponsiblitySetList
            user={client}
            responsiblities={responsibilities}
            handleAdd={e => {
              setIsAddingResponsibilitySet(true);
              setAddRespAnchorEl(e.currentTarget);
            }}
            handleRemove={removeResponsibilitySet}
          />
        </Box>
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default ModalCreateM2MClient;
