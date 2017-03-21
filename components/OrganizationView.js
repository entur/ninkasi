import React from 'react'
import organizations from '../mock/models/organizations.json'
import '../sass/views/organizationView.scss'
import MdEdit from 'material-ui/svg-icons/image/edit'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'


class OrganizationView extends React.Component {

  render() {
    return (
      <div className="organization-row">
        <div className="organization-header">
          <div className="col-1-4">id</div>
          <div className="col-1-4">name</div>
          <div className="col-1-4">organisation Type</div>
        </div>
        {
          organizations.map( organization => {
            return (
              <div key={'organization-' + organization.id}>
                <div className="col-1-4">{ organization.id }</div>
                <div className="col-1-4">{ organization.name }</div>
                <div className="col-1-4">{ organization.organisationType }</div>
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

export default OrganizationView