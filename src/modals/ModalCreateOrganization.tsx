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
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

interface Organization {
  name: string;
  organisationType: string;
  privateCode: string;
  codeSpace: string;
}

interface CodeSpace {
  id: string;
  xmlns: string;
}

interface ModalCreateOrganizationProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleSubmit: (organization: Organization) => void;
  takenOrganizationNames: string[];
  takenOrganizationPrivateCodes: string[];
  codeSpaces: CodeSpace[];
}

const emptyOrganization: Organization = {
  name: '',
  organisationType: 'AUTHORITY',
  privateCode: '',
  codeSpace: '',
};

const ModalCreateOrganization = ({
  isModalOpen,
  handleCloseModal,
  handleSubmit,
  takenOrganizationNames,
  takenOrganizationPrivateCodes,
  codeSpaces,
}: ModalCreateOrganizationProps) => {
  const [organization, setOrganization] = useState<Organization>(emptyOrganization);

  const handleOnClose = () => {
    setOrganization(emptyOrganization);
    handleCloseModal();
  };

  const isOrganizationNameTaken = takenOrganizationNames.indexOf(organization.name) > -1;
  const isOrganizationPrivateCodeTaken =
    takenOrganizationPrivateCodes.indexOf(organization.privateCode) > -1;

  const isSavable =
    !isOrganizationNameTaken &&
    !isOrganizationPrivateCodeTaken &&
    organization.name.length > 0 &&
    organization.privateCode.length > 0 &&
    organization.codeSpace.length > 0;

  const actions = [
    <Button key="cancel" variant="text" onClick={handleCloseModal}>
      Cancel
    </Button>,
    <Button
      key="create"
      variant="text"
      disabled={!isSavable}
      onClick={() => handleSubmit(organization)}
    >
      Create
    </Button>,
  ];

  return (
    <Dialog open={isModalOpen} onClose={handleOnClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create a new organisation</DialogTitle>
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
            onChange={e => setOrganization({ ...organization, name: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            placeholder="Private code"
            label="Private code"
            error={isOrganizationPrivateCodeTaken}
            helperText={
              isOrganizationPrivateCodeTaken ? 'Organization private code already exists' : ''
            }
            value={organization.privateCode}
            onChange={e => setOrganization({ ...organization, privateCode: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="org-type-label">Organization type</InputLabel>
            <Select
              labelId="org-type-label"
              label="Organization type"
              value={organization.organisationType}
              onChange={e =>
                setOrganization({
                  ...organization,
                  organisationType: e.target.value as string,
                })
              }
            >
              <MenuItem value="AUTHORITY">AUTHORITY</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="org-codespace-label">Codespace</InputLabel>
            <Select
              labelId="org-codespace-label"
              label="Codespace"
              value={organization.codeSpace}
              onChange={e =>
                setOrganization({
                  ...organization,
                  codeSpace: e.target.value as string,
                })
              }
            >
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
};

export default ModalCreateOrganization;
