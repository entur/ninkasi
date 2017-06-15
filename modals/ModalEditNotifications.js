import React from 'react';
import Modal from './Modal';
import { connect } from 'react-redux';
import MdClose from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions';
import NotificationTypeBox from './NotificationTypeBox';

class ModalEditNotifications extends React.Component {

  componentDidMount() {
    const { user, dispatch, eventFilterTypes, jobDomains, eventFilterStates, organizations } = this.props;
    dispatch(OrganizationRegisterActions.getUserNotifications(user.username));

    if (!eventFilterTypes.length) {
      this.props.dispatch(OrganizationRegisterActions.getEventFilterTypes());
    }

    if (!jobDomains.length) {
      this.props.dispatch(OrganizationRegisterActions.getJobDomains());
    }

    if (!eventFilterStates.length) {
      this.props.dispatch(OrganizationRegisterActions.getEventFilterStates());
    }

    if (!organizations.length) {
      this.props.dispatch(OrganizationRegisterActions.getOrganizations());
    }
  }

  render() {
    const {
      isModalOpen,
      handleCloseModal,
      user,
      userNotifications
    } = this.props;
    const titleStyle = {
      fontSize: '1.8em',
      fontWeight: 600,
      margin: '10px auto',
      width: '80%'
    };

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
              Updating notifications for {user.username}
            </div>
            <MdClose
              style={{ marginRight: 10, cursor: 'pointer' }}
              onClick={() => handleCloseModal()}
            />
          </div>
          {userNotifications.map((un, i) =>
            <NotificationTypeBox
              index={i}
              key={'notificationTypeBox-' + i}
              notification={un}
            />
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginRight: 15
          }}
        >
          <div style={{ fontSize: 12, marginLeft: 15 }} />
          <RaisedButton label="Update" primary={true} />
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  userNotifications: state.OrganizationReducer.userNotifications,
  eventFilterTypes: state.OrganizationReducer.eventFilterTypes,
  jobDomains: state.OrganizationReducer.jobDomains,
  eventFilterStates: state.OrganizationReducer.eventFilterStates,
  organizations: state.OrganizationReducer.organizations
});

export default connect(mapStateToProps)(ModalEditNotifications);
