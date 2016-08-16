import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'

class ChouetteJobDetails extends React.Component {

  render() {

    const {chouetteJobs} = this.props

    return <p>Chouette jobs: {chouetteJobs.length}</p>

  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    chouetteJobs: state.MardukReducer.chouetteJobStatus
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch,
    props: ownProps
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChouetteJobDetails)
