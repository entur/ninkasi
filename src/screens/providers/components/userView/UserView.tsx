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
import './userView.scss';
import { Edit, Delete, Notifications, Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
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
    <div>
      <div
        style={{
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
        <Fab size="small" style={{ marginRight: 10 }} onClick={openCreateModal}>
          <Add />
        </Fab>
      </div>
      <div className="user-row">
        <div className="user-header">
          <div className="col-1-9">
            <span className="sortable" onClick={() => handleSortOrder('username')}>
              username
            </span>
          </div>
          <div className="col-1-9">
            <span className="sortable" onClick={() => handleSortOrder('firstName')}>
              firstname
            </span>
          </div>
          <div className="col-1-9">
            <span className="sortable" onClick={() => handleSortOrder('lastName')}>
              lastname
            </span>
          </div>
          <div className="col-1-8">
            <span className="sortable" onClick={() => handleSortOrder('email')}>
              e-mail
            </span>
          </div>
          <div className="col-1-9">
            <span className="sortable" onClick={() => handleSortOrder('organisation')}>
              organisation
            </span>
          </div>
          <div className="col-1-7">Responsiblity set</div>
          <div className="col-1-9">Notifications</div>
        </div>
        {sortedUsers.filter(filterUserByOrg).map((user: any) => {
          return (
            <div
              key={'user-' + user.id}
              className="user-row-item"
              style={{ display: 'flex', alignItems: 'center' }}
            >
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
                    listStyleType: 'circle',
                  }}
                >
                  {user.responsibilitySets
                    ? user.responsibilitySets.map((resp: any) => (
                        <li key={resp.id}>{resp.name} </li>
                      ))
                    : null}
                </ul>
              </div>
              <div className="col-1-11">
                {user.notifications.map((notification: any, i: number) => (
                  <NotificationStatus key={'notification-' + i} notification={notification} />
                ))}
              </div>
              <div className="col-icon">
                <Edit
                  style={{
                    height: 20,
                    marginRight: 4,
                    width: 20,
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    color: 'rgba(25, 118, 210, 0.59)',
                  }}
                  onClick={() => openEditModal(user)}
                />
                <Notifications
                  style={{
                    marginLeft: 4,
                    height: 20,
                    width: 20,
                    marginRight: 4,
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    color: 'rgba(25, 118, 210, 0.59)',
                  }}
                  onClick={() => openNotificationsModal(user)}
                />
                <Delete
                  style={{
                    height: 20,
                    width: 20,
                    marginRight: 10,
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    color: '#fa7b81',
                  }}
                  onClick={() => handleOpenDeleteConfirmationDialog(user)}
                />
              </div>
            </div>
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
      </div>
    </div>
  );
};

export default UserView;
