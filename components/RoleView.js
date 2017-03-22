import React from 'react'
import "../sass/views/roleView.scss"
import MdEdit from 'material-ui/svg-icons/image/edit'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ModalEditRole from '../containers/ModalEditRole'
import ModalCreateRole from '../containers/ModalCreateRole'
import { connect } from 'react-redux'
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions'


class RoleView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isCreateModalOpen: false,
      isEditModalOpen: false,
      activeRole: null,
    }
  }


  handleEditRole(role) {
    this.setState({
      activeRole: role,
      isEditModalOpen: true
    })
  }

  componentWillMount() {
    this.props.dispatch(OrganizationRegisterActions.getRoles())
  }

  handleCreateRole(role) {
    this.props.dispatch(OrganizationRegisterActions.createRole(role))
  }

  handleUpdateRole(role) {
    this.props.dispatch(OrganizationRegisterActions.updateRole(role))
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

    const { roles } = this.props

    return (
      <div className="role-row">
        <div className="role-header">
          <div className="col-1-4">id</div>
          <div className="col-1-4">name</div>
          <div className="col-1-4">private code</div>
        </div>
        {
          roles.map( role => {
            return (
              <div key={'role-' + role.id}>
                <div className="col-1-4">{ role.id }</div>
                <div className="col-1-4">{ role.name }</div>
                <div className="col-1-4">{ role.privateCode }</div>
                <div className="col-icon"
                     onClick={() => this.handleEditRole(role)}
                >
                  <MdEdit
                    color="rgba(25, 118, 210, 0.59)"
                    style={{height: 20, width: 20, verticalAlign: 'middle', cursor: 'pointer'}}
                  />
                </div>
              </div>
            )
          })
        }
        <FloatingActionButton mini={true} style={{float: 'right', marginRight: 10}}>
          <ContentAdd
            onClick={() => this.setState({isCreateModalOpen: true})}
          />
        </FloatingActionButton>
        { this.state.isCreateModalOpen ?
          <ModalCreateRole
            isModalOpen={this.state.isCreateModalOpen}
            handleCloseModal={() => this.setState({isCreateModalOpen: false})}
            takenPrivateCodes={roles.map( role => role.privateCode)}
            handleSubmit={this.handleCreateRole.bind(this)}
          />
          : null
        }
        { this.state.isEditModalOpen ?
          <ModalEditRole
            isModalOpen={this.state.isEditModalOpen}
            role={this.state.activeRole}
            handleCloseModal={() => this.setState({isEditModalOpen: false})}
            handleSubmit={this.handleUpdateRole.bind(this)}
          />
          : null
        }
      </div>
    )
  }

}


const mapStateToProps = state => ({
  roles: state.OrganizationReducer.roles,
  status: state.OrganizationReducer.roleStatus
})

export default connect(mapStateToProps)(RoleView)