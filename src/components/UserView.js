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
import "../sass/views/userView.scss";
import MdEdit from "material-ui/svg-icons/image/edit";
import MdDelete from "material-ui/svg-icons/action/delete";
import MdNotification from "material-ui/svg-icons/social/notifications";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import OrganizationRegisterActions from "../actions/OrganizationRegisterActions";
import ModalCreateUser from "../modals/ModalCreateUser";
import ModalEditUser from "../modals/ModalEditUser";
import ModalEditNotifications from "../modals/ModalEditNotifications";
import { connect } from "react-redux";
import { sortUsersby } from "../utils/index";
import ModalConfirmation from "../modals/ModalConfirmation";
import ForgotPassword from "../static/icons/ForgotPassword";
import ModalNewPassword from "../modals/ModalNewPassword";
import NotificationStatus from "./NotificationStatus";
import OrganizationFilter from "./OrganizationFilter";

class UserView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreateModalOpen: false,
      organisationFilterId: -1,
      isEditModalOpen: false,
      isNotificationsOpen: false,
      isDeleteConfirmationOpen: false,
      isResetConfirmationOpen: false,
      activeUser: null,
      sortOrder: {
        column: "username",
        asc: true
      }
    };
  }

  componentDidMount() {
    this.props.dispatch(OrganizationRegisterActions.getUsers());
    this.props.dispatch(OrganizationRegisterActions.getOrganizations());
    this.props.dispatch(OrganizationRegisterActions.getResponbilitySets());
  }

  handleCreateUser(user) {
    this.props.dispatch(OrganizationRegisterActions.createUser(user));
  }

  handleUpdateUser(user) {
    this.props.dispatch(OrganizationRegisterActions.updateUser(user));
  }

  handleDeleteUser(user) {
    this.handleCloseDeleteConfirmation();
    this.props.dispatch(OrganizationRegisterActions.deleteUser(user.id));
  }

  handleResetPassword(user) {
    this.props.dispatch(
      OrganizationRegisterActions.resetPassword(user.id, user.username)
    );
    this.handleCloseResetConfirmation();
  }

  handleCloseDeleteConfirmation() {
    this.setState({
      activeuser: null,
      isDeleteConfirmationOpen: false
    });
  }

  handleCloseResetConfirmation() {
    this.setState({
      activeuser: null,
      isResetConfirmationOpen: false
    });
  }

  handleOpenDeleteConfirmationDialog(activeUser) {
    this.setState({
      activeUser,
      isDeleteConfirmationOpen: true
    });
  }

  handleOpenResetConfirmationDialog(activeUser) {
    this.setState({
      activeUser,
      isResetConfirmationOpen: true
    });
  }

  getDeleteConfirmationTitle() {
    const { activeUser } = this.state;
    let username = activeUser ? activeUser.username : "N/A";
    return `Delete user ${username}`;
  }

  getResetPasswordConfirmationTitle() {
    const { activeUser } = this.state;
    let username = activeUser ? activeUser.username : "N/A";
    return `Reset password for ${username}`;
  }

  filterUserByOrg(user) {
    const { organisationFilterId } = this.state;
    if (organisationFilterId === -1) return true;
    const organizationId = user.organisation ? user.organisation.id : null;
    return organisationFilterId === organizationId;
  }

  handleSortOrder(column) {
    const { sortOrder } = this.state;
    let asc = true;

    if (sortOrder.column === column) {
      asc = !sortOrder.asc;
    }

    this.setState({
      sortOrder: {
        column,
        asc
      }
    });
  }

  openModal(activeUser, attribute) {
    this.setState({
      activeUser,
      [attribute]: true
    });
  }

  componentWillReceiveProps(nextProps) {
    const { isCreateModalOpen, isEditModalOpen } = this.state;
    if (
      nextProps.status &&
      nextProps.status.error === null &&
      (isCreateModalOpen || isEditModalOpen)
    ) {
      this.setState({
        isCreateModalOpen: false,
        isEditModalOpen: false
      });
    }
  }

  render() {
    const {
      users,
      organizations,
      responsibilities,
      passwordDialogState
    } = this.props;
    const {
      isCreateModalOpen,
      isEditModalOpen,
      isNotificationsOpen,
      sortOrder,
      organisationFilterId
    } = this.state;

    const sortedUsers = sortUsersby(users, sortOrder);
    const confirmDeleteTitle = this.getDeleteConfirmationTitle();
    const confirmResetTitle = this.getResetPasswordConfirmationTitle();

    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <OrganizationFilter
            organizations={organizations}
            handleOnChange={id => {
              this.setState({ organisationFilterId: id });
            }}
            organisationFilterId={organisationFilterId}
          />
          <FloatingActionButton mini={true} style={{ marginRight: 10 }}>
            <ContentAdd
              onClick={() => this.openModal(null, "isCreateModalOpen")}
            />
          </FloatingActionButton>
        </div>
        <div className="user-row">
          <div className="user-header">
            <div className="col-1-9">
              <span
                className="sortable"
                onClick={() => this.handleSortOrder("username")}
              >
                username
              </span>
            </div>
            <div className="col-1-9">
              <span
                className="sortable"
                onClick={() => this.handleSortOrder("firstName")}
              >
                firstname
              </span>
            </div>
            <div className="col-1-9">
              <span
                className="sortable"
                onClick={() => this.handleSortOrder("lastName")}
              >
                lastname
              </span>
            </div>
            <div className="col-1-8">
              <span
                className="sortable"
                onClick={() => this.handleSortOrder("email")}
              >
                e-mail
              </span>
            </div>
            <div className="col-1-9">
              <span
                className="sortable"
                onClick={() => this.handleSortOrder("organisation")}
              >
                organisation
              </span>
            </div>
            <div className="col-1-7">Responsiblity set</div>
            <div className="col-1-9">Notifications</div>
          </div>
          {sortedUsers.filter(this.filterUserByOrg.bind(this)).map(user => {
            return (
              <div
                key={"user-" + user.id}
                className="user-row-item"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div className="col-1-9">{user.username}</div>
                <div className="col-1-9">{user.contactDetails.firstName}</div>
                <div className="col-1-9">{user.contactDetails.lastName}</div>
                <div className="col-1-8">{user.contactDetails.email}</div>
                <div className="col-1-9">{user.organisation.name}</div>
                <div className="col-1-7">
                  <ul
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      listStyleType: "circle"
                    }}
                  >
                    {user.responsibilitySets
                      ? user.responsibilitySets.map((resp, i) => (
                          <li key={resp.id}>{resp.name} </li>
                        ))
                      : null}
                  </ul>
                </div>
                <div className="col-1-11">
                  {user.notifications.map((notification, i) => (
                    <NotificationStatus
                      key={"notification-" + i}
                      notification={notification}
                    />
                  ))}
                </div>
                <div className="col-icon">
                  <MdEdit
                    color="rgba(25, 118, 210, 0.59)"
                    style={{
                      height: 20,
                      marginRight: 4,
                      width: 20,
                      verticalAlign: "middle",
                      cursor: "pointer"
                    }}
                    onClick={() => this.openModal(user, "isEditModalOpen")}
                  />
                  <MdNotification
                    color="rgba(25, 118, 210, 0.59)"
                    style={{
                      marginLeft: 4,
                      height: 20,
                      width: 20,
                      marginRight: 4,
                      verticalAlign: "middle",
                      cursor: "pointer"
                    }}
                    onClick={() => this.openModal(user, "isNotificationsOpen")}
                  />
                  <ForgotPassword
                    style={{
                      height: 20,
                      width: 20,
                      marginRight: 4,
                      verticalAlign: "middle",
                      cursor: "pointer",
                      marginTop: 4,
                      color: "orange"
                    }}
                    onClick={() => this.handleOpenResetConfirmationDialog(user)}
                  />
                  <MdDelete
                    color="#fa7b81"
                    style={{
                      height: 20,
                      width: 20,
                      marginRight: 10,
                      verticalAlign: "middle",
                      cursor: "pointer"
                    }}
                    onClick={() =>
                      this.handleOpenDeleteConfirmationDialog(user)
                    }
                  />
                </div>
              </div>
            );
          })}
          {isCreateModalOpen && (
            <ModalCreateUser
              isModalOpen={isCreateModalOpen}
              handleCloseModal={() =>
                this.setState({ isCreateModalOpen: false })
              }
              takenUsernames={users.map(user => user.username)}
              takenEmails={users.map(user => user.contactDetails.email)}
              organizations={organizations}
              responsibilities={responsibilities}
              handleSubmit={this.handleCreateUser.bind(this)}
            />
          )}
          {isEditModalOpen && (
            <ModalEditUser
              isModalOpen={isEditModalOpen}
              handleCloseModal={() => this.setState({ isEditModalOpen: false })}
              takenUsernames={users.map(user => user.username)}
              organizations={organizations}
              user={this.state.activeUser}
              responsibilities={responsibilities}
              handleSubmit={this.handleUpdateUser.bind(this)}
            />
          )}
          {isNotificationsOpen && (
            <ModalEditNotifications
              handleCloseModal={() =>
                this.setState({ isNotificationsOpen: false })
              }
              isModalOpen={isNotificationsOpen}
              user={this.state.activeUser}
            />
          )}
          <ModalConfirmation
            open={this.state.isDeleteConfirmationOpen}
            title={confirmDeleteTitle}
            actionBtnTitle="Delete"
            body="You are about to delete current user. Are you sure?"
            handleSubmit={() => {
              this.handleDeleteUser(this.state.activeUser);
            }}
            handleClose={() => {
              this.handleCloseDeleteConfirmation();
            }}
          />
          <ModalConfirmation
            open={this.state.isResetConfirmationOpen}
            title={confirmResetTitle}
            body="You are about to reset password for current user. Are you sure?"
            actionBtnTitle="Reset"
            handleSubmit={() => {
              this.handleResetPassword(this.state.activeUser);
            }}
            handleClose={() => {
              this.handleCloseResetConfirmation();
            }}
          />
          <ModalNewPassword passwordDialogState={passwordDialogState} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.OrganizationReducer.users,
  organizations: state.OrganizationReducer.organizations,
  responsibilities: state.OrganizationReducer.responsibilities,
  status: state.OrganizationReducer.userStatus,
  passwordDialogState: state.OrganizationReducer.passwordDialog
});

export default connect(mapStateToProps)(UserView);
