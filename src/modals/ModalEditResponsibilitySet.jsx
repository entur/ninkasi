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
import Modal from 'material-ui/Dialog';
import withAuth from 'utils/withAuth';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import MdRemove from 'material-ui/svg-icons/content/remove';
import MdAdd from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import NewRole from './NewRoleAssignment';
import { getEntityClassificationRefString } from 'utils/';

class ModalEditResponsibilitySet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreatingNewRole: false,
      responsibilitySet: {
        ...props.responsibilitySet
      },
      newRole: {
        typeOfResponsibilityRoleRef: '',
        responsibleOrganisationRef: '',
        entityClassificationAssignments: []
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      responsibilitySet: nextProps.responsibilitySet
    });
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
      getToken
    } = this.props;
    const { isCreatingNewRole, responsibilitySet, newRole } = this.state;

    const isLegalPrivateCode =
      responsibilitySet.privateCode ===
        this.props.responsibilitySet.privateCode ||
      takenPrivateCodes.indexOf(responsibilitySet.privateCode) === -1;

    const isSavable = this.isSavable() && isLegalPrivateCode;

    const actions = [
      <FlatButton label="Close" onClick={handleOnClose} />,
      <FlatButton
        disabled={!isSavable}
        label="Update"
        onClick={() => handleSubmit(this.state.responsibilitySet)}
      />
    ];

    return (
      <Modal
        open={modalOpen}
        onRequestClose={() => handleOnClose()}
        title="Editing responsibility set"
        actions={actions}
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
            onChange={(e, value) => {
              this.setState({
                responsibilitySet: {
                  ...this.state.responsibilitySet,
                  name: value
                }
              });
            }}
            style={{ marginTop: -25 }}
          />
          <SelectField
            hintText="Code space"
            floatingLabelText="Code space"
            disabled={true}
            value={responsibilitySet.codeSpace}
            onChange={(e, index, value) => {
              this.setState({
                responsibilitySet: {
                  ...this.state.responsibilitySet,
                  codeSpace: value
                }
              });
            }}
            fullWidth={true}
            style={{ marginTop: -15 }}
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
            disabled={true}
            value={responsibilitySet.privateCode}
            errorText={
              isLegalPrivateCode ? '' : 'This private code is already taken!'
            }
            fullWidth={true}
            onChange={(e, value) => {
              this.setState({
                responsibilitySet: {
                  ...this.state.responsibilitySet,
                  privateCode: value.trim()
                }
              });
            }}
            errorStyle={{ float: 'right' }}
            style={{ marginBottom: 10, marginTop: -15 }}
          />
          <div style={{ minWidth: '100%', fontSize: 10, marginTop: -10 }}>
            <div style={{ width: '100%', fontSize: 10 }}>
              Responsibility roles *
            </div>
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
                size="large"
              >
                <MdAdd color="#228B22" />
              </IconButton>
              <IconButton
                onClick={this.handleRemoveRole.bind(this)}
                size="large"
              >
                <MdRemove color="#cc0000" />
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

export default withAuth(ModalEditResponsibilitySet);
