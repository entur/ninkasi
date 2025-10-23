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

import React from 'react';
import withAuth from 'utils/withAuth';
import './m2mClientsView.scss';
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';
import { connect } from 'react-redux';
import { Edit, Delete } from '@mui/icons-material';
import { Fab } from '@mui/material';
import { Add } from '@mui/icons-material';
import ModalCreateM2MClient from 'modals/ModalCreateM2MClient';
import ModalEditM2MClient from 'modals/ModalEditM2MClient';
import ModalConfirmation from 'modals/ModalConfirmation';

class M2MClientsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortOrder: {
        column: 'name',
        asc: true,
      },
      isCreateModalOpen: false,
      isEditModalOpen: false,
      isDeleteConfirmationOpen: false,
      activeClient: null,
    };
  }

  componentDidMount() {
    const { getToken } = this.props;
    this.props.dispatch(OrganizationRegisterActions.getM2MClients(getToken));
    this.props.dispatch(OrganizationRegisterActions.getResponbilitySets(getToken));
  }

  handleCreateClient(client) {
    const { getToken } = this.props;
    this.props.dispatch(OrganizationRegisterActions.createM2MClient(client, getToken));
  }

  handleUpdateClient(client) {
    const { getToken } = this.props;
    this.props.dispatch(OrganizationRegisterActions.updateM2MClient(client, getToken));
  }

  handleDeleteClient(client) {
    this.handleCloseDeleteConfirmation();
    const { getToken } = this.props;
    this.props.dispatch(OrganizationRegisterActions.deleteM2MClient(client.privateCode, getToken));
  }

  handleCloseDeleteConfirmation() {
    this.setState({
      activeClient: null,
      isDeleteConfirmationOpen: false,
    });
  }

  handleOpenDeleteConfirmationDialog(activeClient) {
    this.setState({
      activeClient,
      isDeleteConfirmationOpen: true,
    });
  }

  openModal(activeClient, attribute) {
    this.setState({
      activeClient,
      [attribute]: true,
    });
  }

  getDeleteConfirmationTitle() {
    const { activeClient } = this.state;
    const clientName = activeClient ? activeClient.name : 'N/A';
    return `Delete M2M client ${clientName}`;
  }

  componentWillReceiveProps(nextProps) {
    const { isCreateModalOpen, isEditModalOpen } = this.state;
    if (
      nextProps.status &&
      nextProps.status.error === null &&
      (isCreateModalOpen || isEditModalOpen)
    ) {
      this.setState({
        isCreateModalOpen: false,
        isEditModalOpen: false,
      });
    }
  }

  handleSortOrder(column) {
    const { sortOrder } = this.state;
    let asc = true;

    if (sortOrder.column === column) {
      asc = !sortOrder.asc;
    }

    this.setState({
      sortOrder: {
        column,
        asc,
      },
    });
  }

  sortClients(clients, sortOrder) {
    const sorted = [...clients].sort((a, b) => {
      let aVal = a[sortOrder.column];
      let bVal = b[sortOrder.column];

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
  }

  getEnturPartnerUrl(issuer, clientId) {
    const baseUrl = window.config.enturPartnerUrl;
    const issuerPath = issuer.toLowerCase() === 'internal' ? 'internal' : 'partner';
    return `${baseUrl}/permission-admin/clients/view/${issuerPath}/${clientId}`;
  }

  render() {
    const { m2mClients, responsibilities } = this.props;
    const {
      sortOrder,
      isCreateModalOpen,
      isEditModalOpen,
      isDeleteConfirmationOpen,
      activeClient,
    } = this.state;

    const sortedClients = this.sortClients(m2mClients || [], sortOrder);
    const confirmDeleteTitle = this.getDeleteConfirmationTitle();

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
          <Fab
            size="small"
            style={{ marginRight: 10 }}
            onClick={() => this.openModal(null, 'isCreateModalOpen')}
          >
            <Add />
          </Fab>
        </div>
        <div className="m2m-clients-row">
          <div className="m2m-clients-header">
            <div className="col-m2m-name">
              <span className="sortable" onClick={() => this.handleSortOrder('name')}>
                Name
              </span>
            </div>
            <div className="col-m2m-client-id">
              <span className="sortable" onClick={() => this.handleSortOrder('privateCode')}>
                Client Id
              </span>
            </div>
            <div className="col-m2m-org-id">
              <span
                className="sortable"
                onClick={() => this.handleSortOrder('enturOrganisationId')}
              >
                Entur Org Id
              </span>
            </div>
            <div className="col-m2m-issuer">
              <span className="sortable" onClick={() => this.handleSortOrder('issuer')}>
                Issuer
              </span>
            </div>
            <div className="col-m2m-responsibility-sets">
              <span className="sortable" onClick={() => this.handleSortOrder('responsibilitySets')}>
                Responsibility Sets
              </span>
            </div>
            <div className="col-m2m-actions">Actions</div>
          </div>
          {sortedClients.map(client => {
            const enturPartnerUrl = this.getEnturPartnerUrl(client.issuer, client.privateCode);
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
                      {client.responsibilitySets.map((resp, i) => (
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
                    onClick={() => this.openModal(client, 'isEditModalOpen')}
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
                    onClick={() => this.handleOpenDeleteConfirmationDialog(client)}
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
            handleCloseModal={() => this.setState({ isCreateModalOpen: false })}
            takenClientIds={m2mClients.map(client => client.privateCode)}
            responsibilities={responsibilities}
            handleSubmit={this.handleCreateClient.bind(this)}
          />
        )}
        {isEditModalOpen && (
          <ModalEditM2MClient
            isModalOpen={isEditModalOpen}
            handleCloseModal={() => this.setState({ isEditModalOpen: false })}
            client={activeClient}
            responsibilities={responsibilities}
            handleSubmit={this.handleUpdateClient.bind(this)}
          />
        )}
        <ModalConfirmation
          open={isDeleteConfirmationOpen}
          title={confirmDeleteTitle}
          actionBtnTitle="Delete"
          body="You are about to delete current M2M client. Are you sure?"
          handleSubmit={() => {
            this.handleDeleteClient(this.state.activeClient);
          }}
          handleClose={() => {
            this.handleCloseDeleteConfirmation();
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  m2mClients: state.OrganizationReducer.m2mClients,
  responsibilities: state.OrganizationReducer.responsibilities,
  status: state.OrganizationReducer.m2mClientStatus,
});

export default connect(mapStateToProps)(withAuth(M2MClientsView));
