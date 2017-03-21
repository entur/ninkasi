import React from 'react'
import "../sass/views/roleView.scss"
import MdEdit from 'material-ui/svg-icons/image/edit'
import roles from '../mock/models/roles.json'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ModalEditRole from '../containers/ModalEditRole'


class RoleView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isModalOpen: false
    }
  }

  render() {
    return (
      <div className="role-row">
        <div className="role-header">
          <div className="col-1-4">id</div>
          <div className="col-1-4">name</div>
          <div className="col-1-4">privatecode</div>
        </div>
        {
          roles.map( role => {
            return (
              <div key={'role-' + role.id}>
                <div className="col-1-4">{ role.id }</div>
                <div className="col-1-4">{ role.name }</div>
                <div className="col-1-4">{ role.privateCode }</div>
                <div className="col-icon">
                  <MdEdit color="rgba(25, 118, 210, 0.59)" style={{height: 20, width: 20, verticalAlign: 'middle'}}/>
                </div>
              </div>
            )
          })
        }
        <FloatingActionButton mini={true} style={{float: 'right', marginRight: 10}}>
          <ContentAdd
            onClick={() => this.setState({isModalOpen: true})}
          />
        </FloatingActionButton>
        <ModalEditRole
          isModalOpen={this.state.isModalOpen}
          handleCloseModal={() => this.setState({isModalOpen: false})}
        />
      </div>
    )
  }

}

export default RoleView