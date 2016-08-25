import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'

class Footer extends React.Component {

  render() {

    const versionString = "v. 0.1.0"

    return (
      <span className="version">{versionString}</span>
    )
  }
}

export default connect(
  null,
  null
)(Footer)
