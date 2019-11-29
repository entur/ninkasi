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

import React from "react";
import ModalDialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import ResponsiblitySetList from "./ResponsiblitySetList";
import UserRespSetPopover from "./UserRespSetPopover";

const initialState = {
  user: {
    username: "",
    organisationRef: "",
    responsibilitySetRefs: [],
    contactDetails: {
      email: "",
      phone: "",
      firstName: "",
      lastName: ""
    }
  },
  isAddingResponsibilitySet: false,
  temptResponsibilitySet: "",
  addRespAnchorEl: null,
  emailValid: true,
  originalUsername: "",
  usernameValid: true
};

class ModalEditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.setState({
      user: {
        ...this.state.user,
        ...this.props.user
      },
      originalUsername: this.props.user.username
    });
  }

  handleOnClose() {
    this.setState(initialState);
    this.props.handleCloseModal();
  }

  handleChangeUsername(e, value) {
    const isValid = this.validateBy("USERNAME", value);
    this.setState(prevState => ({
      user: { ...prevState.user, username: value },
      usernameValid: isValid
    }));
  }

  handleChangeEmail(e, value) {
    const { user } = this.state;
    const isValid = this.validateBy("EMAIL", value);
    this.setState({
      emailValid: isValid,
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
      temptResponsibilitySet: ""
    });
  }

  validateBy(type, value) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRe = /^[a-zA-Z-. ]*$/;

    if (type === "EMAIL") {
      return emailRe.test(value);
    }

    if (type === "USERNAME") {
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
      organizations,
      responsibilities
    } = this.props;

    const {
      user,
      isAddingResponsibilitySet,
      usernameValid,
      emailValid,
      emailIsTaken,
      originalUsername
    } = this.state;

    const disableUpdate = !usernameValid || !emailValid;

    const actions = [
      <FlatButton label="Cancel" onClick={() => this.handleOnClose()} />,
      <FlatButton
        disabled={disableUpdate}
        label="Update"
        primary={true}
        onClick={() => handleSubmit(user)}
      />
    ];

    return (
      <ModalDialog
        open={isModalOpen}
        actions={actions}
        onRequestClose={() => this.handleOnClose()}
        title={"Editing user " + originalUsername}
        contentStyle={{ width: "40%" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <TextField
            hintText="Username"
            floatingLabelText="Username"
            value={user.username}
            errorText={
              !usernameValid &&
              "Username can only include alphanumerics, hyphens and dot"
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
                ? "E-mail already taken"
                : !emailValid
                ? "Must be a valid e-mail"
                : ""
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

export default ModalEditUser;
