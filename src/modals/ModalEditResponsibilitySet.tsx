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

import { useEffect, useRef, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Remove, Add, Edit } from '@mui/icons-material';
import { IconButton, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import NewRole from './NewRoleAssignment';
import { useAccessToken } from '@/utils/useAccessToken';
import { getEntityClassificationRefString } from 'utils/index';

interface CodeSpace {
  id: string;
  xmlns: string;
}

interface ResponsibilitySet {
  id?: string;
  name: string;
  codeSpace: string;
  privateCode: string;
  roles: any[];
}

interface NewRoleType {
  typeOfResponsibilityRoleRef: string;
  responsibleOrganisationRef: string;
  entityClassificationAssignments: any[];
  responsibleAreaRef?: string | null;
}

interface ModalEditResponsibilitySetProps {
  modalOpen: boolean;
  handleOnClose: () => void;
  handleSubmit: (responsibilitySet: ResponsibilitySet) => void;
  codeSpaces: CodeSpace[];
  takenPrivateCodes: string[];
  roles: any[];
  organizations: any[];
  entityTypes: any[];
  administrativeZones: any[];
  responsibilitySet: ResponsibilitySet;
}

const emptyNewRole: NewRoleType = {
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

const ModalEditResponsibilitySet = ({
  modalOpen,
  handleOnClose,
  handleSubmit,
  codeSpaces,
  takenPrivateCodes,
  roles,
  organizations,
  entityTypes,
  administrativeZones,
  responsibilitySet: responsibilitySetProp,
}: ModalEditResponsibilitySetProps) => {
  const { getToken } = useAccessToken();
  const rolesRef = useRef<HTMLSelectElement | null>(null);
  const [isCreatingNewRole, setIsCreatingNewRole] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [editingRoleIndex, setEditingRoleIndex] = useState(-1);
  const [responsibilitySet, setResponsibilitySet] = useState<ResponsibilitySet>({
    ...responsibilitySetProp,
  });
  const [newRole, setNewRole] = useState<NewRoleType>(emptyNewRole);

  useEffect(() => {
    setResponsibilitySet(responsibilitySetProp);
  }, [responsibilitySetProp]);

  const handleAddRole = () => {
    let updatedRoles: any[];
    if (isEditingRole && editingRoleIndex > -1) {
      updatedRoles = [...responsibilitySet.roles];
      updatedRoles[editingRoleIndex] = newRole;
    } else {
      updatedRoles = [...responsibilitySet.roles, newRole];
    }
    setResponsibilitySet({ ...responsibilitySet, roles: updatedRoles });
    setNewRole({ ...emptyNewRole, responsibleAreaRef: null });
    setIsCreatingNewRole(false);
    setIsEditingRole(false);
    setEditingRoleIndex(-1);
  };

  const handleCancelEdit = () => {
    setIsCreatingNewRole(false);
    setIsEditingRole(false);
    setEditingRoleIndex(-1);
    setNewRole({ ...emptyNewRole, responsibleAreaRef: null });
  };

  const handleRemoveRole = () => {
    const rolesEl = rolesRef.current;
    if (!rolesEl) return;
    const idx = rolesEl.options.selectedIndex;
    if (idx > -1) {
      setResponsibilitySet({
        ...responsibilitySet,
        roles: [
          ...responsibilitySet.roles.slice(0, idx),
          ...responsibilitySet.roles.slice(idx + 1),
        ],
      });
    }
  };

  const handleEditRole = () => {
    const rolesEl = rolesRef.current;
    if (!rolesEl) return;
    const idx = rolesEl.options.selectedIndex;
    if (idx > -1) {
      const roleToEdit = responsibilitySet.roles[idx];
      setIsEditingRole(true);
      setIsCreatingNewRole(true);
      setEditingRoleIndex(idx);
      setNewRole({
        ...roleToEdit,
        responsibleAreaRef: roleToEdit.responsibleAreaRef || null,
        entityClassificationAssignments: roleToEdit.entityClassificationAssignments || [],
      });
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

  const isLegalPrivateCode =
    responsibilitySet.privateCode === responsibilitySetProp.privateCode ||
    takenPrivateCodes.indexOf(responsibilitySet.privateCode) === -1;

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
      key="update"
      variant="contained"
      disabled={!isSavable}
      onClick={() => handleSubmit(responsibilitySet)}
    >
      Update
    </Button>,
  ];

  return (
    <Dialog open={modalOpen} onClose={handleOnClose} maxWidth="lg" fullWidth>
      <DialogTitle>Editing responsibility set</DialogTitle>
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
            <InputLabel id="edit-codespace-label">Codespace</InputLabel>
            <Select
              labelId="edit-codespace-label"
              label="Codespace"
              disabled
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
            disabled
            value={responsibilitySet.privateCode}
            error={!isLegalPrivateCode}
            helperText={!isLegalPrivateCode ? 'This private code is already taken!' : ''}
            fullWidth
            margin="normal"
            onChange={e =>
              setResponsibilitySet({
                ...responsibilitySet,
                privateCode: e.target.value.trim(),
              })
            }
          />
          <Box sx={{ minWidth: '100%', fontSize: 10, marginTop: '-10px' }}>
            <Box sx={{ width: '100%', fontSize: 10 }}>Role assignments *</Box>
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
                onClick={() => {
                  setIsCreatingNewRole(true);
                  setIsEditingRole(false);
                  setEditingRoleIndex(-1);
                }}
                size="large"
              >
                <Add sx={{ color: '#228B22' }} />
              </IconButton>
              <IconButton aria-label="Edit role assignment" onClick={handleEditRole} size="large">
                <Edit sx={{ color: '#1976d2' }} />
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
              <NewRole
                getToken={getToken}
                newRole={newRole}
                roles={roles}
                entityTypes={entityTypes}
                organizations={organizations}
                handleAddRole={handleAddRole}
                handleCancel={handleCancelEdit}
                administrativeZones={administrativeZones}
                handleRemoveEntity={handleRemoveEntity}
                isEditing={isEditingRole}
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

export default ModalEditResponsibilitySet;
