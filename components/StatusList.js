import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import { bindActionCreators } from 'redux'

import StatusEventList from './StatusEventList'

import Container from 'muicss/lib/react/container'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'

import SuppliersActions from '../actions/SuppliersActions'

class StatusList extends React.Component {


  componentWillMount(){
    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this))
  }

  handleToggleVisibility (id) {
    const {dispatch} = this.props
    dispatch(SuppliersActions.toggleExpandableEventsContent(id))
  }

  handlePageClick (e, pageIndex) {
    e.preventDefault()
    const {dispatch} = this.props
    dispatch(SuppliersActions.setActivePageIndex(pageIndex))
  }

  render() {

    const {page, paginationMap, activePageIndex} = this.props

    if (page && page.length && paginationMap) {

      return (

        <div>

          <Container fluid={true}>
            <Row>
              <Col md="12">
                <h3>Events</h3>
              </Col>
            </Row>
            <Row>
              <div className="page-link-parent">
                <span>Pages: </span>
                {paginationMap.map ( (page, index) => {
                  const isActive = (index == activePageIndex) ? 'page-link active-link' : 'page-link inactive-link'
                  return <span className={isActive} onClick={(e) => this.handlePageClick(e, index)} key={"link-" + index}>{index}</span>
                })}
              </div>
            </Row>
            <Row>
              <Col md="2">
                <p><b>Correlation id</b></p>
              </Col>
              <Col md="3">
                <p><b>Filename</b></p>
              </Col>
              <Col md="1">
                <p><b>End state</b></p>
              </Col>
              <Col md="2">
                <p><b>First event</b></p>
              </Col>
              <Col md="2">
                <p><b>Last Event</b></p>
              </Col>
              <Col md="2">
                <p><b>Duration</b></p>
              </Col>
            </Row>
          </Container>

          <Container fluid={true}>

            {page.map ( (listItem, index) => {

              const endStateClass = (listItem.endState === 'TIMEOUT' || listItem.endState === 'ERROR' || listItem.endState === 'FAILED') ? 'error' : 'success'

              return (

                <div className="jobstatus-wrapper" key={"jobstatus-wrapper-" + index} onClick={() => this.handleToggleVisibility(index)}>
                  <Row key={"k-" + index}>
                    <Col md="2">
                      <p>{listItem.correlationId}</p>
                    </Col>
                    <Col md="3"><p><span className="long-text">{listItem.fileName}</span></p></Col>
                    <Col md="1"><p><span className={endStateClass}>{listItem.endState}</span></p></Col>
                    <Col md="2"><p>{listItem.firstEvent}</p></Col>
                    <Col md="2"><p>{listItem.lastEvent}</p></Col>
                    <Col md="2"><p>{listItem.duration}</p></Col>
                  </Row>
                  <Row key={"k2-" + index}>
                    <StatusEventList key={"statusEventList-" + index} refId={index} events={listItem.events}></StatusEventList>
                  </Row>
                </div>
              )
            })}
          </Container>

        </div>

      )

    } else {
      return (
        <Container className="jobstatus-wrapper" fluid={true}>
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

const mapStateToProps = (state, ownProps) => {

  var paginationMap = []
  var list = state.SuppliersReducer.statusList

  if (list && list.length) {
    for (let i = 0, j = list.length; i < j; i+=10) {
      paginationMap.push(list.slice(i,i+10))
    }
  }

  return {
    activePageIndex: state.UtilsReducer.activePageIndex,
    page: paginationMap[state.UtilsReducer.activePageIndex],
    paginationMap: paginationMap
  }
}


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusList)
