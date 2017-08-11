import React, { Component, PropTypes } from 'react';
import Modal from './Modal';
import TextField from 'material-ui/TextField';
import MdClose from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ResponsiblitySetList from './ResponsiblitySetList';

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
    }
  },
  isAddingResponsibilitySet: false,
  temptResponsibilitySet: '',
  usernamevalid: false,
  emailValid: false,
  emailIsTaken: false,
};

class ModalCreateUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentWillUnmount() {
    this.state = initialState;
  }

  handleOnClose() {
    this.setState(initialState);
    this.props.handleCloseModal();
  }

  handleChangeUsername(e, value) {
    const isValid = this.validateBy('USERNAME', value);
    this.setState(prevState => (
      { user: { ...prevState.user, username: value },
        usernameValid: isValid
      }
    ));
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

  handleAddResponsibilitySet() {
    const { user, temptResponsibilitySet } = this.state;
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
      temptResponsibilitySet,
      usernameValid,
      emailValid,
      emailIsTaken
    } = this.state;

    const titleStyle = {
      fontSize: '2em',
      fontWeight: 600,
      margin: '10px auto',
      width: '80%'
    };

    const invalidPrivateCode = takenUsernames.indexOf(user.username) > -1;
    const disableCreate =
      invalidPrivateCode || !this.isUserRequiredFieldsProvided() || !usernameValid || !emailValid || emailIsTaken;

    console.log("emailIsTaken", emailIsTaken);

    return (
      <Modal
        isOpen={isModalOpen}
        onClose={() => this.handleOnClose()}
        minWidth="35vw"
        minHeight="auto"
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={titleStyle}>Creating a new user</div>
            <MdClose
              style={{ marginRight: 10, cursor: 'pointer' }}
              onClick={() => this.handleOnClose()}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '80%',
                marginTop: '20px'
              }}
            >
              <TextField
                hintText="Username"
                floatingLabelText="Username"
                value={user.username}
                errorText={!usernameValid && 'Username can only include alphanumerics, hyphens and dot'}
                onChange={this.handleChangeUsername.bind(this)}
                fullWidth={true}
                style={{ marginTop: -30 }}
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
                  })}
                fullWidth={true}
                style={{ marginTop: 0 }}
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
                  })}
                fullWidth={true}
                style={{ marginTop: -25 }}
              />
              <TextField
                hintText="E-mail"
                floatingLabelText="E-mail"
                errorText={emailIsTaken ? 'E-mail already taken' : !emailValid ? 'Must be a valid e-mail' : ''}
                value={user.contactDetails.email}
                onChange={this.handleChangeEmail.bind(this)}
                fullWidth={true}
                style={{ marginTop: -10 }}
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
                  })}
                fullWidth={true}
                style={{ marginTop: 0 }}
              />
              <SelectField
                hintText="Organization"
                floatingLabelText="Organization"
                value={user.organisationRef}
                onChange={(e, index, value) =>
                  this.setState({
                    user: { ...user, organisationRef: value }
                  })}
                fullWidth={true}
                style={{ marginTop: -10 }}
              >
                {organizations.map(org =>
                  <MenuItem
                    key={org.id}
                    id={org.id}
                    value={org.id}
                    label={org.name}
                    primaryText={org.name}
                  />
                )}
              </SelectField>
              <ResponsiblitySetList
                user={user}
                responsiblities={responsibilities}
                handleAdd={() =>
                  this.setState({ isAddingResponsibilitySet: true })}
                handleRemove={this.removeResponsibilitySet.bind(this)}
              />
              {isAddingResponsibilitySet
                ? <div style={{ border: '1px dotted', width: '100%' }}>
                    <div
                      style={{
                        fontSize: 12,
                        textAlign: 'center',
                        fontWeight: 600
                      }}
                    >
                      New responsibility set
                    </div>
                    <SelectField
                      hintText="Responsibility set"
                      floatingLabelText="Responsibility set"
                      value={temptResponsibilitySet}
                      onChange={(e, index, value) =>
                        this.setState({
                          temptResponsibilitySet: value
                        })}
                      fullWidth={true}
                      style={{ marginTop: -10 }}
                    >
                      {responsibilities
                        .filter(r => r.id)
                        .map(r =>
                          <MenuItem
                            key={r.id}
                            id={r.id}
                            value={r.id}
                            label={r.name}
                            primaryText={r.name}
                          />
                        )}
                    </SelectField>
                    <FlatButton
                      label="Add"
                      style={{ width: '100%' }}
                      onClick={this.handleAddResponsibilitySet.bind(this)}
                    />
                  </div>
                : null}
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
              disabled={disableCreate}
              label="Create"
              primary={true}
              onClick={() => handleSubmit(user)}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalCreateUser;
