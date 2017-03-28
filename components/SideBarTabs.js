import React from 'react'
import SideBarTabsElement from './SideBarTabsElement'

class SideBarTabs extends React.Component {

  constructor(props) {
    super(props)
  }

  setActiveTab(value) {
    this.props.setActiveTab(value)
  }

  render () {

    const style = {
      maxWidth: 120,
      fontSize: '0.9em',
      marginRight: 10,
    }

    const { activeTab } = this.props

    return (
      <div style={style}>
        <SideBarTabsElement
          label="Users"
          active={activeTab === 0}
          onClick={() => this.setActiveTab(0)}
        />
        <SideBarTabsElement
          label="Organizations"
          active={activeTab === 2}
          onClick={() => this.setActiveTab(2)}
        />
        <SideBarTabsElement
          label="Roles"
          active={activeTab === 1}
          onClick={() => this.setActiveTab(1)}
        />
        <SideBarTabsElement
          label="Responsibility sets"
          active={activeTab === 3}
          onClick={() => this.setActiveTab(3)}
        />
        <SideBarTabsElement
          label="Entity types"
          active={activeTab === 4}
          onClick={() => this.setActiveTab(4)}
        />
      </div>
    )
  }

}

export default SideBarTabs