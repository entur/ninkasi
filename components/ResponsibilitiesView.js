import React from 'react';
import { connect } from 'react-redux';
import '../sass/views/responsibilityView.scss';
import MdEdit from 'material-ui/svg-icons/image/edit';
import MdDelete from 'material-ui/svg-icons/action/delete';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions';
import ResponsbilityRoleAssignments from '../modals/ResponsbilityRoleAssignments';
import ModalCreateResponsibilitySet from '../modals/ModalCreateResponsibilitySet';
import ModalEditResponsibilitySet from '../modals/ModalEditResponsibilitySet';
import { sortByColumns } from '../utils/index';

const initialState = {
  isCreatingResponsibilitySet: false,
  isEditingResponsibilitySet: false,
  activeResponsibilitySet: null,
  sortOrder: {
    column: 'name',
    asc: true
  }
};

class ResponsibilitiesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status && nextProps.status.error == null) {
      this.setState({
        isCreatingResponsibilitySet: false,
        isEditingResponsibilitySet: false
      });
    }
  }

  handleSortOrder(column) {
    const { sortOrder } = this.state;
    let asc = true;

    if (sortOrder.column == column) {
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
    this.props.dispatch(OrganizationRegisterActions.getResponbilitySets());
    this.props.dispatch(OrganizationRegisterActions.getCodeSpaces());
    this.props.dispatch(OrganizationRegisterActions.getRoles());
    this.props.dispatch(OrganizationRegisterActions.getOrganizations());
    this.props.dispatch(OrganizationRegisterActions.getEntityTypes());

    if (!this.props.administrativeZones.length) {
      this.props.dispatch(OrganizationRegisterActions.getAdministrativeZones());
    }
  }

  handleCreateResponsibilitySet(responsibilitySet) {
    this.props.dispatch(
      OrganizationRegisterActions.createResponsibilitySet(responsibilitySet)
    );
  }

  handleUpdateResponsibilitySet(responsibilitySet) {
    this.props.dispatch(
      OrganizationRegisterActions.updateResponsibilitySet(responsibilitySet)
    );
  }

  handleDeleteResponsibility(responsibility) {
    this.props.dispatch(
      OrganizationRegisterActions.deleteResponsibilitySet(responsibility.id)
    );
  }

  render() {
    const {
      responsibilities,
      codeSpaces,
      roles,
      organizations,
      administrativeZones,
      entityTypes
    } = this.props;
    const {
      isCreatingResponsibilitySet,
      isEditingResponsibilitySet,
      activeResponsibilitySet,
      sortOrder
    } = this.state;

    const sortedResponsibilities = sortByColumns(responsibilities, sortOrder);

    return (
      <div className="responsibility-row">
        <div className="responsibility-header">
          <div className="col-1-6">
            <span
              className="sortable"
              onClick={() => this.handleSortOrder('name')}
            >
              name
            </span>
          </div>
          <div className="col-1-6">
            <span
              className="sortable"
              onClick={() => this.handleSortOrder('id')}
            >
              id
            </span>
          </div>
          <div className="col-1-7">
            <span
              className="sortable"
              onClick={() => this.handleSortOrder('privateCode')}
            >
              private code
            </span>
          </div>
          <div className="col-1-6">Roles assignments</div>
        </div>
        {sortedResponsibilities.map(responsibility => {
          return (
            <div
              key={'responsibility-' + responsibility.id}
              className="resp-row-item"
            >
              <div className="col-1-6">{responsibility.name}</div>
              <div className="col-1-6">{responsibility.id}</div>
              <div className="col-1-7">{responsibility.privateCode}</div>
              <div className="col-1-3">
                  <ResponsbilityRoleAssignments
                    roleAssignments={responsibility.roles}
                    organizations={organizations}
                    adminZones={administrativeZones}
                  />
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
                  onClick={() =>
                    this.handleDeleteResponsibility(responsibility)}
                />
                <MdEdit
                  color="rgba(25, 118, 210, 0.59)"
                  style={{
                    height: 20,
                    width: 20,
                    verticalAlign: 'middle',
                    cursor: 'pointer'
                  }}
                  onClick={() =>
                    this.setState({
                      isEditingResponsibilitySet: true,
                      activeResponsibilitySet: responsibility
                    })}
                />
              </div>
            </div>
          );
        })}
        <FloatingActionButton
          mini={true}
          style={{ float: 'right', marginRight: 10 }}
          onClick={() => this.setState({ isCreatingResponsibilitySet: true })}
        >
          <ContentAdd />
        </FloatingActionButton>
        {isCreatingResponsibilitySet
          ? <ModalCreateResponsibilitySet
              modalOpen={isCreatingResponsibilitySet}
              codeSpaces={codeSpaces}
              handleOnClose={() =>
                this.setState({ isCreatingResponsibilitySet: false })}
              takenPrivateCodes={responsibilities.map(r => r.privateCode)}
              roles={roles}
              organizations={organizations}
              handleSubmit={this.handleCreateResponsibilitySet.bind(this)}
              entityTypes={entityTypes}
              administrativeZones={this.props.administrativeZones}
            />
          : null}
        {isEditingResponsibilitySet
          ? <ModalEditResponsibilitySet
              modalOpen={isEditingResponsibilitySet}
              responsibilitySet={activeResponsibilitySet}
              codeSpaces={codeSpaces}
              handleOnClose={() =>
                this.setState({ isEditingResponsibilitySet: false })}
              takenPrivateCodes={responsibilities.map(r => r.privateCode)}
              roles={roles}
              organizations={organizations}
              handleSubmit={this.handleUpdateResponsibilitySet.bind(this)}
              entityTypes={entityTypes}
              administrativeZones={this.props.administrativeZones}
            />
          : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  responsibilities: state.OrganizationReducer.responsibilities,
  codeSpaces: state.OrganizationReducer.codeSpaces,
  roles: state.OrganizationReducer.roles,
  organizations: state.OrganizationReducer.organizations,
  status: state.OrganizationReducer.responsibilitySetStatus,
  entityTypes: state.OrganizationReducer.entityTypes,
  administrativeZones: state.OrganizationReducer.administrativeZones
});

export default connect(mapStateToProps)(ResponsibilitiesView);
