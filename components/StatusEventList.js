import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import { bindActionCreators } from 'redux'

import Container from 'muicss/lib/react/container'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'

import moment from 'moment'


class StatusEventList extends React.Component {

  render() {

    const {events, refId, visible_event_wrapper_id} = this.props

    const wrapperClassName = (visible_event_wrapper_id == refId) ? "visible-wrapper" : "hidden"

    return  (

        <div key={"action-wrapper-" + refId} className={wrapperClassName}>
          <p><b>Events</b></p>
          <Row>
            <Col md="4"><b>Action</b></Col>
            <Col md="4"><b>Date</b></Col>
            <Col md="4"><b>State</b></Col>
          </Row>
          <div className="mui--divider-bottom"></div>
          {events.map( (event, index) => {
            const stateClass = (event.state === 'TIMEOUT' || event.state === 'ERROR' || event.state === 'FAILED') ? 'error' : 'success'
            return (
              <Row key={"action-" + index}>
                <Col md="4" key={"event-action-" + index}>{event.action}</Col>
                <Col md="4" key={"event-date-" + index}>{moment(event.date).utc().locale("nb").format("Do MMMM YYYY, HH:mm:ss")}</Col>
                <Col md="4" key={"event-state-" + index}><span className={stateClass}>{event.state}</span></Col>
              </Row>
            )
          })}
        </div>
    )

  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    visible_event_wrapper_id: state.UtilsReducer.visible_event_wrapper_id
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch,
    props: ownProps
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(StatusEventList)
