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
import { getProvidersEnv } from 'config/themes';

class M2MClientsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortOrder: {
        column: 'name',
        asc: true,
      },
    };
  }

  componentDidMount() {
    const { getToken } = this.props;
    this.props.dispatch(OrganizationRegisterActions.getM2MClients(getToken));
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
    const env = getProvidersEnv(window.config.providersBaseUrl).toLowerCase();
    const baseUrl =
      env === 'prod' ? 'https://entur-partner.entur.org' : 'https://entur-partner.dev.entur.org';
    const issuerPath = issuer.toLowerCase() === 'internal' ? 'internal' : 'partner';
    return `${baseUrl}/permission-admin/clients/view/${issuerPath}/${clientId}`;
  }

  render() {
    const { m2mClients } = this.props;
    const { sortOrder } = this.state;

    const sortedClients = this.sortClients(m2mClients || [], sortOrder);

    return (
      <div>
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
              </div>
            );
          })}
          {(!m2mClients || m2mClients.length === 0) && (
            <div className="m2m-clients-empty">No machine-to-machine clients found</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  m2mClients: state.OrganizationReducer.m2mClients,
});

export default connect(mapStateToProps)(withAuth(M2MClientsView));
