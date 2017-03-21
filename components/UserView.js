import React from 'react'
import users from '../mock/models/users.json'
import '../sass/views/userView.scss'
import MdEdit from 'material-ui/svg-icons/image/edit'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'

class UserView extends React.Component {

  render() {

    return (
      <div className="user-row">
        <div className="user-header">
          <div className="col-1-5">Username</div>
          <div className="col-1-5">OrganisationRef</div>
          <div className="col-1-5">CodeSpace</div>
          <div className="col-1-5">PrivateCode</div>
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
                  <MdEdit color="rgba(25, 118, 210, 0.59)" style={{height: 20, width: 20, verticalAlign: 'middle'}}/>
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

export default UserView