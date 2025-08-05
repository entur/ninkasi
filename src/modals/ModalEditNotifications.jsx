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
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { connect } from 'react-redux';
import Button from '@mui/material/Button';
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';
import NotificationTypeBox from './NotificationTypeBox';
import { Fab } from '@mui/material';
import { Add } from '@mui/icons-material';

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

  async handleUpdate() {
    const { user, dispatch } = this.props;
    await dispatch(
      OrganizationRegisterActions.updateUserNotification(user.username)
    );
    this.props.handleCloseModal();
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
      <Button
        variant="text"
        style={{ marginLeft: 10 }}
        onClick={handleCloseModal}
      >
        Cancel
      </Button>,
      <Button
        variant="text"
        disabled={updateDisabled}
        style={{ marginLeft: 10 }}
        onClick={this.handleUpdate.bind(this)}
      >
        Update
      </Button>
    ];

    return (
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="notification-modal-title"
      >
        <DialogTitle id="notification-modal-title">
          {'Notification configurations for ' + user.username}
        </DialogTitle>
        <DialogContent>
          <div>
            {!isLoading &&
              !!userNotifications.length &&
              userNotifications.map((un, i) => (
                <NotificationTypeBox
                  index={i}
                  key={'notificationTypeBox-' + i}
                  notification={un}
                  handleExpand={this.handleExpandItem.bind(this)}
                  expanded={this.state.indexExpanded === i}
                />
              ))}
            {isLoading && <div style={messageStyle}>Loading ...</div>}
            {!isLoading && !userNotifications.length && (
              <div style={messageStyle}>
                No notification configuration found for this user
              </div>
            )}
          </div>
          <Fab
            size="small"
            style={{ margin: 10 }}
            onClick={this.handleAddNewUserNotification.bind(this)}
          >
            <Add />
          </Fab>
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  userNotifications: state.OrganizationReducer.userNotifications,
  eventFilterTypes: state.OrganizationReducer.eventFilterTypes,
  isLoading: state.OrganizationReducer.userNotificationsLoading
});

export default connect(mapStateToProps)(ModalEditNotifications);
