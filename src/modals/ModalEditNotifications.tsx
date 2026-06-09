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

import { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Fab } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';
import { addedNewUserNotification } from 'reducers/OrganizationReducer';
import NotificationTypeBox from './NotificationTypeBox';

interface ModalEditNotificationsProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  user: { username: string };
  // Legacy prop, ignored — kept for compat with callers still passing it.
  getToken?: () => Promise<string | undefined>;
}

const ModalEditNotifications = ({
  isModalOpen,
  handleCloseModal,
  user,
}: ModalEditNotificationsProps) => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();
  const userNotifications = useAppSelector(
    (state: any) => state.OrganizationReducer.userNotifications
  );
  const isLoading = useAppSelector(
    (state: any) => state.OrganizationReducer.userNotificationsLoading
  );

  const [indexExpanded, setIndexExpanded] = useState<number | null>(null);

  useEffect(() => {
    dispatch(OrganizationRegisterActions.getUserNotifications(user.username, getToken));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExpandItem = (index: number, value: boolean) => {
    setIndexExpanded(value ? index : null);
  };

  const handleUpdate = async () => {
    await dispatch(OrganizationRegisterActions.updateUserNotification(user.username, getToken));
    handleCloseModal();
  };

  const handleAddNewUserNotification = () => {
    dispatch(addedNewUserNotification());
    setIndexExpanded(userNotifications.length);
  };

  const shouldUpdateBtnBeDisabled = () => {
    if (userNotifications === null) return true;

    return userNotifications.some((un: any) => {
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
  };

  const messageStyle: React.CSSProperties = {
    fontSize: 13,
    width: '100%',
    paddingBottom: 10,
    marginLeft: 10,
    fontStyle: 'italic',
  };

  const updateDisabled = shouldUpdateBtnBeDisabled();

  const actions = [
    <Button key="cancel" variant="text" style={{ marginLeft: 10 }} onClick={handleCloseModal}>
      Cancel
    </Button>,
    <Button
      key="update"
      variant="text"
      disabled={updateDisabled}
      style={{ marginLeft: 10 }}
      onClick={handleUpdate}
    >
      Update
    </Button>,
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
            userNotifications.map((un: any, i: number) => (
              <NotificationTypeBox
                index={i}
                key={'notificationTypeBox-' + i}
                notification={un}
                handleExpand={handleExpandItem}
                expanded={indexExpanded === i}
              />
            ))}
          {isLoading && <div style={messageStyle}>Loading ...</div>}
          {!isLoading && !userNotifications.length && (
            <div style={messageStyle}>No notification configuration found for this user</div>
          )}
        </div>
        <Fab size="small" style={{ margin: 10 }} onClick={handleAddNewUserNotification}>
          <Add />
        </Fab>
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default ModalEditNotifications;
