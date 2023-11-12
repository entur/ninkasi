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
import Button from '@mui/material/Button';
import SelectField from '@mui/material/SelectField';
import MenuItem from '@mui/material/MenuItem';

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
      <Button variant="text" label="Cancel" onClick={handleCloseModal} />,
      <Button
        variant="text"
        disabled={isOrganizationNameTaken || isOrganizationPrivateCodeTaken}
        label="Create"
        onClick={() => handleSubmit(organization)}
      />
    ];

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
              })
            }
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
              })
            }
            fullWidth={true}
          />
          <SelectField
            hintText="Organization type"
            floatingLabelText="Organization type"
            value={organization.organisationType}
            onChange={(e, index, value) =>
              this.setState({
                organization: { ...organization, organisationType: value }
              })
            }
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
              })
            }
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
        </div>
      </Modal>
    );
  }
}

export default ModalCreateOrganization;
