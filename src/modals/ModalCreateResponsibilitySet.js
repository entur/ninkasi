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
import Modal from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import { Remove, Add } from '@mui/icons-material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SelectField from '@mui/material/SelectField';
import MenuItem from '@mui/material/MenuItem';
import NewRoleAssignment from './NewRoleAssignment';
import { getEntityClassificationRefString } from 'utils/';
import { connect } from 'react-redux';

class ModalCreateResponsibilitySet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreatingNewRole: false,
      responsibilitySet: {
        name: '',
        codeSpace: '',
        privateCode: '',
        roles: []
      },
      newRole: {
        typeOfResponsibilityRoleRef: '',
        responsibleOrganisationRef: '',
        entityClassificationAssignments: []
      },
      tempEntityClassification: '',
      tempEntityType: '',
      tempEntityTypes: []
    };
  }

  getRoleString(role) {
    const responsibleAreaRefString = `responsibleAreaRef=${role.responsibleAreaRef ||
      ''}`;
    return `ORG=${role.responsibleOrganisationRef}, type=${
      role.typeOfResponsibilityRoleRef
    }, ${responsibleAreaRefString}, entities=${this.getEntityClassAssignmentString(
      role.entityClassificationAssignments
    )}`;
  }

  getEntityClassAssignmentString(assignments) {
    if (!assignments || !assignments.length) return '';
    return assignments
      .map(({ allow, entityClassificationRef }) =>
        getEntityClassificationRefString(entityClassificationRef, allow)
      )
      .join(', ');
  }

  handleRemoveEntity(index) {
    this.setState({
      newRole: {
        ...this.state.newRole,
        entityClassificationAssignments: [
          ...this.state.newRole.entityClassificationAssignments.slice(0, index),
          ...this.state.newRole.entityClassificationAssignments.slice(index + 1)
        ]
      }
    });
  }

  handleAddRole() {
    const { newRole } = this.state;
    this.setState({
      ...this.state,
      resultChip: null,
      newRole: {
        typeOfResponsibilityRoleRef: '',
        responsibleOrganisationRef: '',
        entityClassificationAssignments: [],
        responsibleAreaRef: null
      },
      tempEntityClassification: '',
      tempEntityType: '',
      tempEntityTypes: [],
      responsibilitySet: {
        ...this.state.responsibilitySet,
        roles: [...this.state.responsibilitySet.roles, newRole]
      },
      isCreatingNewRole: false
    });
  }

  handleRemoveRole() {
    const { roles } = this.refs;
    const index = roles.options.selectedIndex;

    if (index > -1) {
      this.setState({
        responsibilitySet: {
          ...this.state.responsibilitySet,
          roles: [
            ...this.state.responsibilitySet.roles.slice(0, index),
            ...this.state.responsibilitySet.roles.slice(index + 1)
          ]
        }
      });
    }
  }

  isSavable() {
    const { responsibilitySet } = this.state;
    return (
      responsibilitySet.name.length &&
      responsibilitySet.codeSpace.length &&
      responsibilitySet.privateCode.length &&
      responsibilitySet.roles.length > 0
    );
  }

  render() {
    const {
      modalOpen,
      handleOnClose,
      codeSpaces,
      takenPrivateCodes,
      roles,
      organizations,
      handleSubmit,
      entityTypes
    } = this.props;

    const { isCreatingNewRole, responsibilitySet, newRole } = this.state;
    const isLegalPrivateCode =
      takenPrivateCodes.indexOf(responsibilitySet.privateCode) === -1;

    const isSavable = this.isSavable() && isLegalPrivateCode;

    const actions = [
      <Button variant="text" label="Close" onClick={handleOnClose} />,
      <Button
        variant="text"
        disabled={!isSavable}
        label="Create"
        onClick={() => handleSubmit(this.state.responsibilitySet)}
      />
    ];

    return (
      <Modal
        open={modalOpen}
        onRequestClose={() => handleOnClose()}
        actions={actions}
        title="Creating a new responsibility set"
        bodyStyle={{ height: '100%' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 5
          }}
        >
          <TextField
            floatingLabelText="Name"
            hintText="Name"
            value={responsibilitySet.name}
            fullWidth={true}
            style={{ marginTop: -25 }}
            onChange={(e, value) => {
              this.setState({
                responsibilitySet: {
                  ...this.state.responsibilitySet,
                  name: value
                }
              });
            }}
          />
          <SelectField
            hintText="Code space"
            floatingLabelText="Code space"
            value={responsibilitySet.codeSpace}
            style={{ marginTop: -10 }}
            onChange={(e, index, value) => {
              this.setState({
                responsibilitySet: {
                  ...this.state.responsibilitySet,
                  codeSpace: value
                }
              });
            }}
            fullWidth={true}
          >
            {codeSpaces.map(codeSpace => (
              <MenuItem
                key={codeSpace.id}
                id={codeSpace.id}
                value={codeSpace.id}
                label={codeSpace.id}
                primaryText={codeSpace.xmlns}
              />
            ))}
          </SelectField>
          <TextField
            hintText="Private code"
            floatingLabelText="Private code"
            value={responsibilitySet.privateCode}
            errorText={
              isLegalPrivateCode ? '' : 'This private code is already taken!'
            }
            fullWidth={true}
            onChange={(e, value) => {
              this.setState({
                responsibilitySet: {
                  ...this.state.responsibilitySet,
                  privateCode: value
                }
              });
            }}
            errorStyle={{ float: 'right' }}
            style={{ marginBottom: 10, marginTop: -20 }}
          />
          <div style={{ width: '100%' }}>
            <div style={{ fontSize: 10 }}>Responsibility roles *</div>
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <select
                multiple="multiple"
                style={{
                  fontSize: 10,
                  minWidth: '100%'
                }}
                ref="roles"
              >
                {responsibilitySet.roles.map((role, i) => (
                  <option style={{ overflowX: 'auto' }} key={'role-' + i}>
                    {this.getRoleString(role)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <IconButton
                onClick={() => this.setState({ isCreatingNewRole: true })}
              >
                <Add color="#228B22" />
              </IconButton>
              <IconButton onClick={this.handleRemoveRole.bind(this)}>
                <Remove color="#cc0000" />
              </IconButton>
            </div>
            {isCreatingNewRole ? (
              <NewRoleAssignment
                auth={this.props.auth}
                newRole={newRole}
                roles={roles}
                entityTypes={entityTypes}
                organizations={organizations}
                handleAddRole={this.handleAddRole.bind(this)}
                administrativeZones={this.props.administrativeZones}
                handleRemoveEntity={this.handleRemoveEntity.bind(this)}
                addNewAdminZoneRef={responsibleAreaRef => {
                  this.setState({
                    newRole: {
                      ...this.state.newRole,
                      responsibleAreaRef
                    }
                  });
                }}
                addNewRoleAssignment={(entityClassificationRef, allow) =>
                  this.setState({
                    newRole: {
                      ...newRole,
                      entityClassificationAssignments: [
                        ...newRole.entityClassificationAssignments,
                        {
                          entityClassificationRef,
                          allow
                        }
                      ]
                    },
                    tempEntityClassification: '',
                    tempEntityType: ''
                  })
                }
                organisationChange={(e, index, value) =>
                  this.setState({
                    ...this.state,
                    newRole: {
                      ...newRole,
                      responsibleOrganisationRef: value
                    }
                  })
                }
                entityTypeChange={(e, index, value) =>
                  this.setState({
                    ...this.state,
                    newRole: {
                      ...newRole,
                      typeOfResponsibilityRoleRef: value
                    }
                  })
                }
              />
            ) : null}
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.UserReducer.auth
});

export default connect(mapStateToProps)(ModalCreateResponsibilitySet);
