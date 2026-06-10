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
import { Edit, Delete, Add } from '@mui/icons-material';
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
    const asc = sortOrder.column === column ? !sortOrder.asc : true;
    setSortOrder({ column, asc });
  };

  const sortDirection = (column: string): 'asc' | 'desc' | false =>
    sortOrder.column === column ? (sortOrder.asc ? 'asc' : 'desc') : false;

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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Fab
          size="small"
          aria-label="Create role"
          sx={{ mr: '10px' }}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Add />
        </Fab>
      </Box>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sortDirection={sortDirection('name')}>
                <TableSortLabel
                  active={sortOrder.column === 'name'}
                  direction={sortOrder.asc ? 'asc' : 'desc'}
                  onClick={() => handleSortOrder('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortDirection('privateCode')}>
                <TableSortLabel
                  active={sortOrder.column === 'privateCode'}
                  direction={sortOrder.asc ? 'asc' : 'desc'}
                  onClick={() => handleSortOrder('privateCode')}
                >
                  Private code
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRoles.map((role: any) => (
              <TableRow key={'role-' + role.id} hover>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.privateCode}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="error"
                    aria-label="Delete role"
                    onClick={() => handleOpenDeleteConfirmationDialog(role)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label="Edit role"
                    onClick={() => handleEditRole(role)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
    </Box>
  );
};

export default RoleView;
