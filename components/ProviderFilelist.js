import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'

class ProviderFilelist extends React.Component {

  render() {

    const {files} = this.props

    if (files && files.length > 0) {
      return (

        <select multiple id="providerFilelist" className="multiselect">
        {files.map((file, index) => {
          return (
              <option key={index}>{file.name}</option>
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
)(ProviderFilelist)
