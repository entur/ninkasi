import React from 'react';
import Modal from './Modal';
import { connect } from 'react-redux';
import MdClose from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
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

    const titleStyle = {
      fontSize: '1.8em',
      fontWeight: 600,
      margin: '10px 5px',
      width: '100%'
    };

    const messageStyle = {
      fontSize: 13,
      width: '100%',
      paddingBottom: 10,
      marginLeft: 10,
      fontStyle: 'italic'
    };

    const updateDisabled = this.shouldUpdateBtnBeDisabled();

    return (
      <Modal
        isOpen={isModalOpen}
        onClose={() => handleCloseModal()}
        minWidth="35vw"
        minHeight="auto"
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={titleStyle}>
              Notification configurations for {user.username}
            </div>
            <MdClose
              style={{ marginRight: 10, cursor: 'pointer' }}
              onClick={() => handleCloseModal()}
            />
          </div>
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginRight: 15,
            fontSize: 12
          }}
        >
          <div>
            <RaisedButton
              label="Update"
              primary={true}
              disabled={updateDisabled}
              style={{ marginLeft: 10 }}
              onClick={this.handleUpdate.bind(this)}
            />
          </div>
          <div>
            <FloatingActionButton
              mini={true}
              style={{ float: 'right', marginRight: 10 }}
            >
              <ContentAdd
                onClick={this.handleAddNewUserNotification.bind(this)}
              />
            </FloatingActionButton>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  userNotifications: state.OrganizationReducer.userNotifications,
  eventFilterTypes: state.OrganizationReducer.eventFilterTypes,
  isLoading: state.OrganizationReducer.userNotificationsLoading
});

export default connect(mapStateToProps)(ModalEditNotifications);
