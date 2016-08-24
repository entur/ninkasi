import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'

class OutboundFilelist extends React.Component {

  render() {

    const {files} = this.props

    if (files && files.length) {
      return (

        <select id='outboundFilelist' multiple className="multiselect">
          {files.map((file,index) => {
            return (
                <option key={index}>{file}</option>
            )
          })}
        </select>
      )
    } else {
        return (
            <div className="no-files">No files are added to export.</div>
        )
    }

  }
}


export default connect(
  null,
  null
)(OutboundFilelist)
