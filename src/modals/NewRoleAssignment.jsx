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
import Button from '@mui/material/Button';
import { FormControl, Select, MenuItem, InputLabel, FormControlLabel } from '@mui/material';
import { Checkbox } from '@mui/material';
import AdminZoneSearchWrapper from './AdminZoneSearchWrapper';
import OrganizationRegisterActions, { sortBy } from 'actions/OrganizationRegisterActions';
import { Remove } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { getEntityClassificationRefString } from 'utils/';

class NewRoleAssignment extends React.Component {
  constructor(props) {
    super(props);
    this.entityClassRefsRef = React.createRef();
    this.state = {
      tempEntityClassification: '',
      tempEntityType: '',
      tempEntityTypes: [],
      resultChip: null,
      negate: false,
    };
  }

  getEntityClassificationsForType(entityType) {
    OrganizationRegisterActions.getEntityByClassification(entityType, this.props.getToken).then(
      response => {
        this.setState({
          tempEntityClassification: entityType,
          tempEntityTypes: sortBy(response.data, 'name'),
        });
      }
    );
  }

  handleRemoveEntity() {
    const entityClassRefs = this.entityClassRefsRef.current;
    const index = entityClassRefs.options.selectedIndex;

    if (index > -1) {
      this.props.handleRemoveEntity(index);
    }
  }

  handleNewAdminZoneRequest({ value, text }) {
    if (value && text) {
      this.setState({
        resultChip: {
          value,
          name: text,
        },
      });

      this.props.addNewAdminZoneRef(value);
    }
  }

  handleDeleteResultChip() {
    this.setState({
      resultChip: null,
      newRole: {
        ...this.state.newRole,
        responsibleAreaRef: null,
      },
    });
  }

  render() {
    const { newRole, roles, organizations, entityTypes, handleAddRole, administrativeZones } =
      this.props;
    const { entityTypeChange, organisationChange, addNewRoleAssignment } = this.props;
    const { tempEntityType, tempEntityTypes, tempEntityClassification, negate } = this.state;

    return (
      <div style={{ border: '1px dotted', height: '100%' }}>
        <div
          style={{
            fontSize: 12,
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          New role assignment
        </div>
        <FormControl fullWidth margin="normal">
          <InputLabel id="role-type-label">Role type</InputLabel>
          <Select
            labelId="role-type-label"
            label="Role type"
            value={newRole.typeOfResponsibilityRoleRef}
            onChange={e => entityTypeChange(e, null, e.target.value)}
          >
            {roles.map(role => (
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
            onChange={e => organisationChange(e, null, e.target.value)}
          >
            {organizations.map(org => (
              <MenuItem key={org.id} value={org.id}>
                {org.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <AdminZoneSearchWrapper
          handleNewRequest={this.handleNewAdminZoneRequest.bind(this)}
          administrativeZones={administrativeZones}
          chip={this.state.resultChip}
          handleDeleteChip={this.handleDeleteResultChip.bind(this)}
        />
        <div style={{ width: '100%', fontSize: 12 }}>Entity classification</div>
        <div style={{ display: 'flex' }}>
          <select
            ref={this.entityClassRefsRef}
            multiple="multiple"
            style={{ width: '100%', fontSize: 12 }}
          >
            {newRole.entityClassificationAssignments.map((ref, index) => (
              <option key={'entity-' + index}>
                {getEntityClassificationRefString(ref.entityClassificationRef, ref.allow)}
              </option>
            ))}
          </select>
          <IconButton onClick={this.handleRemoveEntity.bind(this)} size="large">
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
                  this.setState({
                    negate: e.target.checked,
                  });
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
              onChange={e => this.getEntityClassificationsForType(e.target.value)}
            >
              {entityTypes.map(entity => (
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
              onChange={e => this.setState({ tempEntityType: e.target.value })}
              disabled={!this.state.tempEntityClassification}
            >
              {tempEntityTypes.map(type => (
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
        <Button
          variant="contained"
          color="primary"
          disabled={
            !newRole.typeOfResponsibilityRoleRef.length ||
            !newRole.responsibleOrganisationRef.length
          }
          style={{ display: 'block' }}
          onClick={handleAddRole}
        >
          Add role assignment
        </Button>
      </div>
    );
  }
}

export default NewRoleAssignment;
