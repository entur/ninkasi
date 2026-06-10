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
import EmptyState from '@/app/components/EmptyState';
import ModalCreateM2MClient from 'modals/ModalCreateM2MClient';
import ModalEditM2MClient from 'modals/ModalEditM2MClient';
import ModalConfirmation from 'modals/ModalConfirmation';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import { fetchM2MClients, fetchResponsibilitySets } from 'reducers/OrganizationReducer';
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';

interface SortOrder {
  column: string;
  asc: boolean;
}

const sortClients = (clients: any[], sortOrder: SortOrder) => {
  const sorted = [...clients].sort((a: any, b: any) => {
    let aVal: any = a[sortOrder.column];
    let bVal: any = b[sortOrder.column];

    // Handle special cases for sorting
    if (sortOrder.column === 'responsibilitySets') {
      aVal = a.responsibilitySets ? a.responsibilitySets.length : 0;
      bVal = b.responsibilitySets ? b.responsibilitySets.length : 0;
      return sortOrder.asc ? aVal - bVal : bVal - aVal;
    }

    // Convert to lowercase for string comparison
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortOrder.asc ? -1 : 1;
    if (aVal > bVal) return sortOrder.asc ? 1 : -1;
    return 0;
  });
  return sorted;
};

const getEnturPartnerUrl = (issuer: string, clientId: string) => {
  const baseUrl = (window as any).config.enturPartnerUrl;
  const issuerPath = issuer.toLowerCase() === 'internal' ? 'internal' : 'partner';
  return `${baseUrl}/permission-admin/clients/view/${issuerPath}/${clientId}`;
};

const clientLinkSx = {
  color: 'primary.main',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
};

const noResponsibilitiesSx = {
  color: 'text.disabled',
  fontStyle: 'italic',
};

const M2MClientsView = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  const m2mClients = useAppSelector((state: any) => state.OrganizationReducer.m2mClients);
  const responsibilities = useAppSelector(
    (state: any) => state.OrganizationReducer.responsibilities
  );
  const status = useAppSelector((state: any) => state.OrganizationReducer.m2mClientStatus);

  const [sortOrder, setSortOrder] = useState<SortOrder>({ column: 'name', asc: true });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [activeClient, setActiveClient] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchM2MClients(getToken));
    dispatch(fetchResponsibilitySets(getToken));
  }, [dispatch, getToken]);

  useEffect(() => {
    if (status && status.error === null && (isCreateModalOpen || isEditModalOpen)) {
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleCreateClient = (client: any) => {
    dispatch(OrganizationRegisterActions.createM2MClient(client, getToken));
  };

  const handleUpdateClient = (client: any) => {
    dispatch(OrganizationRegisterActions.updateM2MClient(client, getToken));
  };

  const handleCloseDeleteConfirmation = () => {
    setActiveClient(null);
    setIsDeleteConfirmationOpen(false);
  };

  const handleDeleteClient = (client: any) => {
    handleCloseDeleteConfirmation();
    dispatch(OrganizationRegisterActions.deleteM2MClient(client.privateCode, getToken));
  };

  const handleOpenDeleteConfirmationDialog = (client: any) => {
    setActiveClient(client);
    setIsDeleteConfirmationOpen(true);
  };

  const openCreateModal = () => {
    setActiveClient(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (client: any) => {
    setActiveClient(client);
    setIsEditModalOpen(true);
  };

  const getDeleteConfirmationTitle = () => {
    const clientName = activeClient ? activeClient.name : 'N/A';
    return `Delete M2M client ${clientName}`;
  };

  const handleSortOrder = (column: string) => {
    const asc = sortOrder.column === column ? !sortOrder.asc : true;
    setSortOrder({ column, asc });
  };

  const sortDirection = (column: string): 'asc' | 'desc' | false =>
    sortOrder.column === column ? (sortOrder.asc ? 'asc' : 'desc') : false;

  const sortedClients = sortClients(m2mClients || [], sortOrder);
  const confirmDeleteTitle = getDeleteConfirmationTitle();

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <Fab
          size="small"
          aria-label="Create M2M client"
          sx={{ marginRight: '10px' }}
          onClick={openCreateModal}
        >
          <Add />
        </Fab>
      </Box>
      {m2mClients && m2mClients.length ? (
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
                    Client Id
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={sortDirection('enturOrganisationId')}>
                  <TableSortLabel
                    active={sortOrder.column === 'enturOrganisationId'}
                    direction={sortOrder.asc ? 'asc' : 'desc'}
                    onClick={() => handleSortOrder('enturOrganisationId')}
                  >
                    Entur Org Id
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={sortDirection('issuer')}>
                  <TableSortLabel
                    active={sortOrder.column === 'issuer'}
                    direction={sortOrder.asc ? 'asc' : 'desc'}
                    onClick={() => handleSortOrder('issuer')}
                  >
                    Issuer
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={sortDirection('responsibilitySets')}>
                  <TableSortLabel
                    active={sortOrder.column === 'responsibilitySets'}
                    direction={sortOrder.asc ? 'asc' : 'desc'}
                    onClick={() => handleSortOrder('responsibilitySets')}
                  >
                    Responsibility Sets
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedClients.map((client: any) => {
                const enturPartnerUrl = getEnturPartnerUrl(client.issuer, client.privateCode);
                return (
                  <TableRow hover key={'m2m-client-' + client.privateCode}>
                    <TableCell>
                      <Box
                        component="a"
                        href={enturPartnerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={clientLinkSx}
                      >
                        {client.name}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{client.privateCode}</TableCell>
                    <TableCell>{client.enturOrganisationId}</TableCell>
                    <TableCell>{client.issuer}</TableCell>
                    <TableCell>
                      {client.responsibilitySets && client.responsibilitySets.length > 0 ? (
                        <Box component="ul" sx={{ m: 0, pl: 2.5, listStyleType: 'disc' }}>
                          {client.responsibilitySets.map((resp: any, i: number) => (
                            <li key={`${client.privateCode}-resp-${i}`}>{resp.name}</li>
                          ))}
                        </Box>
                      ) : (
                        <Box component="span" sx={noResponsibilitiesSx}>
                          None
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="error"
                        aria-label="Delete M2M client"
                        onClick={() => handleOpenDeleteConfirmationDialog(client)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        aria-label="Edit M2M client"
                        onClick={() => openEditModal(client)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <EmptyState message="No machine-to-machine clients found" />
      )}
      {isCreateModalOpen && (
        <ModalCreateM2MClient
          isModalOpen={isCreateModalOpen}
          handleCloseModal={() => setIsCreateModalOpen(false)}
          takenClientIds={m2mClients.map((client: any) => client.privateCode)}
          responsibilities={responsibilities}
          handleSubmit={handleCreateClient}
        />
      )}
      {isEditModalOpen && (
        <ModalEditM2MClient
          isModalOpen={isEditModalOpen}
          handleCloseModal={() => setIsEditModalOpen(false)}
          client={activeClient}
          responsibilities={responsibilities}
          handleSubmit={handleUpdateClient}
        />
      )}
      <ModalConfirmation
        open={isDeleteConfirmationOpen}
        title={confirmDeleteTitle}
        actionBtnTitle="Delete"
        body="You are about to delete current M2M client. Are you sure?"
        handleSubmit={() => {
          handleDeleteClient(activeClient);
        }}
        handleClose={() => {
          handleCloseDeleteConfirmation();
        }}
      />
    </Box>
  );
};

export default M2MClientsView;
