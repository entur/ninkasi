import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import cfgreader from './readConfig'

class Multiselect extends React.Component {
  componentDidMount() {
    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this));
  }

  render() {

    const { store }  = this.props
    const files = this.props.data || []

    return (

      <select multiple size={files.length}>
      {files.map(file => {
        return (
            <option>{file.name}</option>
        )
      })}
      </select>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  var files = [
    {name: "/files/some/path/20-20-01"},
    {name: "/files/some/path/20-20-02"},
    {name: "/files/some/path/20-20-03"}
  ]

  return {
    data: files
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
