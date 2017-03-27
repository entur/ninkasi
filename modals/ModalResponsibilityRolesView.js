import React, { Component, PropTypes } from 'react'
import Modal from './Modal'
import MdClose from 'material-ui/svg-icons/navigation/close'
import '../sass/views/responsibilityRolesView.scss'

class ModalResponsibilityRolesView extends React.Component {

  render() {

    const { isModalOpen, roles, name } = this.props

    const titleStyle = {
      fontSize: '2em',
      fontWeight: 600,
      margin: '10px auto 20px auto',
      textAlign: 'center',
      width: '100%',
    }

    return (
        <Modal isOpen={isModalOpen} onClose={() => this.props.handleCloseModal()} minWidth="70vw" minHeight="auto">
          <div style={{margin: '10px 0px 40px 10px'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={titleStyle}>Responsibility roles for { name } </div>
              <MdClose style={{marginRight: 10, cursor: 'pointer'}} onClick={() => this.props.handleCloseModal()}/>
            </div>
            <div className="resp-roles-row">
              <div className="resp-roles-header">
                <div className="col-1-4">type</div>
                <div className="col-1-4">organisation</div>
                <div className="col-1-6">entity class</div>
              </div>
              {
                roles.map( role => {
                  return (
                    <div key={'resp-role-' + role.id}>
                      <div className="col-1-4">{ role.typeOfResponsibilityRoleRef }</div>
                      <div className="col-1-4">{ role.responsibleOrganisationRef }</div>
                      <div className="col-1-6">
                        <ul style={{display: 'flex', flexFlow: 'row wrap', listStyleType: 'circle'}}>
                          { role.entityClassificationRefs
                            ? role.entityClassificationRefs.map( (ref,i) => (
                              <li key={i}>{ ref } </li>
                            ))
                            : null
                          }
                        </ul>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </Modal>
    )
  }
}


export default ModalResponsibilityRolesView
