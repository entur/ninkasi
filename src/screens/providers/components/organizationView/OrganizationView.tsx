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
import { Edit, Add, Delete } from '@mui/icons-material';
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
import ModalCreateOrganization from 'modals/ModalCreateOrganization';
import ModalEditOrganization from 'modals/ModalEditOrganization';
import ModalConfirmation from 'modals/ModalConfirmation';
import { sortByColumns } from 'utils/index';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import { fetchOrganizations, fetchCodeSpaces } from 'reducers/OrganizationReducer';
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';

interface SortOrder {
  column: string;
  asc: boolean;
}

const OrganizationView = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  const organizations = useAppSelector((state: any) => state.OrganizationReducer.organizations);
  const codeSpaces = useAppSelector((state: any) => state.OrganizationReducer.codeSpaces);
  const status = useAppSelector((state: any) => state.OrganizationReducer.organizationStatus);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [activeOrganization, setActiveOrganization] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>({ column: 'name', asc: true });

  useEffect(() => {
    dispatch(fetchOrganizations(getToken));
    dispatch(fetchCodeSpaces(getToken));
  }, [dispatch, getToken]);

  // Mirror componentDidUpdate: when status changes to error: null while a modal is open, close.
  useEffect(() => {
    if (status && status.error === null && (isCreateModalOpen || isEditModalOpen)) {
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSortOrder = (column: string) => {
    const asc = sortOrder.column === column ? !sortOrder.asc : true;
    setSortOrder({ column, asc });
  };

  const sortDirection = (column: string): 'asc' | 'desc' | false =>
    sortOrder.column === column ? (sortOrder.asc ? 'asc' : 'desc') : false;

  const handleCloseDeleteConfirmation = () => {
    setActiveOrganization(null);
    setIsDeleteConfirmationOpen(false);
  };

  const handleCreateOrganization = (organization: any) => {
    dispatch(OrganizationRegisterActions.createOrganization(organization, getToken));
  };

  const handleUpdateOrganization = (organization: any) => {
    dispatch(OrganizationRegisterActions.updateOrganization(organization, getToken));
  };

  const handleEditOrganization = (organization: any) => {
    setActiveOrganization(organization);
    setIsEditModalOpen(true);
  };

  const handleDeleteOrganization = (organization: any) => {
    handleCloseDeleteConfirmation();
    dispatch(OrganizationRegisterActions.deleteOrganization(organization.id, getToken));
  };

  const handleOpenDeleteConfirmationDialog = (organization: any) => {
    setActiveOrganization(organization);
    setIsDeleteConfirmationOpen(true);
  };

  const getDeleteConfirmationTitle = () => {
    const organization = activeOrganization ? activeOrganization.name : 'N/A';
    return `Delete organization ${organization}`;
  };

  const sortedOrganizations = sortByColumns(organizations, sortOrder);
  const confirmDeleteTitle = getDeleteConfirmationTitle();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Fab
          size="small"
          aria-label="Create organization"
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
              <TableCell sortDirection={sortDirection('id')}>
                <TableSortLabel
                  active={sortOrder.column === 'id'}
                  direction={sortOrder.asc ? 'asc' : 'desc'}
                  onClick={() => handleSortOrder('id')}
                >
                  Id
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortDirection('organisationType')}>
                <TableSortLabel
                  active={sortOrder.column === 'organisationType'}
                  direction={sortOrder.asc ? 'asc' : 'desc'}
                  onClick={() => handleSortOrder('organisationType')}
                >
                  Organisation type
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
              <TableCell sortDirection={sortDirection('codeSpace')}>
                <TableSortLabel
                  active={sortOrder.column === 'codeSpace'}
                  direction={sortOrder.asc ? 'asc' : 'desc'}
                  onClick={() => handleSortOrder('codeSpace')}
                >
                  Code space
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedOrganizations.map((organization: any) => (
              <TableRow key={'organization-' + organization.id} hover>
                <TableCell>{organization.name}</TableCell>
                <TableCell>{organization.id}</TableCell>
                <TableCell>{organization.organisationType}</TableCell>
                <TableCell>{organization.privateCode}</TableCell>
                <TableCell>{organization.codeSpace}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="error"
                    aria-label="Delete organization"
                    onClick={() => handleOpenDeleteConfirmationDialog(organization)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label="Edit organization"
                    onClick={() => handleEditOrganization(organization)}
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
        <ModalCreateOrganization
          isModalOpen={isCreateModalOpen}
          handleCloseModal={() => setIsCreateModalOpen(false)}
          takenOrganizationNames={organizations.map((org: any) => org.name)}
          takenOrganizationPrivateCodes={organizations.map((org: any) => org.privateCode)}
          codeSpaces={codeSpaces}
          handleSubmit={handleCreateOrganization}
        />
      ) : null}

      {isEditModalOpen ? (
        <ModalEditOrganization
          isModalOpen={isEditModalOpen}
          handleCloseModal={() => setIsEditModalOpen(false)}
          takenOrganizationNames={organizations.map((org: any) => org.name)}
          takenOrganizationPrivateCodes={organizations.map((org: any) => org.privateCode)}
          organization={activeOrganization}
          codeSpaces={codeSpaces}
          handleSubmit={handleUpdateOrganization}
        />
      ) : null}
      <ModalConfirmation
        open={isDeleteConfirmationOpen}
        title={confirmDeleteTitle}
        actionBtnTitle="Delete"
        body="You are about to delete current organization. Are you sure?"
        handleSubmit={() => {
          handleDeleteOrganization(activeOrganization);
        }}
        handleClose={() => {
          handleCloseDeleteConfirmation();
        }}
      />
    </Box>
  );
};

export default OrganizationView;
