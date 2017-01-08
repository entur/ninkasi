import React from 'react'

class Header extends React.Component {

  render() {

    const backgroundStyle = {
      backgroundColor: '#2f2f2f',
      width: '100%',
      height: 40,
      color: '#fff'
    }

    const textStyle = {
      fontSize: '1.6em',
      fontWeight: 500,
      padding: 5,
    }

    return (
      <div style={backgroundStyle}>
        <div style={textStyle}>
            Ninkasi
        </div>
      </div>
    )
  }
}


export default Header