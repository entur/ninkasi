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
import { Edit, Delete, Notifications, Add } from '@mui/icons-material';
import { Box, Fab } from '@mui/material';
import ModalCreateUser from 'modals/ModalCreateUser';
import ModalEditUser from 'modals/ModalEditUser';
import ModalEditNotifications from 'modals/ModalEditNotifications';
import ModalConfirmation from 'modals/ModalConfirmation';
import NotificationStatus from '../NotificationStatus';
import OrganizationFilter from '../OrganizationFilter';
import { sortUsersby } from 'utils/index';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import {
  fetchUsers,
  fetchOrganizations,
  fetchResponsibilitySets,
} from 'reducers/OrganizationReducer';
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';

interface SortOrder {
  column: string;
  asc: boolean;
}

const UserView = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  const users = useAppSelector((state: any) => state.OrganizationReducer.users);
  const organizations = useAppSelector((state: any) => state.OrganizationReducer.organizations);
  const responsibilities = useAppSelector(
    (state: any) => state.OrganizationReducer.responsibilities
  );
  const status = useAppSelector((state: any) => state.OrganizationReducer.userStatus);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [organisationFilterId, setOrganisationFilterId] = useState<number | string>(-1);
  const [sortOrder, setSortOrder] = useState<SortOrder>({ column: 'username', asc: true });

  useEffect(() => {
    dispatch(fetchUsers(getToken));
    dispatch(fetchOrganizations(getToken));
    dispatch(fetchResponsibilitySets(getToken));
  }, [dispatch, getToken]);

  // Mirror componentWillReceiveProps: close create/edit modals on success.
  useEffect(() => {
    if (status && status.error === null && (isCreateModalOpen || isEditModalOpen)) {
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleCreateUser = (user: any) => {
    dispatch(OrganizationRegisterActions.createUser(user, getToken));
  };

  const handleUpdateUser = (user: any) => {
    dispatch(OrganizationRegisterActions.updateUser(user, getToken));
  };

  const handleCloseDeleteConfirmation = () => {
    setActiveUser(null);
    setIsDeleteConfirmationOpen(false);
  };

  const handleDeleteUser = (user: any) => {
    handleCloseDeleteConfirmation();
    dispatch(OrganizationRegisterActions.deleteUser(user.id, getToken));
  };

  const handleOpenDeleteConfirmationDialog = (user: any) => {
    setActiveUser(user);
    setIsDeleteConfirmationOpen(true);
  };

  const getDeleteConfirmationTitle = () => {
    const username = activeUser ? activeUser.username : 'N/A';
    return `Delete user ${username}`;
  };

  const filterUserByOrg = (user: any) => {
    if (organisationFilterId === -1) return true;
    const organizationId = user.organisation ? user.organisation.id : null;
    return organisationFilterId === organizationId;
  };
  /* Preserves original (buggy) behaviour: the <select> emits strings while -1
     remains a number, so the equality check above never matches once the user
     picks a real organisation. Migration intentionally keeps the prior logic. */

  const handleSortOrder = (column: string) => {
    let asc = true;
    if (sortOrder.column === column) {
      asc = !sortOrder.asc;
    }
    setSortOrder({ column, asc });
  };

  const openCreateModal = () => {
    setActiveUser(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setActiveUser(user);
    setIsEditModalOpen(true);
  };

  const openNotificationsModal = (user: any) => {
    setActiveUser(user);
    setIsNotificationsOpen(true);
  };

  const sortedUsers = sortUsersby(users, sortOrder);
  const confirmDeleteTitle = getDeleteConfirmationTitle();

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <OrganizationFilter
          organizations={organizations}
          handleOnChange={(id: string) => {
            setOrganisationFilterId(id);
          }}
          organisationFilterId={organisationFilterId}
        />
        <Fab
          size="small"
          aria-label="Create user"
          sx={{ marginRight: '10px' }}
          onClick={openCreateModal}
        >
          <Add />
        </Fab>
      </Box>
      <Box>
        <Box
          sx={{
            fontWeight: 600,
            textTransform: 'uppercase',
            bgcolor: 'rgba(238, 238, 238, 0.28)',
            mb: '5px',
            m: '2px',
            fontSize: '0.9em',
          }}
        >
          <Box
            sx={{
              display: 'inline-block',
              width: '12%',
              maxWidth: '12%',
              minWidth: '12%',
              wordBreak: 'break-all',
              m: '2px',
              mb: '5px',
              fontSize: '0.9em',
            }}
          >
            <Box
              component="span"
              onClick={() => handleSortOrder('username')}
              sx={{ borderBottom: '1px dotted', cursor: 'pointer' }}
            >
              username
            </Box>
          </Box>
          <Box
            sx={{
              display: 'inline-block',
              width: '12%',
              maxWidth: '12%',
              minWidth: '12%',
              wordBreak: 'break-all',
              m: '2px',
              mb: '5px',
              fontSize: '0.9em',
            }}
          >
            <Box
              component="span"
              onClick={() => handleSortOrder('firstName')}
              sx={{ borderBottom: '1px dotted', cursor: 'pointer' }}
            >
              firstname
            </Box>
          </Box>
          <Box
            sx={{
              display: 'inline-block',
              width: '12%',
              maxWidth: '12%',
              minWidth: '12%',
              wordBreak: 'break-all',
              m: '2px',
              mb: '5px',
              fontSize: '0.9em',
            }}
          >
            <Box
              component="span"
              onClick={() => handleSortOrder('lastName')}
              sx={{ borderBottom: '1px dotted', cursor: 'pointer' }}
            >
              lastname
            </Box>
          </Box>
          <Box
            sx={{
              display: 'inline-block',
              width: '15%',
              maxWidth: '15%',
              minWidth: '15%',
              wordBreak: 'break-all',
              m: '2px',
              mb: '5px',
              fontSize: '0.9em',
            }}
          >
            <Box
              component="span"
              onClick={() => handleSortOrder('email')}
              sx={{ borderBottom: '1px dotted', cursor: 'pointer' }}
            >
              e-mail
            </Box>
          </Box>
          <Box
            sx={{
              display: 'inline-block',
              width: '12%',
              maxWidth: '12%',
              minWidth: '12%',
              wordBreak: 'break-all',
              m: '2px',
              mb: '5px',
              fontSize: '0.9em',
            }}
          >
            <Box
              component="span"
              onClick={() => handleSortOrder('organisation')}
              sx={{ borderBottom: '1px dotted', cursor: 'pointer' }}
            >
              organisation
            </Box>
          </Box>
          <Box
            sx={{
              display: 'inline-block',
              width: '17%',
              maxWidth: '17%',
              minWidth: '17%',
              wordBreak: 'break-all',
              m: '2px',
              mb: '5px',
              fontSize: '0.9em',
            }}
          >
            Responsiblity set
          </Box>
          <Box
            sx={{
              display: 'inline-block',
              width: '12%',
              maxWidth: '12%',
              minWidth: '12%',
              wordBreak: 'break-all',
              m: '2px',
              mb: '5px',
              fontSize: '0.9em',
            }}
          >
            Notifications
          </Box>
        </Box>
        {sortedUsers.filter(filterUserByOrg).map((user: any) => {
          return (
            <Box
              key={'user-' + user.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                m: '2px',
                mb: '5px',
                fontSize: '0.9em',
                '&:nth-of-type(even)': { bgcolor: 'hsla(0, 0%, 50%, 0.07)' },
              }}
            >
              <Box
                sx={{
                  display: 'inline-block',
                  width: '12%',
                  maxWidth: '12%',
                  minWidth: '12%',
                  wordBreak: 'break-all',
                  m: '2px',
                  mb: '5px',
                  fontSize: '0.9em',
                }}
              >
                {user.username}
              </Box>
              <Box
                sx={{
                  display: 'inline-block',
                  width: '12%',
                  maxWidth: '12%',
                  minWidth: '12%',
                  wordBreak: 'break-all',
                  m: '2px',
                  mb: '5px',
                  fontSize: '0.9em',
                }}
              >
                {user.contactDetails.firstName}
              </Box>
              <Box
                sx={{
                  display: 'inline-block',
                  width: '12%',
                  maxWidth: '12%',
                  minWidth: '12%',
                  wordBreak: 'break-all',
                  m: '2px',
                  mb: '5px',
                  fontSize: '0.9em',
                }}
              >
                {user.contactDetails.lastName}
              </Box>
              <Box
                sx={{
                  display: 'inline-block',
                  width: '15%',
                  maxWidth: '15%',
                  minWidth: '15%',
                  wordBreak: 'break-all',
                  m: '2px',
                  mb: '5px',
                  fontSize: '0.9em',
                }}
              >
                {user.contactDetails.email}
              </Box>
              <Box
                sx={{
                  display: 'inline-block',
                  width: '12%',
                  maxWidth: '12%',
                  minWidth: '12%',
                  wordBreak: 'break-all',
                  m: '2px',
                  mb: '5px',
                  fontSize: '0.9em',
                }}
              >
                {user.organisation.name}
              </Box>
              <Box
                sx={{
                  display: 'inline-block',
                  width: '17%',
                  maxWidth: '17%',
                  minWidth: '17%',
                  wordBreak: 'break-all',
                  m: '2px',
                  mb: '5px',
                  fontSize: '0.9em',
                }}
              >
                <Box
                  component="ul"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    listStyleType: 'circle',
                  }}
                >
                  {user.responsibilitySets
                    ? user.responsibilitySets.map((resp: any) => (
                        <li key={resp.id}>{resp.name} </li>
                      ))
                    : null}
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'inline-block',
                  width: '9%',
                  maxWidth: '9%',
                  minWidth: '9%',
                  wordBreak: 'break-all',
                  m: '2px',
                  mb: '5px',
                  fontSize: '0.9em',
                }}
              >
                {user.notifications.map((notification: any, i: number) => (
                  <NotificationStatus key={'notification-' + i} notification={notification} />
                ))}
              </Box>
              <Box
                sx={{
                  float: 'right',
                  mr: '10px',
                  width: 'auto',
                  display: 'inline-block',
                  cursor: 'pointer',
                  m: '2px',
                  mb: '5px',
                  fontSize: '0.9em',
                }}
              >
                <Edit
                  sx={{
                    height: 20,
                    marginRight: '4px',
                    width: 20,
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    color: 'rgba(25, 118, 210, 0.59)',
                  }}
                  onClick={() => openEditModal(user)}
                />
                <Notifications
                  sx={{
                    marginLeft: '4px',
                    height: 20,
                    width: 20,
                    marginRight: '4px',
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    color: 'rgba(25, 118, 210, 0.59)',
                  }}
                  onClick={() => openNotificationsModal(user)}
                />
                <Delete
                  sx={{
                    height: 20,
                    width: 20,
                    marginRight: '10px',
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    color: 'error.light',
                  }}
                  onClick={() => handleOpenDeleteConfirmationDialog(user)}
                />
              </Box>
            </Box>
          );
        })}
        {isCreateModalOpen && (
          <ModalCreateUser
            isModalOpen={isCreateModalOpen}
            handleCloseModal={() => setIsCreateModalOpen(false)}
            takenUsernames={users.map((user: any) => user.username)}
            takenEmails={users.map((user: any) => user.contactDetails.email)}
            organizations={organizations}
            responsibilities={responsibilities}
            handleSubmit={handleCreateUser}
          />
        )}
        {isEditModalOpen && (
          <ModalEditUser
            isModalOpen={isEditModalOpen}
            handleCloseModal={() => setIsEditModalOpen(false)}
            takenUsernames={users.map((user: any) => user.username)}
            organizations={organizations}
            user={activeUser}
            responsibilities={responsibilities}
            handleSubmit={handleUpdateUser}
          />
        )}
        {isNotificationsOpen && (
          <ModalEditNotifications
            handleCloseModal={() => setIsNotificationsOpen(false)}
            isModalOpen={isNotificationsOpen}
            user={activeUser}
            getToken={getToken}
          />
        )}
        <ModalConfirmation
          open={isDeleteConfirmationOpen}
          title={confirmDeleteTitle}
          actionBtnTitle="Delete"
          body="You are about to delete current user. Are you sure?"
          handleSubmit={() => {
            handleDeleteUser(activeUser);
          }}
          handleClose={() => {
            handleCloseDeleteConfirmation();
          }}
        />
      </Box>
    </Box>
  );
};

export default UserView;
