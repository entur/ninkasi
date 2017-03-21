import React from 'react'

class SideBarTabsElement extends React.Component {

  render() {

    const { label, active, onClick } = this.props
    const style = {
      border: '1px solid 1px solid rgb(229, 229, 229)',
      cursor: 'pointer',
      padding: 10,
      borderRadius: 5,
      background: 'rgba(128, 128, 128, 0.17)',
      marginBottom: 10,
      color: '#454545'
    }

    const activeStyle = {
      background: '#39a1f4',
      color: '#fff'
    }

    const appliedStyle = active ? { ...style, ... activeStyle}  : style

    return (
      <div
        onClick={onClick}
        style={appliedStyle}>{ label }
      </div>
    )
  }

}

export default SideBarTabsElement