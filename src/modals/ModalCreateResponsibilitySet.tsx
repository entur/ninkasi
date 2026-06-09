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

import { useRef, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Remove, Add } from '@mui/icons-material';
import { IconButton, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import NewRoleAssignment from './NewRoleAssignment';
import { useAccessToken } from '@/utils/useAccessToken';
import { getEntityClassificationRefString } from 'utils/index';

interface CodeSpace {
  id: string;
  xmlns: string;
}

interface ResponsibilitySet {
  name: string;
  codeSpace: string;
  privateCode: string;
  roles: any[];
}

interface NewRole {
  typeOfResponsibilityRoleRef: string;
  responsibleOrganisationRef: string;
  entityClassificationAssignments: any[];
  responsibleAreaRef?: string | null;
}

interface ModalCreateResponsibilitySetProps {
  modalOpen: boolean;
  handleOnClose: () => void;
  handleSubmit: (responsibilitySet: ResponsibilitySet) => void;
  codeSpaces: CodeSpace[];
  takenPrivateCodes: string[];
  roles: any[];
  organizations: any[];
  entityTypes: any[];
  administrativeZones: any[];
}

const emptyNewRole: NewRole = {
  typeOfResponsibilityRoleRef: '',
  responsibleOrganisationRef: '',
  entityClassificationAssignments: [],
};

const getEntityClassAssignmentString = (assignments: any[]) => {
  if (!assignments || !assignments.length) return '';
  return assignments
    .map(({ allow, entityClassificationRef }) =>
      getEntityClassificationRefString(entityClassificationRef, allow)
    )
    .join(', ');
};

const getRoleString = (role: any) => {
  const responsibleAreaRefString = `responsibleAreaRef=${role.responsibleAreaRef || ''}`;
  return `ORG=${role.responsibleOrganisationRef}, type=${role.typeOfResponsibilityRoleRef}, ${responsibleAreaRefString}, entities=${getEntityClassAssignmentString(role.entityClassificationAssignments)}`;
};

const ModalCreateResponsibilitySet = ({
  modalOpen,
  handleOnClose,
  handleSubmit,
  codeSpaces,
  takenPrivateCodes,
  roles,
  organizations,
  entityTypes,
  administrativeZones,
}: ModalCreateResponsibilitySetProps) => {
  const { getToken } = useAccessToken();
  const rolesRef = useRef<HTMLSelectElement | null>(null);
  const [isCreatingNewRole, setIsCreatingNewRole] = useState(false);
  const [responsibilitySet, setResponsibilitySet] = useState<ResponsibilitySet>({
    name: '',
    codeSpace: '',
    privateCode: '',
    roles: [],
  });
  const [newRole, setNewRole] = useState<NewRole>(emptyNewRole);

  const handleAddRole = () => {
    setResponsibilitySet(prev => ({
      ...prev,
      roles: [...prev.roles, newRole],
    }));
    setNewRole({ ...emptyNewRole, responsibleAreaRef: null });
    setIsCreatingNewRole(false);
  };

  const handleRemoveRole = () => {
    const rolesEl = rolesRef.current;
    if (!rolesEl) return;
    const idx = rolesEl.options.selectedIndex;
    if (idx > -1) {
      setResponsibilitySet(prev => ({
        ...prev,
        roles: [...prev.roles.slice(0, idx), ...prev.roles.slice(idx + 1)],
      }));
    }
  };

  const handleRemoveEntity = (idx: number) => {
    setNewRole(prev => ({
      ...prev,
      entityClassificationAssignments: [
        ...prev.entityClassificationAssignments.slice(0, idx),
        ...prev.entityClassificationAssignments.slice(idx + 1),
      ],
    }));
  };

  const isLegalPrivateCode = takenPrivateCodes.indexOf(responsibilitySet.privateCode) === -1;
  const isInternallySavable =
    responsibilitySet.name.length > 0 &&
    responsibilitySet.codeSpace.length > 0 &&
    responsibilitySet.privateCode.length > 0 &&
    responsibilitySet.roles.length > 0;
  const isSavable = isInternallySavable && isLegalPrivateCode;

  const actions = [
    <Button key="close" variant="outlined" onClick={handleOnClose}>
      Close
    </Button>,
    <Button
      key="create"
      variant="contained"
      disabled={!isSavable}
      onClick={() => handleSubmit(responsibilitySet)}
    >
      Create
    </Button>,
  ];

  return (
    <Dialog open={modalOpen} onClose={handleOnClose} maxWidth="lg" fullWidth>
      <DialogTitle>Creating a new responsibility set</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '5px',
          }}
        >
          <TextField
            label="Name"
            placeholder="Name"
            value={responsibilitySet.name}
            fullWidth
            margin="normal"
            onChange={e => setResponsibilitySet({ ...responsibilitySet, name: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="codespace-select-label">Codespace</InputLabel>
            <Select
              labelId="codespace-select-label"
              label="Codespace"
              value={responsibilitySet.codeSpace}
              onChange={e =>
                setResponsibilitySet({
                  ...responsibilitySet,
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
          <TextField
            placeholder="Private code"
            label="Private code"
            value={responsibilitySet.privateCode}
            error={!isLegalPrivateCode}
            helperText={!isLegalPrivateCode ? 'This private code is already taken!' : ''}
            fullWidth
            margin="normal"
            onChange={e =>
              setResponsibilitySet({ ...responsibilitySet, privateCode: e.target.value })
            }
          />
          <Box sx={{ width: '100%' }}>
            <Box sx={{ fontSize: 10 }}>Role assignments *</Box>
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <Box
                component="select"
                multiple
                sx={{ fontSize: 10, minWidth: '100%' }}
                ref={rolesRef}
              >
                {responsibilitySet.roles.map((role, i) => (
                  <Box component="option" sx={{ overflowX: 'auto' }} key={'role-' + i}>
                    {getRoleString(role)}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box>
              <IconButton
                aria-label="Add role assignment"
                onClick={() => setIsCreatingNewRole(true)}
                size="large"
              >
                <Add sx={{ color: '#228B22' }} />
              </IconButton>
              <IconButton
                aria-label="Remove role assignment"
                onClick={handleRemoveRole}
                size="large"
              >
                <Remove sx={{ color: '#cc0000' }} />
              </IconButton>
            </Box>
            {isCreatingNewRole ? (
              <NewRoleAssignment
                getToken={getToken}
                newRole={newRole}
                roles={roles}
                entityTypes={entityTypes}
                organizations={organizations}
                handleAddRole={handleAddRole}
                administrativeZones={administrativeZones}
                handleRemoveEntity={handleRemoveEntity}
                addNewAdminZoneRef={responsibleAreaRef => {
                  setNewRole(prev => ({ ...prev, responsibleAreaRef }));
                }}
                addNewRoleAssignment={(entityClassificationRef, allow) =>
                  setNewRole(prev => ({
                    ...prev,
                    entityClassificationAssignments: [
                      ...prev.entityClassificationAssignments,
                      { entityClassificationRef, allow },
                    ],
                  }))
                }
                organisationChange={(_e, _index, value) =>
                  setNewRole(prev => ({ ...prev, responsibleOrganisationRef: value }))
                }
                entityTypeChange={(_e, _index, value) =>
                  setNewRole(prev => ({ ...prev, typeOfResponsibilityRoleRef: value }))
                }
              />
            ) : null}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default ModalCreateResponsibilitySet;
