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
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

interface Organization {
  id?: string;
  name: string;
  organisationType: string;
  privateCode: string;
  codeSpace: string;
}

interface CodeSpace {
  id: string;
  xmlns: string;
}

interface ModalEditOrganizationProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleSubmit: (organization: Organization) => void;
  organization: Organization;
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

const ModalEditOrganization = ({
  isModalOpen,
  handleCloseModal,
  handleSubmit,
  organization: orgProp,
  takenOrganizationNames,
  takenOrganizationPrivateCodes,
  codeSpaces,
}: ModalEditOrganizationProps) => {
  const [organization, setOrganization] = useState<Organization>(orgProp || emptyOrganization);
  const [originalName, setOriginalName] = useState<string>(orgProp ? orgProp.name : '');

  useEffect(() => {
    if (orgProp) {
      setOrganization(orgProp);
      setOriginalName(orgProp.name);
    }
  }, [orgProp]);

  const isOrganizationNameTaken =
    takenOrganizationNames.indexOf(organization.name) > -1 && orgProp.name !== organization.name;

  const isOrganizationPrivateCodeTaken =
    takenOrganizationPrivateCodes.indexOf(organization.privateCode) > -1 &&
    orgProp.privateCode !== organization.privateCode;

  const isSavable =
    !isOrganizationNameTaken &&
    !isOrganizationPrivateCodeTaken &&
    !!organization.name &&
    organization.name.length > 0;

  const actions = [
    <Button key="cancel" variant="outlined" onClick={handleCloseModal}>
      Cancel
    </Button>,
    <Button
      key="update"
      variant="contained"
      disabled={!isSavable}
      onClick={() => handleSubmit(organization)}
    >
      Update
    </Button>,
  ];

  return (
    <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
      <DialogTitle>{'Editing organisation ' + originalName}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
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
            disabled
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="edit-org-type-label">Organization type</InputLabel>
            <Select
              labelId="edit-org-type-label"
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
          <FormControl fullWidth margin="normal">
            <InputLabel id="edit-org-codespace-label">Codespace</InputLabel>
            <Select
              labelId="edit-org-codespace-label"
              label="Codespace"
              value={organization.codeSpace}
              disabled
            >
              {codeSpaces.map(codeSpace => (
                <MenuItem key={codeSpace.id} value={codeSpace.id}>
                  {codeSpace.xmlns}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default ModalEditOrganization;
