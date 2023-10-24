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
import { connect } from 'react-redux';
import './entityTypesView.scss';
import MdEdit from 'material-ui/svg-icons/image/edit';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ModalCreateEntityType from 'modals/ModalCreateEntityType';
import ModalEditEntiyType from 'modals/ModalEditEntityType';
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';
import MdDelete from 'material-ui/svg-icons/action/delete';
import { sortByColumns } from 'utils';
import ModalConfirmation from 'modals/ModalConfirmation';

class EntityTypesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreateModalOpen: false,
      isEditModalOpen: false,
      isDeleteConfirmationOpen: false,
      activeEntityType: null,
      sortOrder: {
        column: 'name',
        asc: true
      }
    };
  }

  handleOpenDeleteConfirmationDialog(activeEntityType) {
    this.setState({
      activeEntityType,
      isDeleteConfirmationOpen: true
    });
  }

  handleCloseDeleteConfirmation() {
    this.setState({
      activeEntityType: null,
      isDeleteConfirmationOpen: false
    });
  }

  handleEditEntityType(entityType) {
    this.setState({
      activeEntityType: entityType,
      isEditModalOpen: true
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
        asc
      }
    });
  }

  componentDidMount() {
    this.props.dispatch(OrganizationRegisterActions.getEntityTypes());
    this.props.dispatch(OrganizationRegisterActions.getCodeSpaces());
  }

  handleCreateEntity(entityType) {
    this.props.dispatch(
      OrganizationRegisterActions.createEntityType(entityType)
    );
  }

  handleUpdateEntity(entityType) {
    this.props.dispatch(
      OrganizationRegisterActions.updateEntityType(entityType)
    );
  }

  handleDeleteEntityType(entityType) {
    this.handleCloseDeleteConfirmation();
    this.props.dispatch(
      OrganizationRegisterActions.deleteEntityType(entityType.id)
    );
  }

  getDeleteConfirmationTitle() {
    const { activeEntityType } = this.state;
    let entityType = activeEntityType ? activeEntityType.name : 'N/A';
    return `Delete entity type ${entityType}`;
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
        isEditModalOpen: false
      });
    }
  }

  render() {
    const { entityTypes } = this.props;
    const { sortOrder } = this.state;

    const sortedEntityTypes = sortByColumns(entityTypes, sortOrder);
    const confirmDeleteTitle = this.getDeleteConfirmationTitle();

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FloatingActionButton
            mini={true}
            style={{ float: 'right', marginRight: 10 }}
          >
            <ContentAdd
              onClick={() => this.setState({ isCreateModalOpen: true })}
            />
          </FloatingActionButton>
        </div>
        <div className="et-row">
          <div className="et-header">
            <div className="col-1-5">
              <span
                className="sortable"
                onClick={() => this.handleSortOrder('name')}
              >
                name
              </span>
            </div>
            <div className="col-1-5">
              <span
                className="sortable"
                onClick={() => this.handleSortOrder('privateCode')}
              >
                private code
              </span>
            </div>
            <div className="col-1-5">
              <span
                className="sortable"
                onClick={() => this.handleSortOrder('codeSpace')}
              >
                code space
              </span>
            </div>
            <div className="col-1-5">
              <span>Classifications</span>
            </div>
          </div>
          {sortedEntityTypes.map(et => {
            return (
              <div key={'et-' + et.id} className="et-row-item">
                <div className="col-1-5">{et.name}</div>
                <div className="col-1-5">{et.privateCode}</div>
                <div className="col-1-5">{et.codeSpace}</div>
                <div className="col-1-5">
                  <ul
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      listStyleType: 'circle'
                    }}
                  >
                    {et.classifications
                      ? et.classifications
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((ec, i) => <li key={ec.id}>{ec.name} </li>)
                      : null}
                  </ul>
                </div>
                <div className="col-icon" style={{ cursor: 'pointer' }}>
                  <MdDelete
                    color="#fa7b81"
                    style={{
                      height: 20,
                      width: 20,
                      marginRight: 10,
                      verticalAlign: 'middle',
                      cursor: 'pointer'
                    }}
                    onClick={() => this.handleOpenDeleteConfirmationDialog(et)}
                  />
                  <MdEdit
                    color="rgba(25, 118, 210, 0.59)"
                    style={{
                      height: 20,
                      width: 20,
                      verticalAlign: 'middle',
                      cursor: 'pointer'
                    }}
                    onClick={() => this.handleEditEntityType(et)}
                  />
                </div>
              </div>
            );
          })}
          {this.state.isCreateModalOpen ? (
            <ModalCreateEntityType
              isModalOpen={this.state.isCreateModalOpen}
              codeSpaces={this.props.codeSpaces}
              handleCloseModal={() =>
                this.setState({ isCreateModalOpen: false })
              }
              takenPrivateCodes={entityTypes.map(et => et.privateCode)}
              handleSubmit={this.handleCreateEntity.bind(this)}
            />
          ) : null}
          {this.state.isEditModalOpen ? (
            <ModalEditEntiyType
              isModalOpen={this.state.isEditModalOpen}
              entityType={this.state.activeEntityType}
              handleCloseModal={() => this.setState({ isEditModalOpen: false })}
              codeSpaces={this.props.codeSpaces}
              handleSubmit={this.handleUpdateEntity.bind(this)}
            />
          ) : null}
          <ModalConfirmation
            open={this.state.isDeleteConfirmationOpen}
            title={confirmDeleteTitle}
            actionBtnTitle="Delete"
            body="You are about to delete current entity type. Are you sure?"
            handleSubmit={() => {
              this.handleDeleteEntityType(this.state.activeEntityType);
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
  entityTypes: state.OrganizationReducer.entityTypes,
  status: state.OrganizationReducer.entityTypeStatus,
  codeSpaces: state.OrganizationReducer.codeSpaces
});

export default connect(mapStateToProps)(EntityTypesView);
