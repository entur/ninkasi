import React from 'react';
import Modal from './Modal';
import TextField from 'material-ui/TextField';
import MdClose from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
import MdRemove from 'material-ui/svg-icons/content/remove';
import MdAdd from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import NewRoleAssignment from './NewRoleAssignment';

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
    const responsibleAreaRefString = role.responsibleAreaRef
      ? 'responsibleAreaRef=' + role.responsibleAreaRef
      : '';

    return `ORG=${role.responsibleOrganisationRef}, type=${role.typeOfResponsibilityRoleRef}, zone=${responsibleAreaRefString}, entities=${this.getEntityClassAssignmentString(role.entityClassificationAssignments)}`;
  }


  getEntityClassAssignmentString(assignments) {
    if (!assignments || !assignments.length) return '';
    return assignments
      .map(({ allow, entityClassificationRef }) => {
        return (allow ? '' : '!') + entityClassificationRef;
      })
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
    const titleStyle = {
      fontSize: '2em',
      fontWeight: 600,
      margin: '10px auto',
      width: '80%'
    };

    const {
      isModalOpen,
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
      takenPrivateCodes.indexOf(responsibilitySet.privateCode) == -1;

    const isSavable = this.isSavable() && isLegalPrivateCode;

    return (
      <Modal
        isOpen={isModalOpen}
        onClose={() => handleOnClose()}
        minWidth="50vw"
        minHeight="auto"
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={titleStyle}>Creating a new responsibility set</div>
            <MdClose
              style={{ marginRight: 10, cursor: 'pointer' }}
              onClick={() => handleOnClose()}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '90%',
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
                {codeSpaces.map(codeSpace =>
                  <MenuItem
                    key={codeSpace.id}
                    id={codeSpace.id}
                    value={codeSpace.id}
                    label={codeSpace.id}
                    primaryText={codeSpace.xmlns}
                  />
                )}
              </SelectField>
              <TextField
                hintText="Private code"
                floatingLabelText="Private code"
                value={responsibilitySet.privateCode}
                errorText={
                  isLegalPrivateCode
                    ? ''
                    : 'This private code is already taken!'
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
                style={{ marginBottom: 10, marginTop: -15 }}
              />
              <div style={{ minWidth: '100%', fontSize: 10, marginTop: -10 }}>
                <div style={{ width: '100%', fontSize: 10 }}>
                  Responsibility roles *
                </div>
                <select
                  multiple="multiple"
                  style={{
                    overflowX: 'scroll',
                    fontSize: 10,
                    maxWidth: '45vw',
                    minWidth: '45vw'
                  }}
                  ref="roles"
                >
                  {responsibilitySet.roles.map((role, i) =>
                    <option key={'role-' + i}>
                      {this.getRoleString(role)}
                    </option>
                  )}
                </select>
                <div>
                  <IconButton
                    onClick={() => this.setState({ isCreatingNewRole: true })}
                  >
                    <MdAdd color="#228B22" />
                  </IconButton>
                  <IconButton onClick={this.handleRemoveRole.bind(this)}>
                    <MdRemove color="#cc0000" />
                  </IconButton>
                </div>
                {isCreatingNewRole
                  ? <NewRoleAssignment
                      newRole={newRole}
                      roles={roles}
                      entityTypes={entityTypes}
                      organizations={organizations}
                      handleAddRole={this.handleAddRole.bind(this)}
                      administrativeZones={this.props.administrativeZones}
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
                        })}
                      organisationChange={(e, index, value) =>
                        this.setState({
                          ...this.state,
                          newRole: {
                            ...newRole,
                            responsibleOrganisationRef: value
                          }
                        })}
                      entityTypeChange={(e, index, value) =>
                        this.setState({
                          ...this.state,
                          newRole: {
                            ...newRole,
                            typeOfResponsibilityRoleRef: value
                          }
                        })}
                    />
                  : null}
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginRight: 15
            }}
          >
            <div style={{ fontSize: 12, marginLeft: 15 }} />
            <RaisedButton
              disabled={!isSavable}
              label="Create"
              primary={true}
              onClick={() => handleSubmit(this.state.responsibilitySet)}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

export default connect(null)(ModalCreateResponsibilitySet);
