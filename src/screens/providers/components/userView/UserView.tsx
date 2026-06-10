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
import {
  Box,
  Fab,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
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
    const asc = sortOrder.column === column ? !sortOrder.asc : true;
    setSortOrder({ column, asc });
  };

  const sortDirection = (column: string): 'asc' | 'desc' | false =>
    sortOrder.column === column ? (sortOrder.asc ? 'asc' : 'desc') : false;

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
          mb: 1,
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
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sortDirection={sortDirection('username')}>
                <TableSortLabel
                  active={sortOrder.column === 'username'}
                  direction={sortOrder.asc ? 'asc' : 'desc'}
                  onClick={() => handleSortOrder('username')}
                >
                  Username
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortDirection('firstName')}>
                <TableSortLabel
                  active={sortOrder.column === 'firstName'}
                  direction={sortOrder.asc ? 'asc' : 'desc'}
                  onClick={() => handleSortOrder('firstName')}
                >
                  First name
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortDirection('lastName')}>
                <TableSortLabel
                  active={sortOrder.column === 'lastName'}
                  direction={sortOrder.asc ? 'asc' : 'desc'}
                  onClick={() => handleSortOrder('lastName')}
                >
                  Last name
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortDirection('email')}>
                <TableSortLabel
                  active={sortOrder.column === 'email'}
                  direction={sortOrder.asc ? 'asc' : 'desc'}
                  onClick={() => handleSortOrder('email')}
                >
                  E-mail
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortDirection('organisation')}>
                <TableSortLabel
                  active={sortOrder.column === 'organisation'}
                  direction={sortOrder.asc ? 'asc' : 'desc'}
                  onClick={() => handleSortOrder('organisation')}
                >
                  Organisation
                </TableSortLabel>
              </TableCell>
              <TableCell>Responsibility set</TableCell>
              <TableCell>Notifications</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.filter(filterUserByOrg).map((user: any) => (
              <TableRow key={'user-' + user.id} hover>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.contactDetails.firstName}</TableCell>
                <TableCell>{user.contactDetails.lastName}</TableCell>
                <TableCell>{user.contactDetails.email}</TableCell>
                <TableCell>{user.organisation.name}</TableCell>
                <TableCell>
                  {user.responsibilitySets && user.responsibilitySets.length ? (
                    <Box component="ul" sx={{ m: 0, pl: 2.5, listStyleType: 'circle' }}>
                      {user.responsibilitySets.map((resp: any) => (
                        <li key={resp.id}>{resp.name}</li>
                      ))}
                    </Box>
                  ) : null}
                </TableCell>
                <TableCell>
                  {user.notifications.map((notification: any, i: number) => (
                    <NotificationStatus key={'notification-' + i} notification={notification} />
                  ))}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="error"
                    aria-label="Delete user"
                    onClick={() => handleOpenDeleteConfirmationDialog(user)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label="Edit notifications"
                    onClick={() => openNotificationsModal(user)}
                  >
                    <Notifications fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label="Edit user"
                    onClick={() => openEditModal(user)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
  );
};

export default UserView;
