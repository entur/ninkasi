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

import { useEffect, useState } from 'react';
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

interface IncomingClient {
  name?: string;
  privateCode?: string;
  enturOrganisationId?: number | string;
  issuer?: string;
  responsibilitySetRefs?: string[];
}

interface Responsibility {
  id: string;
  name: string;
}

interface ModalEditM2MClientProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleSubmit: (client: any) => void;
  client: IncomingClient;
  responsibilities: Responsibility[];
}

const emptyClient: Client = {
  name: '',
  privateCode: '',
  enturOrganisationId: '',
  issuer: 'Internal',
  responsibilitySetRefs: [],
};

const ModalEditM2MClient = ({
  isModalOpen,
  handleCloseModal,
  handleSubmit,
  client: clientProp,
  responsibilities,
}: ModalEditM2MClientProps) => {
  const [client, setClient] = useState<Client>(emptyClient);
  const [isAddingResponsibilitySet, setIsAddingResponsibilitySet] = useState(false);
  const [addRespAnchorEl, setAddRespAnchorEl] = useState<HTMLElement | null>(null);
  const [orgIdValid, setOrgIdValid] = useState(true);

  useEffect(() => {
    setClient({
      name: clientProp.name || '',
      privateCode: clientProp.privateCode || '',
      enturOrganisationId: clientProp.enturOrganisationId?.toString() || '',
      issuer: clientProp.issuer || 'Internal',
      responsibilitySetRefs: clientProp.responsibilitySetRefs || [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnClose = () => {
    setClient(emptyClient);
    setIsAddingResponsibilitySet(false);
    setAddRespAnchorEl(null);
    setOrgIdValid(true);
    handleCloseModal();
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

  const disableUpdate = !isClientRequiredFieldsProvided() || !orgIdValid;

  const actions = [
    <Button key="cancel" variant="text" onClick={handleOnClose}>
      Cancel
    </Button>,
    <Button key="update" variant="text" disabled={disableUpdate} color="primary" onClick={onSubmit}>
      Update
    </Button>,
  ];

  return (
    <Dialog open={isModalOpen} onClose={handleOnClose} maxWidth="md" fullWidth>
      <DialogTitle>Updating M2M Client {client.name}</DialogTitle>
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
            fullWidth
            margin="normal"
            required
            disabled
            helperText="Client id cannot be modified"
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

export default ModalEditM2MClient;
