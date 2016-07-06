import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addNotification } from '../actions/SuppliersActions'
import NotificationSystem from 'react-notification-system'
import cfgreader from './readConfig'

class NotificationContainer extends Component {

  componentDidMount() {
    cfgreader.readConfig( (function(config) {
      window.config = config
      this.notificationSystem = this.refs.notificationSystem
    }).bind(this));
  }

  componentWillReceiveProps(newProps) {
    const { message, level } = newProps.notification;
    this.notificationSystem.addNotification({
      message,
      level
    })
  }

  render() {
    return (
      <NotificationSystem ref="notificationSystem" />
    )
  }
}

function mapStateToProps(state) {
  return {
    notification: state.suppliersReducer.notification
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      addNotification
    }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationContainer)
