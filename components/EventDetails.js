import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import { bindActionCreators } from 'redux'

import EventExpandableContent from './EventExpandableContent'

import Container from 'muicss/lib/react/container'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'
const FaChevronDown = require('react-icons/lib/fa/chevron-down')
const FaChevronUp  = require('react-icons/lib/fa/chevron-up')

import SuppliersActions from '../actions/SuppliersActions'

class EventDetails extends React.Component {

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

  handleSortForColumn(columnName) {
    const {dispatch} = this.props
    dispatch(SuppliersActions.sortListByColumn("events", columnName))
  }

  render() {

    const {page, paginationMap, activePageIndex, expandedEvents} = this.props

    if (page && page.length && paginationMap) {

      return (

        <div>
          <Container fluid={true}>
            <Row>
              <div className="page-link-parent">
                <span className="ml-17">Pages: </span>
                {paginationMap.map ( (page, index) => {
                  const isActive = (index == activePageIndex) ? 'page-link active-link' : 'page-link inactive-link'
                  return <span className={isActive} onClick={(e) => this.handlePageClick(e, index)} key={"link-" + index}>{index}</span>
                })}
              </div>
            </Row>
            <Row>
              <Col md="2">
              <div className="table-header" onClick={ () => this.handleSortForColumn("fileName") }>Filename</div>
              </Col>
              <Col md="1">
                <div className="table-header" onClick={ () => this.handleSortForColumn("endState") }>End state</div>
              </Col>
              <Col md="3">
              <div className="table-header" onClick={ () => this.handleSortForColumn("firstEvent") }>First event</div>
              </Col>
              <Col md="3">
              <div className="table-header" onClick={ () => this.handleSortForColumn("lastEvent") }>Last event</div>
              </Col>
              <Col md="3">
              <div className="table-header" onClick={ (e) => this.handleSortForColumn("duration") }>Duration</div>
              </Col>
            </Row>
          </Container>

          <Container fluid={true}>

            {page.map ( (listItem, index) => {

              const endStateClass = (listItem.endState === 'TIMEOUT' || listItem.endState === 'ERROR' || listItem.endState === 'FAILED') ? 'error' : 'success'
              const isExpanded = (expandedEvents.indexOf(index) > -1)

              return (

                <div className="jobstatus-wrapper" key={"jobstatus-wrapper-" + index}>
                  <Row key={"event-" + index}>
                    <Col md="2"><p><span className="long-text">{listItem.fileName}</span></p></Col>
                    <Col md="1"><p><span className={endStateClass}>{listItem.endState}</span></p></Col>
                    <Col md="3"><p>{listItem.firstEvent}</p></Col>
                    <Col md="3"><p>{listItem.lastEvent}</p></Col>
                    <Col md="2"><p>{listItem.duration}</p></Col>
                    <Col md="1">
                      <div onClick={() => this.handleToggleVisibility(index)}>
                        { !isExpanded ? <FaChevronDown/> : <FaChevronUp/> }
                      </div>
                    </Col>
                  </Row>
                  <Row key={"eventDetails-" + index}>
                    { isExpanded ?
                        <EventExpandableContent key={"statusEventList-" + index} correlationId={listItem.correlationId} events={listItem.events}></EventExpandableContent>
                        : null
                    }
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

  var sortOrder = state.UtilsReducer.eventListSortOrder.sortOrder
  var sortProperty = state.UtilsReducer.eventListSortOrder.property

  if (list && list.length) {
    list.sort( (curr, prev) => {

      if (sortOrder === 0) {
        return (curr[sortProperty] > prev[sortProperty] ? -1 : 1)
      }

      if (sortOrder === 1) {
        return (curr[sortProperty] > prev[sortProperty] ? 1 : -1)
      }

    })

    for (let i = 0, j = list.length; i < j; i+=10) {
      paginationMap.push(list.slice(i,i+10))
    }
  }

  return {
    activePageIndex: state.UtilsReducer.activePageIndex,
    page: paginationMap[state.UtilsReducer.activePageIndex],
    paginationMap: paginationMap,
    expandedEvents: state.UtilsReducer.expandedEvents
  }
}


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails)
