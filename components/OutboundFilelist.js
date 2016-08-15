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
            <i> No files are currently outbound</i>
        )
    }

  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    state: state,
    props: ownProps
  }
}

export default connect(
  mapStateToProps,
  null
)(OutboundFilelist)
