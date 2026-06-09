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
import { Box, Fab } from '@mui/material';
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

const colBaseSx = {
  display: 'inline-block',
  margin: '2px',
  marginBottom: '5px',
  fontSize: '0.9em',
};

const colNameSx = {
  ...colBaseSx,
  width: '18%',
  maxWidth: '18%',
  minWidth: '18%',
  wordBreak: 'break-all',
};

const colClientIdSx = {
  ...colBaseSx,
  width: '20%',
  maxWidth: '20%',
  minWidth: '20%',
  wordBreak: 'break-all',
  fontFamily: 'monospace',
  fontSize: '0.85em',
};

const colOrgIdSx = {
  ...colBaseSx,
  width: '9%',
  maxWidth: '9%',
  minWidth: '9%',
  textAlign: 'center',
};

const colIssuerSx = {
  ...colBaseSx,
  width: '9%',
  maxWidth: '9%',
  minWidth: '9%',
};

const colResponsibilitySetsSx = {
  ...colBaseSx,
  width: '32%',
  maxWidth: '32%',
  minWidth: '32%',
};

const colActionsSx = {
  ...colBaseSx,
  width: '10%',
  maxWidth: '10%',
  minWidth: '10%',
  textAlign: 'center',
};

const sortableSx = {
  borderBottom: '1px dotted',
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': {
    color: '#1976d2',
  },
};

const headerSx = {
  fontWeight: 600,
  textTransform: 'uppercase',
  bgcolor: 'rgba(238, 238, 238, 0.28)',
  mb: '5px',
};

const rowItemSx = {
  '&:nth-of-type(even)': {
    bgcolor: 'hsla(0, 0%, 50%, 0.07)',
  },
};

const clientLinkSx = {
  color: '#1976d2',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
};

const responsibilityListSx = {
  margin: 0,
  paddingLeft: '20px',
  listStyleType: 'disc',
  '& li': {
    margin: '2px 0',
    fontSize: '0.95em',
  },
};

const noResponsibilitiesSx = {
  color: '#999',
  fontStyle: 'italic',
};

const emptySx = {
  padding: '20px',
  textAlign: 'center',
  color: '#666',
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
    let asc = true;
    if (sortOrder.column === column) {
      asc = !sortOrder.asc;
    }
    setSortOrder({ column, asc });
  };

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
        <Fab size="small" sx={{ marginRight: '10px' }} onClick={openCreateModal}>
          <Add />
        </Fab>
      </Box>
      <Box>
        <Box sx={headerSx}>
          <Box sx={colNameSx}>
            <Box component="span" onClick={() => handleSortOrder('name')} sx={sortableSx}>
              Name
            </Box>
          </Box>
          <Box sx={colClientIdSx}>
            <Box component="span" onClick={() => handleSortOrder('privateCode')} sx={sortableSx}>
              Client Id
            </Box>
          </Box>
          <Box sx={colOrgIdSx}>
            <Box
              component="span"
              onClick={() => handleSortOrder('enturOrganisationId')}
              sx={sortableSx}
            >
              Entur Org Id
            </Box>
          </Box>
          <Box sx={colIssuerSx}>
            <Box component="span" onClick={() => handleSortOrder('issuer')} sx={sortableSx}>
              Issuer
            </Box>
          </Box>
          <Box sx={colResponsibilitySetsSx}>
            <Box
              component="span"
              onClick={() => handleSortOrder('responsibilitySets')}
              sx={sortableSx}
            >
              Responsibility Sets
            </Box>
          </Box>
          <Box sx={colActionsSx}>Actions</Box>
        </Box>
        {sortedClients.map((client: any) => {
          const enturPartnerUrl = getEnturPartnerUrl(client.issuer, client.privateCode);
          return (
            <Box key={'m2m-client-' + client.privateCode} sx={rowItemSx}>
              <Box sx={colNameSx}>
                <Box
                  component="a"
                  href={enturPartnerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={clientLinkSx}
                >
                  {client.name}
                </Box>
              </Box>
              <Box sx={colClientIdSx}>{client.privateCode}</Box>
              <Box sx={colOrgIdSx}>{client.enturOrganisationId}</Box>
              <Box sx={colIssuerSx}>{client.issuer}</Box>
              <Box sx={colResponsibilitySetsSx}>
                {client.responsibilitySets && client.responsibilitySets.length > 0 ? (
                  <Box component="ul" sx={responsibilityListSx}>
                    {client.responsibilitySets.map((resp: any, i: number) => (
                      <li key={`${client.privateCode}-resp-${i}`}>{resp.name}</li>
                    ))}
                  </Box>
                ) : (
                  <Box component="span" sx={noResponsibilitiesSx}>
                    None
                  </Box>
                )}
              </Box>
              <Box sx={colActionsSx}>
                <Edit
                  sx={{
                    height: 20,
                    marginRight: '4px',
                    width: 20,
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    color: 'rgba(25, 118, 210, 0.59)',
                  }}
                  onClick={() => openEditModal(client)}
                />
                <Delete
                  sx={{
                    height: 20,
                    width: 20,
                    marginRight: '10px',
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    color: '#fa7b81',
                  }}
                  onClick={() => handleOpenDeleteConfirmationDialog(client)}
                />
              </Box>
            </Box>
          );
        })}
        {(!m2mClients || m2mClients.length === 0) && (
          <Box sx={emptySx}>No machine-to-machine clients found</Box>
        )}
      </Box>
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
