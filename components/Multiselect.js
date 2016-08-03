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

        <select multiple size={files.length} id="provider-files" className="multiselect">
        {files.map(file => {
          return (
              <option>{file.name}</option>
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
  if (state.mardukReducer.fetch_filesnames && state.mardukReducer.fetch_filesnames['files'] ) {
    return {
      files: state.mardukReducer.fetch_filesnames['files']
    }
  }
  return {
    files: []
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
