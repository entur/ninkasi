import React from 'react'
import SideBarTabs from '../components/SideBarTabs'
import UserView from '../components/UserView'
import OrganizationView from '../components/OrganizationView'
import RoleView from '../components/RoleView'

class OrganizationRegister extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      activeTab: 0
    }
  }

  setActiveTab(value) {
    this.setState({
      activeTab: value
    })
  }

  render() {

    const style = {
      display: 'flex',
    }

    const { activeTab } = this.state

    return (
      <div style={style}>
        <SideBarTabs activeTab={activeTab} setActiveTab={this.setActiveTab.bind(this)}/>
        <div style={{border: '1px solid rgb(229, 229, 229)', flex: 2}}>
          { activeTab == 0  ? <UserView/> : null }
          { activeTab == 1  ? <RoleView/> : null }
          { activeTab == 2  ? <OrganizationView/> : null }
        </div>
      </div>
    )
  }
}

export default OrganizationRegister