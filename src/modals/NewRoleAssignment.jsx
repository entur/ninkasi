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
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import AdminZoneSearchWrapper from './AdminZoneSearchWrapper';
import OrganizationRegisterActions, {
  sortBy
} from 'actions/OrganizationRegisterActions';
import MdRemove from 'material-ui/svg-icons/content/remove';
import IconButton from 'material-ui/IconButton';
import { getEntityClassificationRefString } from 'utils/';

class NewRoleAssignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempEntityClassification: '',
      tempEntityType: '',
      tempEntityTypes: [],
      resultChip: null,
      negate: false
    };
  }

  getEntityClassificationsForType(entityType) {
    OrganizationRegisterActions.getEntityByClassification(
      entityType,
      this.props.getToken
    ).then(response => {
      this.setState({
        tempEntityClassification: entityType,
        tempEntityTypes: sortBy(response.data, 'name')
      });
    });
  }

  handleRemoveEntity() {
    const { entityClassRefs } = this.refs;
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
          name: text
        }
      });

      this.props.addNewAdminZoneRef(value);
    }
  }

  handleDeleteResultChip() {
    this.setState({
      resultChip: null,
      newRole: {
        ...this.state.newRole,
        responsibleAreaRef: null
      }
    });
  }

  render() {
    const {
      newRole,
      roles,
      organizations,
      entityTypes,
      handleAddRole,
      administrativeZones
    } = this.props;
    const {
      entityTypeChange,
      organisationChange,
      addNewRoleAssignment
    } = this.props;
    const {
      tempEntityType,
      tempEntityTypes,
      tempEntityClassification,
      negate
    } = this.state;

    return (
      <div style={{ border: '1px dotted', height: '100%' }}>
        <div
          style={{
            fontSize: 12,
            textAlign: 'center',
            fontWeight: 600
          }}
        >
          New role assignment
        </div>
        <SelectField
          hintText="Role type"
          floatingLabelText="Role type"
          value={newRole.typeOfResponsibilityRoleRef}
          onChange={entityTypeChange}
          fullWidth={true}
          style={{ marginTop: -15 }}
        >
          {roles.map(role => (
            <MenuItem
              key={role.id}
              id={role.id}
              value={role.id}
              label={role.name}
              primaryText={role.name}
            />
          ))}
        </SelectField>
        <SelectField
          hintText="Organization"
          style={{ marginTop: -15 }}
          floatingLabelText="Organization"
          value={newRole.responsibleOrganisationRef}
          onChange={organisationChange}
          fullWidth={true}
        >
          {organizations.map(org => (
            <MenuItem
              key={org.id}
              id={org.id}
              value={org.id}
              label={org.name}
              primaryText={org.name}
            />
          ))}
        </SelectField>
        <AdminZoneSearchWrapper
          handleNewRequest={this.handleNewAdminZoneRequest.bind(this)}
          administrativeZones={administrativeZones}
          chip={this.state.resultChip}
          handleDeleteChip={this.handleDeleteResultChip.bind(this)}
        />
        <div style={{ width: '100%', fontSize: 12 }}>Entity classification</div>
        <div style={{ display: 'flex' }}>
          <select
            ref="entityClassRefs"
            multiple="multiple"
            style={{ width: '100%', fontSize: 12 }}
          >
            {newRole.entityClassificationAssignments.map((ref, index) => (
              <option key={'entity-' + index}>
                {getEntityClassificationRefString(
                  ref.entityClassificationRef,
                  ref.allow
                )}
              </option>
            ))}
          </select>
          <IconButton onClick={this.handleRemoveEntity.bind(this)} size="large">
            <MdRemove color="#cc0000" />
          </IconButton>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Checkbox
            label="Negate"
            style={{
              flex: 0.8,
              width: 'auto',
              marginTop: 30,
              marginRight: 5,
              marginLeft: 5
            }}
            labelStyle={{ fontSize: 12 }}
            checked={negate}
            onCheck={(e, v) => {
              this.setState({
                negate: v
              });
            }}
          />
          <SelectField
            hintText="Classification"
            floatingLabelText="Classification"
            style={{ flex: 2.5, marginLeft: 5, marginRight: 5 }}
            value={tempEntityClassification}
            onChange={(e, i, v) => this.getEntityClassificationsForType(v)}
            fullWidth={true}
          >
            {entityTypes.map(entity => (
              <MenuItem
                key={entity.id}
                id={entity.id}
                value={entity.id}
                label={entity.name}
                primaryText={entity.name}
              />
            ))}
          </SelectField>
          <SelectField
            hintText="Type"
            style={{ flex: 2.5 }}
            floatingLabelText="Type"
            value={tempEntityType}
            onChange={(e, i, v) => this.setState({ tempEntityType: v })}
            fullWidth={true}
            disabled={!this.state.tempEntityClassification}
          >
            {tempEntityTypes.map(type => (
              <MenuItem
                key={type.id}
                id={type.id}
                value={type.id}
                label={type.name}
                primaryText={type.name}
              />
            ))}
          </SelectField>
          <FlatButton
            label="Add"
            style={{ flex: 1 }}
            disabled={!tempEntityClassification.length}
            onClick={() => addNewRoleAssignment(tempEntityType, !negate)}
          />
        </div>
        <RaisedButton
          label="Add role"
          primary={true}
          disabled={
            !newRole.typeOfResponsibilityRoleRef.length ||
            !newRole.responsibleOrganisationRef.length
          }
          style={{ display: 'block' }}
          onClick={handleAddRole}
        />
      </div>
    );
  }
}

export default NewRoleAssignment;
