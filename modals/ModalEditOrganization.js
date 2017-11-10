import React, { Component, PropTypes } from 'react';
import Modal from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const initialState = {
  organization: {
    name: '',
    organisationType: 'AUTHORITY',
    privateCode: '',
    codeSpace: ''
  },
  originalName: ''
};

class ModalEditOrganization extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentWillMount() {
    this.setState({
      organization: this.props.organization,
      originalName: this.props.organization.name
    });
  }

  render() {
    const {
      isModalOpen,
      handleSubmit,
      takenOrganizationNames,
      takenOrganizationPrivateCodes,
      codeSpaces,
      handleCloseModal
    } = this.props;

    const { organization, originalName } = this.state;

    const isOrganizationNameTaken =
      takenOrganizationNames.indexOf(organization.name) > -1 &&
      this.props.organization.name !== organization.name;

    const isOrganizationPrivateCodeTaken =
      takenOrganizationPrivateCodes.indexOf(organization.privateCode) > -1 &&
      this.props.organization.privateCode !== organization.privateCode;

    const actions = [
      <FlatButton label="Cancel" onClick={() => handleCloseModal()} />,
      <FlatButton
        disabled={isOrganizationNameTaken || isOrganizationPrivateCodeTaken}
        label="Update"
        onClick={() => handleSubmit(organization)}
      />
    ];

    return (
      <Modal
        open={isModalOpen}
        actions={actions}
        contentStyle={{ width: '30%' }}
        onRequestClose={() => handleCloseModal()}
        title={'Editing organisation ' + originalName}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <TextField
            hintText="Name"
            floatingLabelText="Name"
            errorText={
              isOrganizationNameTaken ? 'Organization name already exists' : ''
            }
            value={organization.name}
            onChange={(e, value) =>
              this.setState({
                organization: { ...organization, name: value }
              })}
            fullWidth={true}
          />
          <TextField
            hintText="Private code"
            floatingLabelText="Private code"
            errorText={
              isOrganizationPrivateCodeTaken
                ? 'Organization private code already exists'
                : ''
            }
            value={organization.privateCode}
            disabled={true}
            fullWidth={true}
          />
          <SelectField
            hintText="Organization type"
            floatingLabelText="Organization type"
            value={organization.organisationType}
            onChange={(e, index, value) =>
              this.setState({
                organization: { ...organization, organisationType: value }
              })}
            fullWidth={true}
          >
            <MenuItem
              id="menuItem"
              value="AUTHORITY"
              label="AUTHORITY"
              primaryText="AUTHORITY"
            />
          </SelectField>
          <SelectField
            hintText="Code space"
            floatingLabelText="Code space"
            value={organization.codeSpace}
            disabled={true}
            fullWidth={true}
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
        </div>
      </Modal>
    );
  }
}

export default ModalEditOrganization;
