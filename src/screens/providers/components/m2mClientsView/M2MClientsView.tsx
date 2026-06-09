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
import './m2mClientsView.scss';
import { Edit, Delete, Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
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
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <Fab size="small" style={{ marginRight: 10 }} onClick={openCreateModal}>
          <Add />
        </Fab>
      </div>
      <div className="m2m-clients-row">
        <div className="m2m-clients-header">
          <div className="col-m2m-name">
            <span className="sortable" onClick={() => handleSortOrder('name')}>
              Name
            </span>
          </div>
          <div className="col-m2m-client-id">
            <span className="sortable" onClick={() => handleSortOrder('privateCode')}>
              Client Id
            </span>
          </div>
          <div className="col-m2m-org-id">
            <span className="sortable" onClick={() => handleSortOrder('enturOrganisationId')}>
              Entur Org Id
            </span>
          </div>
          <div className="col-m2m-issuer">
            <span className="sortable" onClick={() => handleSortOrder('issuer')}>
              Issuer
            </span>
          </div>
          <div className="col-m2m-responsibility-sets">
            <span className="sortable" onClick={() => handleSortOrder('responsibilitySets')}>
              Responsibility Sets
            </span>
          </div>
          <div className="col-m2m-actions">Actions</div>
        </div>
        {sortedClients.map((client: any) => {
          const enturPartnerUrl = getEnturPartnerUrl(client.issuer, client.privateCode);
          return (
            <div key={'m2m-client-' + client.privateCode} className="m2m-clients-row-item">
              <div className="col-m2m-name">
                <a
                  href={enturPartnerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="m2m-client-link"
                >
                  {client.name}
                </a>
              </div>
              <div className="col-m2m-client-id">{client.privateCode}</div>
              <div className="col-m2m-org-id">{client.enturOrganisationId}</div>
              <div className="col-m2m-issuer">{client.issuer}</div>
              <div className="col-m2m-responsibility-sets">
                {client.responsibilitySets && client.responsibilitySets.length > 0 ? (
                  <ul className="responsibility-list">
                    {client.responsibilitySets.map((resp: any, i: number) => (
                      <li key={`${client.privateCode}-resp-${i}`}>{resp.name}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="no-responsibilities">None</span>
                )}
              </div>
              <div className="col-m2m-actions">
                <Edit
                  style={{
                    height: 20,
                    marginRight: 4,
                    width: 20,
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    color: 'rgba(25, 118, 210, 0.59)',
                  }}
                  onClick={() => openEditModal(client)}
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
                  onClick={() => handleOpenDeleteConfirmationDialog(client)}
                />
              </div>
            </div>
          );
        })}
        {(!m2mClients || m2mClients.length === 0) && (
          <div className="m2m-clients-empty">No machine-to-machine clients found</div>
        )}
      </div>
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
    </div>
  );
};

export default M2MClientsView;
