import React from 'react'
import '../sass/views/userView.scss'
import MdEdit from 'material-ui/svg-icons/image/edit'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions'
import { connect } from 'react-redux'

class UserView extends React.Component {

  componentWillMount() {
    this.props.dispatch(OrganizationRegisterActions.getUsers())
  }

  render() {

    const { users } = this.props

    return (
      <div className="user-row">
        <div className="user-header">
          <div className="col-1-5">Username</div>
          <div className="col-1-5">OrganisationRef</div>
          <div className="col-1-5">Code Space</div>
          <div className="col-1-5">Private Code</div>
        </div>
        {
          users.map( user => {
            return (
              <div key={'user-' + user.id}>
                <div className="col-1-5">{ user.username }</div>
                <div className="col-1-5">{ user.organisationRef }</div>
                <div className="col-1-5">{ user.codeSpace }</div>
                <div className="col-1-5">{ user.privateCode }</div>
                <div className="col-icon">
                  <MdEdit color="rgba(25, 118, 210, 0.59)" style={{height: 20, width: 20, verticalAlign: 'middle', cursor: 'pointer'}}/>
                </div>
              </div>
            )
          })
        }
        <FloatingActionButton mini={true} style={{float: 'right', marginRight: 10}}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  users: state.OrganizationReducer.users
})

export default connect(mapStateToProps)(UserView)