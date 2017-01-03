import React, { Component, PropTypes } from 'react'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'

const EventExpandableContent = (props) => {

    const {events, correlationId} = props

    return  (

        <div className="visible-wrapper">

          <p>Events for {correlationId}</p>
          <Row>
            <Col md="4"><b>Action</b></Col>
            <Col md="4"><b>Date</b></Col>
            <Col md="4"><b>State</b></Col>
          </Row>
          <div className="mui--divider-bottom"></div>

         { (events && events.length) ?

           <div>{events.map( (event, index) => {
             const stateClass = (event.state === 'TIMEOUT' || event.state === 'ERROR' || event.state === 'FAILED') ? 'error' : 'success'
             return (
               <Row key={"action-" + index}>
                 <Col md="4" key={"event-action-" + index}>{event.action}</Col>
                 <Col md="4" key={"event-date-" + index}>{event.date}</Col>
                 <Col md="4" key={"event-state-" + index}><span className={stateClass}>{event.state}</span></Col>
               </Row>
             )
           })}</div> : <div>No events found</div> }

        </div>
    )
}

EventExpandableContent.propTypes = {
  events: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  correlationId: PropTypes.string.isRequired
}

export default EventExpandableContent
