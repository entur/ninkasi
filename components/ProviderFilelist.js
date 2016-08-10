import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'

class ProviderFilelist extends React.Component {

  render() {

    const {files} = this.props

      return (

        <select multiple id="providerFilelist" className="multiselect">
        {files.map((file, index) => {
          return (
              <option key={index}>{file.name}</option>
          )
        })}
      </select>
      )
  }
}

export default connect(
)(ProviderFilelist)
