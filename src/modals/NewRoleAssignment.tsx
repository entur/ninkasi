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
import Button from '@mui/material/Button';
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';
import { Remove } from '@mui/icons-material';
import AdminZoneSearchWrapper from './AdminZoneSearchWrapper';
import OrganizationRegisterActions, { sortBy } from 'actions/OrganizationRegisterActions';
import { getEntityClassificationRefString } from 'utils/index';

interface NewRoleAssignmentProps {
  newRole: any;
  roles: any[];
  organizations: any[];
  entityTypes: any[];
  administrativeZones: any[];
  isEditing?: boolean;
  getToken: () => Promise<string | undefined>;
  handleAddRole: () => void;
  handleCancel?: () => void;
  handleRemoveEntity: (index: number) => void;
  addNewAdminZoneRef: (ref: string | null) => void;
  addNewRoleAssignment: (entityClassificationRef: string, allow: boolean) => void;
  organisationChange: (event: unknown, index: unknown, value: string) => void;
  entityTypeChange: (event: unknown, index: unknown, value: string) => void;
}

const NewRoleAssignment = ({
  newRole,
  roles,
  organizations,
  entityTypes,
  administrativeZones,
  isEditing,
  getToken,
  handleAddRole,
  handleCancel,
  handleRemoveEntity,
  addNewAdminZoneRef,
  addNewRoleAssignment,
  organisationChange,
  entityTypeChange,
}: NewRoleAssignmentProps) => {
  const entityClassRefsRef = useRef<HTMLSelectElement | null>(null);
  const [tempEntityClassification, setTempEntityClassification] = useState('');
  const [tempEntityType, setTempEntityType] = useState('');
  const [tempEntityTypes, setTempEntityTypes] = useState<any[]>([]);
  const [resultChip, setResultChip] = useState<{ value: string; name: string } | null>(null);
  const [negate, setNegate] = useState(false);

  useEffect(() => {
    // If editing and there's a responsibleAreaRef, set the chip
    if (isEditing && newRole.responsibleAreaRef && administrativeZones) {
      const zone = administrativeZones.find((z: any) => z.id === newRole.responsibleAreaRef);
      if (zone) {
        setResultChip({
          value: zone.id,
          name: zone.name,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEntityClassificationsForType = (entityType: string) => {
    OrganizationRegisterActions.getEntityByClassification(entityType, getToken).then(
      (response: any) => {
        setTempEntityClassification(entityType);
        setTempEntityTypes(sortBy(response.data, 'name'));
      }
    );
  };

  const handleRemoveEntityLocal = () => {
    const entityClassRefs = entityClassRefsRef.current;
    if (!entityClassRefs) return;
    const idx = entityClassRefs.options.selectedIndex;
    if (idx > -1) {
      handleRemoveEntity(idx);
    }
  };

  const handleNewAdminZoneRequest = ({ value, text }: { value: string; text: string }) => {
    if (value && text) {
      setResultChip({ value, name: text });
      addNewAdminZoneRef(value);
    }
  };

  const handleDeleteResultChip = () => {
    setResultChip(null);
    addNewAdminZoneRef(null);
  };

  return (
    <div style={{ border: '1px dotted', height: '100%' }}>
      <div
        style={{
          fontSize: 12,
          textAlign: 'center',
          fontWeight: 600,
        }}
      >
        {isEditing ? 'Edit role assignment' : 'New role assignment'}
      </div>
      <FormControl fullWidth margin="normal">
        <InputLabel id="role-type-label">Role type</InputLabel>
        <Select
          labelId="role-type-label"
          label="Role type"
          value={newRole.typeOfResponsibilityRoleRef}
          onChange={e => entityTypeChange(e, null, e.target.value as string)}
        >
          {roles.map((role: any) => (
            <MenuItem key={role.id} value={role.id}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="organization-label">Organization</InputLabel>
        <Select
          labelId="organization-label"
          label="Organization"
          value={newRole.responsibleOrganisationRef}
          onChange={e => organisationChange(e, null, e.target.value as string)}
        >
          {organizations.map((org: any) => (
            <MenuItem key={org.id} value={org.id}>
              {org.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <AdminZoneSearchWrapper
        handleNewRequest={handleNewAdminZoneRequest}
        administrativeZones={administrativeZones}
        chip={resultChip}
        handleDeleteChip={handleDeleteResultChip}
      />
      <div style={{ width: '100%', fontSize: 12 }}>Entity classification</div>
      <div style={{ display: 'flex' }}>
        <select ref={entityClassRefsRef} multiple style={{ width: '100%', fontSize: 12 }}>
          {newRole.entityClassificationAssignments.map((ref: any, idx: number) => (
            <option key={'entity-' + idx}>
              {getEntityClassificationRefString(ref.entityClassificationRef, ref.allow)}
            </option>
          ))}
        </select>
        <IconButton onClick={handleRemoveEntityLocal} size="large">
          <Remove style={{ color: '#cc0000' }} />
        </IconButton>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          gap: '8px',
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={negate}
              onChange={e => {
                setNegate(e.target.checked);
              }}
            />
          }
          label="Negate"
          style={{ flex: 0.8 }}
        />
        <FormControl style={{ flex: 2.5 }}>
          <InputLabel id="entity-type-label">Entity type</InputLabel>
          <Select
            labelId="entity-type-label"
            label="Entity type"
            value={tempEntityClassification}
            onChange={e => getEntityClassificationsForType(e.target.value as string)}
          >
            {entityTypes.map((entity: any) => (
              <MenuItem key={entity.id} value={entity.id}>
                {entity.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ flex: 2.5 }}>
          <InputLabel id="entity-classification-label">Classification</InputLabel>
          <Select
            labelId="entity-classification-label"
            label="Classification"
            value={tempEntityType}
            onChange={e => setTempEntityType(e.target.value as string)}
            disabled={!tempEntityClassification}
          >
            {tempEntityTypes.map((type: any) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="text"
          style={{ flex: 1 }}
          disabled={!tempEntityClassification.length}
          onClick={() => addNewRoleAssignment(tempEntityType, !negate)}
        >
          Add
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <Button
          variant="contained"
          color="primary"
          disabled={
            !newRole.typeOfResponsibilityRoleRef.length ||
            !newRole.responsibleOrganisationRef.length
          }
          onClick={handleAddRole}
        >
          {isEditing ? 'Update role assignment' : 'Add role assignment'}
        </Button>
        {isEditing && handleCancel && (
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default NewRoleAssignment;
