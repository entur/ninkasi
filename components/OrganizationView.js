import React from 'react'
import '../sass/views/organizationView.scss'
import MdEdit from 'material-ui/svg-icons/image/edit'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { connect } from 'react-redux'
import ModalCreateOrganization from '../modals/ModalCreateOrganization'
import ModalEditOrganization from '../modals/ModalEditOrganization'
import MdDelete from 'material-ui/svg-icons/action/delete'

class OrganizationView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isCreateModalOpen: false,
      isEditModalOpen: false,
      activeOrganization: null,
    }
  }

  componentWillMount() {
    this.props.dispatch(OrganizationRegisterActions.getOrganizations())
    this.props.dispatch(OrganizationRegisterActions.getCodeSpaces())
  }

  handleCreateOrganization(organization) {
    this.props.dispatch(OrganizationRegisterActions.createOrganization(organization))
  }

  handleUpdateOrganization(organization) {
    this.props.dispatch(OrganizationRegisterActions.updateOrganization(organization))
  }

  handleEditOrganization(organization) {
    this.setState({
      activeOrganization: organization,
      isEditModalOpen: true
    })
  }

  handleDeleteOrganization(organization) {
    this.props.dispatch(OrganizationRegisterActions.deleteOrganization(organization.id))
  }

  componentWillReceiveProps(nextProps) {
    const { isCreateModalOpen, isEditModalOpen } = this.state
    if (nextProps.status && nextProps.status.error == null && (isCreateModalOpen || isEditModalOpen)) {
      this.setState({
        isCreateModalOpen: false,
        isEditModalOpen: false
      })
    }
  }

  render() {

    const { organizations, codeSpaces } = this.props
    const { activeOrganization, isCreateModalOpen, isEditModalOpen } = this.state

    return (
      <div className="organization-row">
        <div className="organization-header">
          <div className="col-1-6">id</div>
          <div className="col-1-6">name</div>
          <div className="col-1-6">organisation Type</div>
          <div className="col-1-6">private code</div>
          <div className="col-1-6">code space</div>
        </div>
        {
          organizations.map( organization => {
            return (
              <div key={'organization-' + organization.id} className='organization-row-item'>
                <div className="col-1-6">{ organization.id }</div>
                <div className="col-1-6">{ organization.name }</div>
                <div className="col-1-6">{ organization.organisationType }</div>
                <div className="col-1-6">{ organization.privateCode }</div>
                <div className="col-1-6">{ organization.codeSpace }</div>
                <div className="col-icon" style={{cursor: 'pointer'}}>
                  <MdDelete
                    color="#fa7b81" style={{height: 20, width: 20, marginRight: 10, verticalAlign: 'middle', cursor: 'pointer'}}
                    onClick={() => this.handleDeleteOrganization(organization)}
                  />
                  <MdEdit
                    color="rgba(25, 118, 210, 0.59)"
                    onClick={() => this.handleEditOrganization(organization)}
                    style={{height: 20, width: 20, verticalAlign: 'middle'}}
                  />
                </div>
              </div>
            )
          })
        }
        <FloatingActionButton mini={true} style={{float: 'right', marginRight: 10, cursor: 'pointer'}}>
          <ContentAdd
            onClick={() => this.setState({isCreateModalOpen: true})}
          />
        </FloatingActionButton>
        { isCreateModalOpen ?
          <ModalCreateOrganization
            isModalOpen={isCreateModalOpen}
            handleCloseModal={() => this.setState({isCreateModalOpen: false})}
            takenOrganizationNames={organizations.map( org => org.name)}
            takenOrganizationPrivateCodes={organizations.map( org => org.privateCode)}
            codeSpaces={codeSpaces}
            organization={activeOrganization}
            handleSubmit={this.handleCreateOrganization.bind(this)}
          />
          : null
        }

        { isEditModalOpen ?
          <ModalEditOrganization
            isModalOpen={isEditModalOpen}
            handleCloseModal={() => this.setState({isEditModalOpen: false})}
            takenOrganizationNames={organizations.map( org => org.name)}
            takenOrganizationPrivateCodes={organizations.map( org => org.privateCode)}
            organization={this.state.activeOrganization}
            codeSpaces={codeSpaces}
            handleSubmit={this.handleUpdateOrganization.bind(this)}
          />
          : null
        }

      </div>
    )
  }

}

const mapStateToProps = state => ({
  organizations: state.OrganizationReducer.organizations,
  codeSpaces: state.OrganizationReducer.codeSpaces,
  status: state.OrganizationReducer.organizationStatus,
})

export default connect(mapStateToProps)(OrganizationView)