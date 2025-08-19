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
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import withAuth from 'utils/withAuth';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Remove, Add, Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import NewRole from './NewRoleAssignment';
import { getEntityClassificationRefString } from 'utils/';

class ModalEditResponsibilitySet extends React.Component {
  constructor(props) {
    super(props);
    this.rolesRef = React.createRef();
    this.state = {
      isCreatingNewRole: false,
      isEditingRole: false,
      editingRoleIndex: -1,
      responsibilitySet: {
        ...props.responsibilitySet,
      },
      newRole: {
        typeOfResponsibilityRoleRef: '',
        responsibleOrganisationRef: '',
        entityClassificationAssignments: [],
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      responsibilitySet: nextProps.responsibilitySet,
    });
  }

  getRoleString(role) {
    const responsibleAreaRefString = `responsibleAreaRef=${role.responsibleAreaRef || ''}`;
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

  handleAddRole() {
    const { newRole, isEditingRole, editingRoleIndex } = this.state;
    let updatedRoles;

    if (isEditingRole && editingRoleIndex > -1) {
      // Update existing role
      updatedRoles = [...this.state.responsibilitySet.roles];
      updatedRoles[editingRoleIndex] = newRole;
    } else {
      // Add new role
      updatedRoles = [...this.state.responsibilitySet.roles, newRole];
    }

    this.setState({
      ...this.state,
      resultChip: null,
      newRole: {
        typeOfResponsibilityRoleRef: '',
        responsibleOrganisationRef: '',
        entityClassificationAssignments: [],
        responsibleAreaRef: null,
      },
      tempEntityClassification: '',
      tempEntityType: '',
      tempEntityTypes: [],
      responsibilitySet: {
        ...this.state.responsibilitySet,
        roles: updatedRoles,
      },
      isCreatingNewRole: false,
      isEditingRole: false,
      editingRoleIndex: -1,
    });
  }

  handleCancelEdit() {
    this.setState({
      isCreatingNewRole: false,
      isEditingRole: false,
      editingRoleIndex: -1,
      newRole: {
        typeOfResponsibilityRoleRef: '',
        responsibleOrganisationRef: '',
        entityClassificationAssignments: [],
        responsibleAreaRef: null,
      },
    });
  }

  handleRemoveRole() {
    const roles = this.rolesRef.current;
    const index = roles.options.selectedIndex;

    if (index > -1) {
      this.setState({
        responsibilitySet: {
          ...this.state.responsibilitySet,
          roles: [
            ...this.state.responsibilitySet.roles.slice(0, index),
            ...this.state.responsibilitySet.roles.slice(index + 1),
          ],
        },
      });
    }
  }

  handleEditRole() {
    const roles = this.rolesRef.current;
    const index = roles.options.selectedIndex;

    if (index > -1) {
      const roleToEdit = this.state.responsibilitySet.roles[index];
      this.setState({
        isEditingRole: true,
        isCreatingNewRole: true,
        editingRoleIndex: index,
        newRole: {
          ...roleToEdit,
          responsibleAreaRef: roleToEdit.responsibleAreaRef || null,
          entityClassificationAssignments: roleToEdit.entityClassificationAssignments || [],
        },
      });
    }
  }

  handleRemoveEntity(index) {
    this.setState({
      newRole: {
        ...this.state.newRole,
        entityClassificationAssignments: [
          ...this.state.newRole.entityClassificationAssignments.slice(0, index),
          ...this.state.newRole.entityClassificationAssignments.slice(index + 1),
        ],
      },
    });
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
      entityTypes,
      getToken,
    } = this.props;
    const { isCreatingNewRole, isEditingRole, responsibilitySet, newRole } = this.state;

    const isLegalPrivateCode =
      responsibilitySet.privateCode === this.props.responsibilitySet.privateCode ||
      takenPrivateCodes.indexOf(responsibilitySet.privateCode) === -1;

    const isSavable = this.isSavable() && isLegalPrivateCode;

    const actions = [
      <Button variant="text" onClick={handleOnClose}>
        Close
      </Button>,
      <Button
        variant="text"
        disabled={!isSavable}
        onClick={() => handleSubmit(this.state.responsibilitySet)}
      >
        Update
      </Button>,
    ];

    return (
      <Dialog open={modalOpen} onClose={() => handleOnClose()} maxWidth="lg" fullWidth>
        <DialogTitle>Editing responsibility set</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 5,
            }}
          >
            <TextField
              label="Name"
              placeholder="Name"
              value={responsibilitySet.name}
              fullWidth={true}
              margin="normal"
              onChange={e => {
                this.setState({
                  responsibilitySet: {
                    ...this.state.responsibilitySet,
                    name: e.target.value,
                  },
                });
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="edit-codespace-label">Codespace</InputLabel>
              <Select
                labelId="edit-codespace-label"
                label="Codespace"
                disabled={true}
                value={responsibilitySet.codeSpace}
                onChange={e => {
                  this.setState({
                    responsibilitySet: {
                      ...this.state.responsibilitySet,
                      codeSpace: e.target.value,
                    },
                  });
                }}
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
              disabled={true}
              value={responsibilitySet.privateCode}
              error={!isLegalPrivateCode}
              helperText={!isLegalPrivateCode ? 'This private code is already taken!' : ''}
              fullWidth={true}
              margin="normal"
              onChange={e => {
                this.setState({
                  responsibilitySet: {
                    ...this.state.responsibilitySet,
                    privateCode: e.target.value.trim(),
                  },
                });
              }}
            />
            <div style={{ minWidth: '100%', fontSize: 10, marginTop: -10 }}>
              <div style={{ width: '100%', fontSize: 10 }}>Role assignments *</div>
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <select
                  multiple="multiple"
                  style={{
                    fontSize: 10,
                    minWidth: '100%',
                  }}
                  ref={this.rolesRef}
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
                  onClick={() =>
                    this.setState({
                      isCreatingNewRole: true,
                      isEditingRole: false,
                      editingRoleIndex: -1,
                    })
                  }
                  size="large"
                >
                  <Add style={{ color: '#228B22' }} />
                </IconButton>
                <IconButton onClick={this.handleEditRole.bind(this)} size="large">
                  <Edit style={{ color: '#1976d2' }} />
                </IconButton>
                <IconButton onClick={this.handleRemoveRole.bind(this)} size="large">
                  <Remove style={{ color: '#cc0000' }} />
                </IconButton>
              </div>
              {isCreatingNewRole ? (
                <NewRole
                  getToken={getToken}
                  newRole={newRole}
                  roles={roles}
                  entityTypes={entityTypes}
                  organizations={organizations}
                  handleAddRole={this.handleAddRole.bind(this)}
                  handleCancel={this.handleCancelEdit.bind(this)}
                  administrativeZones={this.props.administrativeZones}
                  handleRemoveEntity={this.handleRemoveEntity.bind(this)}
                  isEditing={isEditingRole}
                  addNewAdminZoneRef={responsibleAreaRef => {
                    this.setState({
                      newRole: {
                        ...this.state.newRole,
                        responsibleAreaRef,
                      },
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
                            allow,
                          },
                        ],
                      },
                      tempEntityClassification: '',
                      tempEntityType: '',
                    })
                  }
                  organisationChange={(e, index, value) =>
                    this.setState({
                      ...this.state,
                      newRole: {
                        ...newRole,
                        responsibleOrganisationRef: value,
                      },
                    })
                  }
                  entityTypeChange={(e, index, value) =>
                    this.setState({
                      ...this.state,
                      newRole: {
                        ...newRole,
                        typeOfResponsibilityRoleRef: value,
                      },
                    })
                  }
                />
              ) : null}
            </div>
          </div>
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    );
  }
}

export default withAuth(ModalEditResponsibilitySet);
