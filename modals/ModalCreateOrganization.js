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
  }
};

class ModalCreateOrganization extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleOnClose() {
    this.setState(initialState);
    this.props.handleCloseModal();
  }

  componentWillUnmount() {
    this.state = initialState;
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

    const { organization } = this.state;

    const isOrganizationNameTaken =
      takenOrganizationNames.indexOf(organization.name) > -1;
    const isOrganizationPrivateCodeTaken =
      takenOrganizationPrivateCodes.indexOf(organization.privateCode) > -1;

    const actions = [
      <FlatButton
        label="Cancel"
        onClick={handleCloseModal}
      />,
      <FlatButton
        disabled={isOrganizationNameTaken || isOrganizationPrivateCodeTaken}
        label="Create"
        onClick={ () => handleSubmit(organization)}
      />
    ]

    return (
      <Modal
        open={isModalOpen}
        contentStyle={{ width: '30%' }}
        title="Create a new organisation"
        actions={actions}
        requestClose={() => this.handleOnClose()}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
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
            onChange={(e, value) =>
              this.setState({
                organization: { ...organization, privateCode: value }
              })}
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
            onChange={(e, index, value) =>
              this.setState({
                organization: { ...organization, codeSpace: value }
              })}
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

export default ModalCreateOrganization;
