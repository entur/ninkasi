import React from 'react';
import { connect } from 'react-redux';
import '../sass/views/entityTypesView.scss';
import MdEdit from 'material-ui/svg-icons/image/edit';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ModalCreateEntityType from '../modals/ModalCreateEntityType';
import ModalEditEntiyType from '../modals/ModalEditEntityType';
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions';
import MdDelete from 'material-ui/svg-icons/action/delete';
import { sortByColumns } from '../utils/utils';


class EntityTypesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreateModalOpen: false,
      isEditModalOpen: false,
      activeEntityType: null,
      sortOrder: {
        column: null,
        asc: true
      }
    };
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

    if (sortOrder.column == column) {
      if (sortOrder.asc) {
        asc = false;
      }
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
    this.props.dispatch(
      OrganizationRegisterActions.deleteEntityType(entityType.id)
    );
  }

  componentWillReceiveProps(nextProps) {
    const { isCreateModalOpen, isEditModalOpen } = this.state;
    if (
      nextProps.status &&
      nextProps.status.error == null &&
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

    return (
      <div className="et-row">
        <div className="et-header">
          <div className="col-1-5">
           <span
              className="sortable"
              onClick={() => this.handleSortOrder('id')}
            >
              id
            </span>
          </div>
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
        </div>
        {sortedEntityTypes.map(et => {
          return (
            <div key={'et-' + et.id} className="et-row-item">
              <div className="col-1-5">{et.id}</div>
              <div className="col-1-5">{et.name}</div>
              <div className="col-1-5">{et.privateCode}</div>
              <div className="col-1-5">{et.codeSpace}</div>
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
                  onClick={() => this.handleDeleteEntityType(et)}
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
        <FloatingActionButton
          mini={true}
          style={{ float: 'right', marginRight: 10 }}
        >
          <ContentAdd
            onClick={() => this.setState({ isCreateModalOpen: true })}
          />
        </FloatingActionButton>
        {this.state.isCreateModalOpen
          ? <ModalCreateEntityType
              isModalOpen={this.state.isCreateModalOpen}
              codeSpaces={this.props.codeSpaces}
              handleCloseModal={() =>
                this.setState({ isCreateModalOpen: false })}
              takenPrivateCodes={entityTypes.map(et => et.privateCode)}
              handleSubmit={this.handleCreateEntity.bind(this)}
            />
          : null}
        {this.state.isEditModalOpen
          ? <ModalEditEntiyType
              isModalOpen={this.state.isEditModalOpen}
              entityType={this.state.activeEntityType}
              handleCloseModal={() => this.setState({ isEditModalOpen: false })}
              codeSpaces={this.props.codeSpaces}
              handleSubmit={this.handleUpdateEntity.bind(this)}
            />
          : null}
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
