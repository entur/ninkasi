import React from 'react'
import '../sass/views/responsibilityView.scss'
import MdEdit from 'material-ui/svg-icons/image/edit'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions'
import ModalResponsibilityRolesView from '../containers/ModalResponsibilityRolesView'
import { connect } from 'react-redux'

const initialState = {
  rolesView: {
    roles: [],
    open: false,
    name: '',
  }
}

class ResponsibilitiesView extends React.Component {

  constructor(props) {
    super(props)
    this.state = initialState
  }

  componentWillMount() {
    this.props.dispatch(OrganizationRegisterActions.getResponsibilities())
  }

  render() {

    const { responsibilities } = this.props
    const { rolesView } = this.state

    return (
      <div className="responsibility-row">
        <div className="responsibility-header">
          <div className="col-1-5">Id</div>
          <div className="col-1-5">name</div>
          <div className="col-1-5">code space</div>
          <div className="col-1-5">private code</div>
          <div className="col-1-6">Roles</div>
        </div>
        {
          responsibilities.map( responsibility => {
            return (
              <div key={'responsibility-' + responsibility.id}>
                <div className="col-1-5">{ responsibility.id }</div>
                <div className="col-1-5">{ responsibility.name }</div>
                <div className="col-1-5">{ responsibility.codeSpace }</div>
                <div className="col-1-5">{ responsibility.privateCode }</div>
                <div className="col-1-6 expandable"
                  onClick={() => this.setState({
                    rolesView: {
                      roles: responsibility.roles,
                      open: true,
                      name: responsibility.name
                    }
                  })}
                >
                  { responsibility.roles.length }
                </div>
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
        { rolesView.open
          ? <ModalResponsibilityRolesView
              name={rolesView.name}
              roles={rolesView.roles}
              isModalOpen={rolesView.open}
              handleCloseModal={ () => this.setState(initialState)}
            />
          : null
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  responsibilities: state.OrganizationReducer.responsibilities
})

export default connect(mapStateToProps)(ResponsibilitiesView)