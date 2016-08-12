import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import { bindActionCreators } from 'redux'

import StatusEventList from './StatusEventList'

import Container from 'muicss/lib/react/container'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'

import SuppliersActions from '../actions/SuppliersActions'


import moment from 'moment'


class StatusList extends React.Component {

  handleToggleVisibility (id, event) {
    const {dispatch} = this.props

    console.log("event for toggleVisibilityForEvents", event)
    dispatch(SuppliersActions.toggleVisibilityForEvents(id))
  }

  render() {

    const {list} = this.props

    if (list && list.length) {
      return (
        <Container fluid={true}>
          <Row>
            <Col md="10">
              <h3>Job status</h3>
            </Col>
          </Row>
          <Row>
            <Col md="2">
              <p><b>correlationId</b></p>
            </Col>
            <Col md="2">
              <p><b>fileName</b></p>
            </Col>
            <Col md="2">
              <p><b>endState</b></p>
            </Col>
            <Col md="2">
              <p><b>lastEvent</b></p>
            </Col>
            <Col md="2">
              <p><b>lastEvent</b></p>
            </Col>
            <Col md="2">
              <p><b>duration</b></p>
            </Col>
          </Row>
            {list.map( (listItem,index) => {
              return (
                <div key={"jobstatus-wrapper-" + index} onClick={(event) => this.handleToggleVisibility(index, event)} >
                  <Row key={"listItem-" + index}>
                    <Col md="2">
                      <p>{listItem.correlationId}</p>
                    </Col>
                    <Col md="2">
                      <p>{listItem.fileName}</p>
                    </Col>
                    <Col md="2">
                      <p>{listItem.endState}</p>
                    </Col>
                    <Col md="2">
                      <p>{moment(listItem.firstEvent).utc().locale("nb").format("Do MMMM YYYY, HH:mm:ss")}</p>
                    </Col>
                    <Col md="2">
                      <p>{moment(listItem.lastEvent).utc().locale("nb").format("Do MMMM YYYY, HH:mm:ss")}</p>
                    </Col>
                    <Col md="2">
                      <p>{moment(listItem.lastEvent-listItem.firstEvent).utc().locale("nb").format("HH:mm:ss")}</p>
                    </Col>
                  </Row>
                  <Row>
                    <StatusEventList key={"statusEventList-" + index} refId={index} events={listItem.events}></StatusEventList>
                  </Row>
                </div>
              )
            })}
            </Container>
      )

    } else {
      return (
        <Container fluid={true}>
          <Row>
            <Col md="8">
              <p>No status found</p>
            </Col>
          </Row>
        </Container>
      )
    }

  }
}


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(null, mapDispatchToProps)(StatusList)
