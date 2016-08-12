import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import { bindActionCreators } from 'redux'

import Container from 'muicss/lib/react/container'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'


class StatusEventList extends React.Component {

  render() {

    const {events, refId} = this.props

    return  (

        <div key={"action-wrapper-" + refId} className="hidden">
          {events.map( (event, index) => {
            return (
              <Row key={"action-" + index}>
                <Col md="2" key={"event-action-" + index}>Action: {event.action}</Col>
                <Col md="2" key={"event-date-" + index}>Date: {event.date}</Col>
                <Col md="2" key={"event-started" + index}>Started: {event.started}</Col>
              </Row>
            )
          })}
        </div>
    )

  }
}

export default connect(null, null)(StatusEventList)
