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
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Select, MenuItem } from '@mui/material';
import ResponsiblitySetList from './ResponsiblitySetList';
import UserRespSetPopover from './UserRespSetPopover';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const initialState = {
  user: {
    username: '',
    organisationRef: '',
    responsibilitySetRefs: [],
    contactDetails: {
      email: '',
      phone: '',
      firstName: '',
      lastName: '',
    },
    personalAccount: true,
  },
  isAddingResponsibilitySet: false,
  temptResponsibilitySet: '',
  usernamevalid: false,
  emailValid: false,
  emailIsTaken: false,
  addRespAnchorEl: null,
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
      usernameValid: isValid,
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
          email: value,
        },
      },
    });
  }

  handleAddResponsibilitySet(temptResponsibilitySet) {
    const { user } = this.state;
    this.setState({
      ...this.state,
      isAddingResponsibilitySet: false,
      user: {
        ...user,
        responsibilitySetRefs: [...user.responsibilitySetRefs, temptResponsibilitySet],
      },
      temptResponsibilitySet: '',
    });
  }

  handleChangeIsPersonalAccount(value) {
    const { user } = this.state;
    this.setState({
      ...this.state,
      user: {
        ...user,
        personalAccount: value === 'personal_account',
      },
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
            ...this.state.user.responsibilitySetRefs.slice(index + 1),
          ],
        },
      });
    }
  }

  render() {
    const { isModalOpen, handleSubmit, takenUsernames, organizations, responsibilities } =
      this.props;

    const { user, isAddingResponsibilitySet, usernameValid, emailValid, emailIsTaken } = this.state;

    const invalidPrivateCode = takenUsernames.indexOf(user.username) > -1;
    const disableCreate =
      invalidPrivateCode ||
      !this.isUserRequiredFieldsProvided() ||
      !usernameValid ||
      !emailValid ||
      emailIsTaken;

    const actions = [
      <Button variant="text" onClick={() => this.handleOnClose()}>
        Cancel
      </Button>,
      <Button
        variant="text"
        disabled={disableCreate}
        color="primary"
        onClick={() => handleSubmit(user)}
      >
        Create
      </Button>,
    ];

    return (
      <Dialog open={isModalOpen} onClose={() => this.handleOnClose()} maxWidth="md" fullWidth>
        <DialogTitle>Creating a new user</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div onClick={e => e.stopPropagation()}>
              <FormControl>
                <RadioGroup
                  defaultValue="personal_account"
                  value={user.personalAccount ? 'personal_account' : 'notification_account'}
                  onChange={e => {
                    e.stopPropagation();
                    this.handleChangeIsPersonalAccount(e.target.value);
                  }}
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
            </div>
            <TextField
              placeholder="Username"
              label="Username"
              value={user.username}
              error={!usernameValid && user.username}
              helperText={
                !usernameValid &&
                user.username &&
                'Username can only include alphanumerics, hyphens and dot'
              }
              onChange={e => this.handleChangeUsername(e, e.target.value)}
              fullWidth={true}
            />
            <TextField
              placeholder="First name"
              label="First name"
              value={user.contactDetails.firstName}
              onChange={e =>
                this.setState({
                  user: {
                    ...user,
                    contactDetails: {
                      ...user.contactDetails,
                      firstName: e.target.value,
                    },
                  },
                })
              }
              fullWidth={true}
            />
            <TextField
              placeholder="Last name"
              label="Last name"
              value={user.contactDetails.lastName}
              onChange={e =>
                this.setState({
                  user: {
                    ...user,
                    contactDetails: {
                      ...user.contactDetails,
                      lastName: e.target.value,
                    },
                  },
                })
              }
              fullWidth={true}
            />
            <TextField
              placeholder="E-mail"
              label="E-mail"
              error={emailIsTaken || (!emailValid && user.contactDetails.email)}
              helperText={
                emailIsTaken
                  ? 'E-mail already taken'
                  : !emailValid && user.contactDetails.email
                    ? 'Must be a valid e-mail'
                    : ''
              }
              value={user.contactDetails.email}
              onChange={e => this.handleChangeEmail(e, e.target.value)}
              fullWidth={true}
            />
            <TextField
              placeholder="Phonenumber"
              label="Phonenumber"
              value={user.contactDetails.phone}
              onChange={e =>
                this.setState({
                  user: {
                    ...user,
                    contactDetails: {
                      ...user.contactDetails,
                      phone: e.target.value,
                    },
                  },
                })
              }
              fullWidth={true}
            />
            <FormControl fullWidth>
              <Select
                value={user.organisationRef}
                onChange={e =>
                  this.setState({
                    user: { ...user, organisationRef: e.target.value },
                  })
                }
                displayEmpty
              >
                {organizations.map(org => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <UserRespSetPopover
              responsibilities={responsibilities}
              addedRespSets={this.state.user.responsibilitySetRefs}
              anchorEl={this.state.addRespAnchorEl}
              handleAdd={this.handleAddResponsibilitySet.bind(this)}
              handleClose={() => this.setState({ isAddingResponsibilitySet: false })}
              open={isAddingResponsibilitySet}
            />
            <ResponsiblitySetList
              user={user}
              responsiblities={responsibilities}
              handleAdd={e =>
                this.setState({
                  isAddingResponsibilitySet: true,
                  addRespAnchorEl: e.currentTarget,
                })
              }
              handleRemove={this.removeResponsibilitySet.bind(this)}
            />
          </div>
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    );
  }
}

export default ModalCreateUser;
