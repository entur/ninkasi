import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import { bindActionCreators } from 'redux'

import Container from 'muicss/lib/react/container'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'

import moment from 'moment'


class StatusList extends React.Component {

  render() {

    const {list} = this.props

    if (list && list.length) {
      return (
        <Container fluid={true}>
          <Row>
            <Col md="8">
              <h3>Job status</h3>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <p><b>correlationId</b></p>
            </Col>
            <Col md="4">
              <p><b>fileName</b></p>
            </Col>
            <Col md="4">
              <p><b>lastEvent</b></p>
            </Col>
          </Row>
            {list.map((listItem,index) => {
              return (
                <Row key={index}>
                  <Col md="4">
                    <p>{listItem.correlationId}</p>
                  </Col>
                  <Col md="4">
                    <p>{listItem.fileName}</p>
                  </Col>
                  <Col md="4">
                    <p>{moment(listItem.lastEvent).locale("nb").format("Do MMMM YYYY, HH:mm:ss")}</p>
                  </Col>
                </Row>
              )
            })}
            </Container>
      )

    } else {
      return (
        <p>No status</p>
      )
    }

  }
}

export default connect(null, null)(StatusList)
