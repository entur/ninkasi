import React from 'react'
import '../sass/views/userView.scss'
import MdEdit from 'material-ui/svg-icons/image/edit'
import MdDelete from 'material-ui/svg-icons/action/delete'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions'
import ModalCreateUser from '../modals/ModalCreateUser'
import ModalEditUser from '../modals/ModalEditUser'
import { connect } from 'react-redux'

class UserView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isCreateModalOpen: false,
      isEditModalOpen: false,
      activeUser: null,
    }
  }

  componentWillMount() {
    this.props.dispatch(OrganizationRegisterActions.getUsers())
    this.props.dispatch(OrganizationRegisterActions.getOrganizations())
    this.props.dispatch(OrganizationRegisterActions.getResponsibilities())
  }

  handleCreateUser(user) {
    this.props.dispatch(OrganizationRegisterActions.createUser(user))
  }

  handleUpdateUser(user) {
    this.props.dispatch(OrganizationRegisterActions.updateUser(user))
  }

  handleDeleteUser(user) {
    this.props.dispatch(OrganizationRegisterActions.deleteUser(user.id))
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

    const { users, organizations, responsibilities } = this.props
    const { isCreateModalOpen, isEditModalOpen } = this.state

    return (
      <div className="user-row">
        <div className="user-header">
          <div className="col-1-4">username</div>
          <div className="col-1-4">organisation</div>
          <div className="col-1-4">Responsiblity set</div>
        </div>
        {
          users.map( user => {
            return (
              <div key={'user-' + user.id}>
                <div className="col-1-4">{ user.username }</div>
                <div className="col-1-4">{ user.organisationRef }</div>
                <div className="col-1-4">
                  <ul style={{display: 'flex', flexDirection: 'column', listStyleType: 'circle'}}>
                    { user.responsibilitySetRefs
                      ? user.responsibilitySetRefs.map( (ref,i) => (
                        <li key={i}>{ ref } </li>
                      ))
                      : null
                    }
                  </ul>
                </div>
                <div className="col-icon">
                  <MdDelete
                    color="#fa7b81" style={{height: 20, width: 20, marginRight: 10, verticalAlign: 'middle', cursor: 'pointer'}}
                    onClick={() => this.handleDeleteUser(user)}
                  />
                  <MdEdit
                    color="rgba(25, 118, 210, 0.59)" style={{height: 20, width: 20, verticalAlign: 'middle', cursor: 'pointer'}}
                    onClick={() => this.setState({activeUser: user, isEditModalOpen: true})}
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
        { isCreateModalOpen
          ? <ModalCreateUser
              isModalOpen={isCreateModalOpen}
              handleCloseModal={() => this.setState({isCreateModalOpen: false})}
              takenUsernames={users.map( user => user.username)}
              organizations={organizations}
              responsibilities={responsibilities}
              handleSubmit={this.handleCreateUser.bind(this)}
          />
          : null
        }
        { isEditModalOpen
          ? <ModalEditUser
              isModalOpen={isEditModalOpen}
              handleCloseModal={() => this.setState({isEditModalOpen: false})}
              takenUsernames={users.map( user => user.username)}
              organizations={organizations}
              user={this.state.activeUser}
              responsibilities={responsibilities}
              handleSubmit={this.handleUpdateUser.bind(this)}
          />
          : null
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  users: state.OrganizationReducer.users,
  organizations: state.OrganizationReducer.organizations,
  responsibilities: state.OrganizationReducer.responsibilities,
  status: state.OrganizationReducer.userStatus
})

export default connect(mapStateToProps)(UserView)