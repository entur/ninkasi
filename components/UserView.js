import React from 'react';
import '../sass/views/userView.scss';
import MdEdit from 'material-ui/svg-icons/image/edit';
import MdDelete from 'material-ui/svg-icons/action/delete';
import MdNotification from 'material-ui/svg-icons/social/notifications';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions';
import ModalCreateUser from '../modals/ModalCreateUser';
import ModalEditUser from '../modals/ModalEditUser';
import ModalEditNotifications from '../modals/ModalEditNotifications';
import { connect } from 'react-redux';
import { sortUsersby } from '../modals/utils';

class UserView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreateModalOpen: false,
      isEditModalOpen: false,
      isNotificationsOpen: false,
      activeUser: null,
      sortOrder: {
        column: null,
        asc: true
      }
    };
  }

  componentDidMount() {
    this.props.dispatch(OrganizationRegisterActions.getUsers());
    this.props.dispatch(OrganizationRegisterActions.getOrganizations());
    this.props.dispatch(OrganizationRegisterActions.getResponsibilities());
  }

  handleCreateUser(user) {
    this.props.dispatch(OrganizationRegisterActions.createUser(user));
  }

  handleUpdateUser(user) {
    this.props.dispatch(OrganizationRegisterActions.updateUser(user));
  }

  handleDeleteUser(user) {
    this.props.dispatch(OrganizationRegisterActions.deleteUser(user.id));
  }

  handleSortOrder(column) {
    const { sortOrder } = this.state;

    let asc = true;

    if (sortOrder.column == column) {
      if (sortOrder.asc) {
        asc = false;
      }
    }

    this.setState({
      sortOrder: {
        column,
        asc
      }
    });
  }

  openModalWindow(activeUser, attribute) {
    this.setState({
      activeUser,
      [attribute]: true
    });
    window.scrollTo(window.scrollX, 0);
  }

  componentWillReceiveProps(nextProps) {
    const { isCreateModalOpen, isEditModalOpen } = this.state;
    if (
      nextProps.status &&
      nextProps.status.error == null &&
      (isCreateModalOpen || isEditModalOpen)
    ) {
      this.setState({
        isCreateModalOpen: false,
        isEditModalOpen: false
      });
    }
  }

  render() {
    const { users, organizations, responsibilities } = this.props;
    const {
      isCreateModalOpen,
      isEditModalOpen,
      isNotificationsOpen,
      sortOrder
    } = this.state;

    const sortedUsers = sortUsersby(users, sortOrder);

    return (
      <div className="user-row">
        <div className="user-header">
          <div className="col-1-9">
            <span
              className="sortable"
              onClick={() => this.handleSortOrder('username')}
            >
              username
            </span>
          </div>
          <div className="col-1-9">
            <span
              className="sortable"
              onClick={() => this.handleSortOrder('firstName')}
            >
              firstname
            </span>
          </div>
          <div className="col-1-9">
            <span
              className="sortable"
              onClick={() => this.handleSortOrder('lastName')}
            >
              lastname
            </span>
          </div>
          <div className="col-1-8">
            <span
              className="sortable"
              onClick={() => this.handleSortOrder('email')}
            >
              e-mail
            </span>
          </div>
          <div className="col-1-9">
            <span
              className="sortable"
              onClick={() => this.handleSortOrder('organisation')}
            >
              organisation
            </span>
          </div>
          <div className="col-1-7">Responsiblity set</div>
        </div>
        {sortedUsers.map(user => {
          return (
            <div key={'user-' + user.id} className="user-row-item">
              <div className="col-1-9">{user.username}</div>
              <div className="col-1-9">{user.contactDetails.firstName}</div>
              <div className="col-1-9">{user.contactDetails.lastName}</div>
              <div className="col-1-8">{user.contactDetails.email}</div>
              <div className="col-1-9">{user.organisation.name}</div>
              <div className="col-1-7">
                <ul
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    listStyleType: 'circle'
                  }}
                >
                  {user.responsibilitySets
                    ? user.responsibilitySets.map((resp, i) =>
                        <li key={resp.id}>{resp.name} </li>
                      )
                    : null}
                </ul>
              </div>
              <div className="col-icon">
                <MdDelete
                  color="#fa7b81"
                  style={{
                    height: 20,
                    width: 20,
                    marginRight: 10,
                    verticalAlign: 'middle',
                    cursor: 'pointer'
                  }}
                  onClick={() => this.handleDeleteUser(user)}
                />
                <MdEdit
                  color="rgba(25, 118, 210, 0.59)"
                  style={{
                    height: 20,
                    width: 20,
                    verticalAlign: 'middle',
                    cursor: 'pointer'
                  }}
                  onClick={() => this.openModalWindow(user, 'isEditModalOpen')}
                />
                <MdNotification
                  color="rgba(25, 118, 210, 0.59)"
                  style={{
                    marginLeft: 4,
                    height: 20,
                    width: 20,
                    verticalAlign: 'middle',
                    cursor: 'pointer'
                  }}
                  onClick={() =>
                    this.openModalWindow(user, 'isNotificationsOpen')}
                />
              </div>
            </div>
          );
        })}
        <FloatingActionButton
          mini={true}
          style={{ float: 'right', marginRight: 10 }}
        >
          <ContentAdd
            onClick={() => this.setState({ isCreateModalOpen: true })}
          />
        </FloatingActionButton>
        {isCreateModalOpen &&
          <ModalCreateUser
            isModalOpen={isCreateModalOpen}
            handleCloseModal={() => this.setState({ isCreateModalOpen: false })}
            takenUsernames={users.map(user => user.username)}
            organizations={organizations}
            responsibilities={responsibilities}
            handleSubmit={this.handleCreateUser.bind(this)}
          />}
        {isEditModalOpen &&
          <ModalEditUser
            isModalOpen={isEditModalOpen}
            handleCloseModal={() => this.setState({ isEditModalOpen: false })}
            takenUsernames={users.map(user => user.username)}
            organizations={organizations}
            user={this.state.activeUser}
            responsibilities={responsibilities}
            handleSubmit={this.handleUpdateUser.bind(this)}
          />}
        {isNotificationsOpen &&
          <ModalEditNotifications
            handleCloseModal={() =>
              this.setState({ isNotificationsOpen: false })}
            isModalOpen={isNotificationsOpen}
            user={this.state.activeUser}
          />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.OrganizationReducer.users,
  organizations: state.OrganizationReducer.organizations,
  responsibilities: state.OrganizationReducer.responsibilities,
  status: state.OrganizationReducer.userStatus
});

export default connect(mapStateToProps)(UserView);
