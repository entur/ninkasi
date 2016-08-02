import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'

class Multiselect extends React.Component {

  render() {

    const {files} = this.props
    
    if (files) {
      return (

        <select multiple size={files.length} className="multiselect">
        {files.map(file => {
          return (
              <option>{file}</option>
          )
        })}
        </select>
      )
    } else {

      return (
        <p>Loading files ...</p>
      )

    }

  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    files: state.mardukReducer.fetch_filesnames || []
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Multiselect)
