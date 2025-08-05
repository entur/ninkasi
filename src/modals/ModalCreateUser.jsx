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
import ModalDialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ResponsiblitySetList from './ResponsiblitySetList';
import UserRespSetPopover from './UserRespSetPopover';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@material-ui/core';

const initialState = {
  user: {
    username: '',
    organisationRef: '',
    responsibilitySetRefs: [],
    contactDetails: {
      email: '',
      phone: '',
      firstName: '',
      lastName: ''
    },
    personalAccount: true
  },
  isAddingResponsibilitySet: false,
  temptResponsibilitySet: '',
  usernamevalid: false,
  emailValid: false,
  emailIsTaken: false,
  addRespAnchorEl: null
};

class ModalCreateUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleOnClose() {
    this.setState(initialState);
    this.props.handleCloseModal();
  }

  handleChangeUsername(e, value) {
    const isValid = this.validateBy('USERNAME', value);
    this.setState(prevState => ({
      user: { ...prevState.user, username: value },
      usernameValid: isValid
    }));
  }

  handleChangeEmail(e, value) {
    const { takenEmails } = this.props;
    const { user } = this.state;
    const emailIsTaken = takenEmails.indexOf(value.toLowerCase()) > -1;
    const isValid = this.validateBy('EMAIL', value);
    this.setState({
      emailValid: isValid,
      emailIsTaken,
      user: {
        ...user,
        contactDetails: {
          ...user.contactDetails,
          email: value
        }
      }
    });
  }

  handleAddResponsibilitySet(temptResponsibilitySet) {
    const { user } = this.state;
    this.setState({
      ...this.state,
      isAddingResponsibilitySet: false,
      user: {
        ...user,
        responsibilitySetRefs: [
          ...user.responsibilitySetRefs,
          temptResponsibilitySet
        ]
      },
      temptResponsibilitySet: ''
    });
  }

  handleChangeIsPersonalAccount(value) {
    const { user } = this.state;
    this.setState({
      ...this.state,
      user: {
        ...user,
        personal_account: value === 'personal_account'
      }
    });
  }

  validateBy(type, value) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRe = /^[a-zA-Z-. ]*$/;

    if (type === 'EMAIL') {
      return emailRe.test(value);
    }

    if (type === 'USERNAME') {
      return usernameRe.test(value);
    }
  }

  isUserRequiredFieldsProvided() {
    const { user } = this.state;
    if (user) {
      const { contactDetails } = user;
      return (
        user.username &&
        user.organisationRef &&
        contactDetails &&
        contactDetails.email &&
        contactDetails.firstName &&
        contactDetails.lastName
      );
    }
    return false;
  }

  removeResponsibilitySet(index) {
    if (index > -1) {
      this.setState({
        user: {
          ...this.state.user,
          responsibilitySetRefs: [
            ...this.state.user.responsibilitySetRefs.slice(0, index),
            ...this.state.user.responsibilitySetRefs.slice(index + 1)
          ]
        }
      });
    }
  }

  render() {
    const {
      isModalOpen,
      handleSubmit,
      takenUsernames,
      organizations,
      responsibilities
    } = this.props;

    const {
      user,
      isAddingResponsibilitySet,
      usernameValid,
      emailValid,
      emailIsTaken
    } = this.state;

    const invalidPrivateCode = takenUsernames.indexOf(user.username) > -1;
    const disableCreate =
      invalidPrivateCode ||
      !this.isUserRequiredFieldsProvided() ||
      !usernameValid ||
      !emailValid ||
      emailIsTaken;

    const actions = [
      <FlatButton label="Cancel" onClick={() => this.handleOnClose()} />,
      <FlatButton
        disabled={disableCreate}
        label="Create"
        primary={true}
        onClick={() => handleSubmit(user)}
      />
    ];

    return (
      <ModalDialog
        open={isModalOpen}
        actions={actions}
        onRequestClose={() => this.handleOnClose()}
        title="Creating a new user"
        contentStyle={{ width: '40%' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <FormControl>
            <RadioGroup
              defaultValue="personal_account"
              value={
                user.personalAccount
                  ? 'personal_account'
                  : 'notification_account'
              }
              onChange={(e, value) => this.handleChangeIsPersonalAccount(value)}
            >
              <FormControlLabel
                value="personal_account"
                control={<Radio />}
                label="Personal account"
              />
              <FormControlLabel
                value="notification_account"
                control={<Radio />}
                label="Notification account"
              />
            </RadioGroup>
          </FormControl>
          <TextField
            hintText="Username"
            floatingLabelText="Username"
            value={user.username}
            errorText={
              !usernameValid &&
              'Username can only include alphanumerics, hyphens and dot'
            }
            onChange={this.handleChangeUsername.bind(this)}
            fullWidth={true}
          />
          <TextField
            hintText="First name"
            floatingLabelText="First name"
            value={user.contactDetails.firstName}
            onChange={(e, value) =>
              this.setState({
                user: {
                  ...user,
                  contactDetails: {
                    ...user.contactDetails,
                    firstName: value
                  }
                }
              })
            }
            fullWidth={true}
          />
          <TextField
            hintText="Last name"
            floatingLabelText="Last name"
            value={user.contactDetails.lastName}
            onChange={(e, value) =>
              this.setState({
                user: {
                  ...user,
                  contactDetails: {
                    ...user.contactDetails,
                    lastName: value
                  }
                }
              })
            }
            fullWidth={true}
          />
          <TextField
            hintText="E-mail"
            floatingLabelText="E-mail"
            errorText={
              emailIsTaken
                ? 'E-mail already taken'
                : !emailValid
                ? 'Must be a valid e-mail'
                : ''
            }
            value={user.contactDetails.email}
            onChange={this.handleChangeEmail.bind(this)}
            fullWidth={true}
          />
          <TextField
            hintText="Phonenumber"
            floatingLabelText="Phonenumber"
            value={user.contactDetails.phone}
            onChange={(e, value) =>
              this.setState({
                user: {
                  ...user,
                  contactDetails: {
                    ...user.contactDetails,
                    phone: value
                  }
                }
              })
            }
            fullWidth={true}
          />
          <SelectField
            hintText="Organization"
            floatingLabelText="Organization"
            value={user.organisationRef}
            onChange={(e, index, value) =>
              this.setState({
                user: { ...user, organisationRef: value }
              })
            }
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
          <UserRespSetPopover
            responsibilities={responsibilities}
            addedRespSets={this.state.user.responsibilitySetRefs}
            anchorEl={this.state.addRespAnchorEl}
            handleAdd={this.handleAddResponsibilitySet.bind(this)}
            handleClose={() =>
              this.setState({ isAddingResponsibilitySet: false })
            }
            open={isAddingResponsibilitySet}
          />
          <ResponsiblitySetList
            user={user}
            responsiblities={responsibilities}
            handleAdd={e =>
              this.setState({
                isAddingResponsibilitySet: true,
                addRespAnchorEl: e.currentTarget
              })
            }
            handleRemove={this.removeResponsibilitySet.bind(this)}
          />
        </div>
      </ModalDialog>
    );
  }
}

export default ModalCreateUser;
