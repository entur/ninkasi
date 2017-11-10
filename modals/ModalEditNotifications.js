import React from 'react';
import ModalDialog from 'material-ui/Dialog';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions';
import NotificationTypeBox from './NotificationTypeBox';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

class ModalEditNotifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indexExpanded: null
    };
  }

  componentDidMount() {
    const { user, dispatch } = this.props;
    dispatch(OrganizationRegisterActions.getUserNotifications(user.username));
  }

  handleExpandItem(index, value) {
    this.setState({
      indexExpanded: value ? index : null
    });
  }

  handleUpdate() {
    const { user, dispatch } = this.props;
    dispatch(OrganizationRegisterActions.updateUserNotification(user.username));
  }

  handleAddNewUserNotification() {
    const { userNotifications, dispatch } = this.props;
    dispatch(OrganizationRegisterActions.addNewUserNotification());
    this.setState({
      indexExpanded: userNotifications.length
    });
  }

  shouldUpdateBtnBeDisabled() {
    const { userNotifications } = this.props;
    if (userNotifications === null) return true;

    return userNotifications.some(un => {
      if (un.eventFilter.type === 'JOB') {
        if (!un.eventFilter.actions || !un.eventFilter.states) {
          return true;
        }

        return !(un.eventFilter.actions.length && un.eventFilter.states.length);
      }

      if (un.eventFilter.type === 'CRUD') {
        if (!un.eventFilter.entityClassificationRefs) {
          return true;
        }

        return !un.eventFilter.entityClassificationRefs.length;
      }

      return false;
    });
  }

  render() {
    const {
      isModalOpen,
      handleCloseModal,
      user,
      userNotifications,
      isLoading
    } = this.props;

    const messageStyle = {
      fontSize: 13,
      width: '100%',
      paddingBottom: 10,
      marginLeft: 10,
      fontStyle: 'italic'
    };

    const updateDisabled = this.shouldUpdateBtnBeDisabled();

    const actions = [
      <FlatButton
        label="Cancel"
        style={{ marginLeft: 10 }}
        onClick={handleCloseModal}
      />,
      <FlatButton
        label="Update"
        disabled={updateDisabled}
        style={{ marginLeft: 10 }}
        onClick={this.handleUpdate.bind(this)}
      />
    ];

    return (
      <ModalDialog
        open={isModalOpen}
        actions={actions}
        requestOnClose={handleCloseModal}
        title={'Notification configurations for ' + user.username}
      >
        <div>
          {!isLoading &&
            !!userNotifications.length &&
            userNotifications.map((un, i) =>
              <NotificationTypeBox
                index={i}
                key={'notificationTypeBox-' + i}
                notification={un}
                handleExpand={this.handleExpandItem.bind(this)}
                expanded={this.state.indexExpanded === i}
              />
            )}
          {isLoading && <div style={messageStyle}>Loading ...</div>}
          {!isLoading &&
            !userNotifications.length &&
            <div style={messageStyle}>
              No notification configuration found for this user
            </div>}
        </div>
        <FloatingActionButton
          mini={true}
          style={{ margin: 10 }}
        >
          <ContentAdd
            onClick={this.handleAddNewUserNotification.bind(this)}
          />
        </FloatingActionButton>
      </ModalDialog>
    );
  }
}

const mapStateToProps = state => ({
  userNotifications: state.OrganizationReducer.userNotifications,
  eventFilterTypes: state.OrganizationReducer.eventFilterTypes,
  isLoading: state.OrganizationReducer.userNotificationsLoading
});

export default connect(mapStateToProps)(ModalEditNotifications);
