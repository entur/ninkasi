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
import './organizationView.scss';
import { Edit } from '@mui/icons-material';
import { Fab } from '@mui/material';
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';
import { Add } from '@mui/icons-material';
import { connect } from 'react-redux';
import ModalCreateOrganization from 'modals/ModalCreateOrganization';
import ModalEditOrganization from 'modals/ModalEditOrganization';
import { Delete } from '@mui/icons-material';
import { sortByColumns } from 'utils';
import ModalConfirmation from 'modals/ModalConfirmation';

class OrganizationView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreateModalOpen: false,
      isDeleteConfirmationOpen: false,
      isEditModalOpen: false,
      activeOrganization: null,
      sortOrder: {
        column: 'name',
        asc: true,
      },
    };
  }

  getDeleteConfirmationTitle() {
    const { activeOrganization } = this.state;
    const organization = activeOrganization ? activeOrganization.name : 'N/A';
    return `Delete organization ${organization}`;
  }

  openModalWindow() {
    this.setState({
      isCreateModalOpen: true,
    });
  }

  handleCloseDeleteConfirmation() {
    this.setState({
      activeOrganization: null,
      isDeleteConfirmationOpen: false,
    });
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

  componentDidMount() {
    const { getToken } = this.props;
    this.props.dispatch(OrganizationRegisterActions.getOrganizations(getToken));
    this.props.dispatch(OrganizationRegisterActions.getCodeSpaces(getToken));
  }

  handleCreateOrganization(organization) {
    const { getToken } = this.props;
    this.props.dispatch(OrganizationRegisterActions.createOrganization(organization, getToken));
  }

  handleUpdateOrganization(organization) {
    const { getToken } = this.props;
    this.props.dispatch(OrganizationRegisterActions.updateOrganization(organization, getToken));
  }

  handleEditOrganization(organization) {
    this.setState({
      activeOrganization: organization,
      isEditModalOpen: true,
    });
  }

  handleDeleteOrganization(organization) {
    this.handleCloseDeleteConfirmation();
    const { getToken } = this.props;
    this.props.dispatch(OrganizationRegisterActions.deleteOrganization(organization.id, getToken));
  }

  handleOpenDeleteConfirmationDialog(activeOrganization) {
    this.setState({
      activeOrganization,
      isDeleteConfirmationOpen: true,
    });
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

  render() {
    const { organizations, codeSpaces } = this.props;
    const { activeOrganization, isCreateModalOpen, isEditModalOpen, sortOrder } = this.state;

    const sortedOrganizations = sortByColumns(organizations, sortOrder);
    const confirmDeleteTitle = this.getDeleteConfirmationTitle();

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Fab
            size="small"
            style={{ float: 'right', marginRight: 10, cursor: 'pointer' }}
            onClick={() => this.openModalWindow()}
          >
            <Add />
          </Fab>
        </div>
        <div className="organization-row">
          <div className="organization-header">
            <div className="col-1-6">
              <span className="sortable" onClick={() => this.handleSortOrder('name')}>
                name
              </span>
            </div>
            <div className="col-1-6">
              <span className="sortable" onClick={() => this.handleSortOrder('id')}>
                id
              </span>
            </div>
            <div className="col-1-6">
              <span className="sortable" onClick={() => this.handleSortOrder('organisationType')}>
                organisation type
              </span>
            </div>
            <div className="col-1-6">
              <span className="sortable" onClick={() => this.handleSortOrder('privateCode')}>
                private code
              </span>
            </div>
            <div className="col-1-6">
              <span className="sortable" onClick={() => this.handleSortOrder('codeSpace')}>
                code space
              </span>
            </div>
          </div>
          {sortedOrganizations.map(organization => {
            return (
              <div key={'organization-' + organization.id} className="organization-row-item">
                <div className="col-1-6">{organization.name}</div>
                <div className="col-1-6">{organization.id}</div>
                <div className="col-1-6">{organization.organisationType}</div>
                <div className="col-1-6">{organization.privateCode}</div>
                <div className="col-1-6">{organization.codeSpace}</div>
                <div className="col-icon" style={{ cursor: 'pointer' }}>
                  <Delete
                    color="#fa7b81"
                    style={{
                      height: 20,
                      width: 20,
                      marginRight: 10,
                      verticalAlign: 'middle',
                      cursor: 'pointer',
                    }}
                    onClick={() => this.handleOpenDeleteConfirmationDialog(organization)}
                  />
                  <Edit
                    color="rgba(25, 118, 210, 0.59)"
                    onClick={() => this.handleEditOrganization(organization)}
                    style={{ height: 20, width: 20, verticalAlign: 'middle' }}
                  />
                </div>
              </div>
            );
          })}
          {isCreateModalOpen ? (
            <ModalCreateOrganization
              isModalOpen={isCreateModalOpen}
              handleCloseModal={() => this.setState({ isCreateModalOpen: false })}
              takenOrganizationNames={organizations.map(org => org.name)}
              takenOrganizationPrivateCodes={organizations.map(org => org.privateCode)}
              codeSpaces={codeSpaces}
              organization={activeOrganization}
              handleSubmit={this.handleCreateOrganization.bind(this)}
            />
          ) : null}

          {isEditModalOpen ? (
            <ModalEditOrganization
              isModalOpen={isEditModalOpen}
              handleCloseModal={() => this.setState({ isEditModalOpen: false })}
              takenOrganizationNames={organizations.map(org => org.name)}
              takenOrganizationPrivateCodes={organizations.map(org => org.privateCode)}
              organization={this.state.activeOrganization}
              codeSpaces={codeSpaces}
              handleSubmit={this.handleUpdateOrganization.bind(this)}
            />
          ) : null}
          <ModalConfirmation
            open={this.state.isDeleteConfirmationOpen}
            title={confirmDeleteTitle}
            actionBtnTitle="Delete"
            body="You are about to delete current organization. Are you sure?"
            handleSubmit={() => {
              this.handleDeleteOrganization(this.state.activeOrganization);
            }}
            handleClose={() => {
              this.handleCloseDeleteConfirmation();
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  organizations: state.OrganizationReducer.organizations,
  codeSpaces: state.OrganizationReducer.codeSpaces,
  status: state.OrganizationReducer.organizationStatus,
});

export default connect(mapStateToProps)(withAuth(OrganizationView));
