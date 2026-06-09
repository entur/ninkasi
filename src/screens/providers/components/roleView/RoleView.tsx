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
import './roleView.scss';
import { Edit, Delete, Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
import ModalEditRole from 'modals/ModalEditRole';
import ModalCreateRole from 'modals/ModalCreateRole';
import ModalConfirmation from 'modals/ModalConfirmation';
import { sortByColumns } from 'utils/index';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import { fetchRoles } from 'reducers/OrganizationReducer';
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';

interface SortOrder {
  column: string;
  asc: boolean;
}

const RoleView = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  const roles = useAppSelector((state: any) => state.OrganizationReducer.roles);
  const status = useAppSelector((state: any) => state.OrganizationReducer.roleStatus);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>({ column: 'name', asc: true });

  useEffect(() => {
    dispatch(fetchRoles(getToken));
  }, [dispatch, getToken]);

  useEffect(() => {
    if (status && status.error === null && (isCreateModalOpen || isEditModalOpen)) {
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleEditRole = (role: any) => {
    setActiveRole(role);
    setIsEditModalOpen(true);
  };

  const getDeleteConfirmationTitle = () => {
    const role = activeRole ? activeRole.name : 'N/A';
    return `Delete role ${role}`;
  };

  const handleOpenDeleteConfirmationDialog = (role: any) => {
    setActiveRole(role);
    setIsDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setActiveRole(null);
    setIsDeleteConfirmationOpen(false);
  };

  const handleSortOrder = (column: string) => {
    let asc = true;
    if (sortOrder.column === column) {
      asc = !sortOrder.asc;
    }
    setSortOrder({ column, asc });
  };

  const handleCreateRole = (role: any) => {
    dispatch(OrganizationRegisterActions.createRole(role, getToken));
  };

  const handleUpdateRole = (role: any) => {
    dispatch(OrganizationRegisterActions.updateRole(role, getToken));
    setIsEditModalOpen(false);
  };

  const handleDeleteRole = (role: any) => {
    handleCloseDeleteConfirmation();
    dispatch(OrganizationRegisterActions.deleteRole(role.id, getToken));
  };

  const sortedRoles = sortByColumns(roles, sortOrder);
  const confirmDeleteTitle = getDeleteConfirmationTitle();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Fab
          size="small"
          style={{ float: 'right', marginRight: 10 }}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Add />
        </Fab>
      </div>
      <div className="role-row">
        <div className="role-header">
          <div className="col-1-3">
            <span className="sortable" onClick={() => handleSortOrder('name')}>
              name
            </span>
          </div>
          <div className="col-1-3">
            <span className="sortable" onClick={() => handleSortOrder('privateCode')}>
              private code
            </span>
          </div>
        </div>
        {sortedRoles.map((role: any) => {
          return (
            <div key={'role-' + role.id} className="role-row-item">
              <div className="col-1-3">{role.name}</div>
              <div className="col-1-3">{role.privateCode}</div>
              <div className="col-icon" style={{ cursor: 'pointer' }}>
                <Delete
                  style={{
                    height: 20,
                    width: 20,
                    marginRight: 10,
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    color: '#fa7b81',
                  }}
                  onClick={() => handleOpenDeleteConfirmationDialog(role)}
                />
                <Edit
                  onClick={() => handleEditRole(role)}
                  style={{
                    height: 20,
                    width: 20,
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    color: 'rgba(25, 118, 210, 0.59)',
                  }}
                />
              </div>
            </div>
          );
        })}
        {isCreateModalOpen ? (
          <ModalCreateRole
            isModalOpen={isCreateModalOpen}
            handleCloseModal={() => setIsCreateModalOpen(false)}
            takenPrivateCodes={roles.map((role: any) => role.privateCode)}
            handleSubmit={handleCreateRole}
          />
        ) : null}
        {isEditModalOpen ? (
          <ModalEditRole
            isModalOpen={isEditModalOpen}
            role={activeRole}
            handleCloseModal={() => setIsEditModalOpen(false)}
            handleSubmit={handleUpdateRole}
          />
        ) : null}
        <ModalConfirmation
          open={isDeleteConfirmationOpen}
          title={confirmDeleteTitle}
          actionBtnTitle="Delete"
          body="You are about to delete current user. Are you sure?"
          handleSubmit={() => {
            handleDeleteRole(activeRole);
          }}
          handleClose={() => {
            handleCloseDeleteConfirmation();
          }}
        />
      </div>
    </div>
  );
};

export default RoleView;
