import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import EventStepper from '../components/EventStepper'
const FaFresh = require('react-icons/lib/fa/refresh')

class EventDetails extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activePageIndex: 0
    }
  }

  componentWillMount(){
    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this))
  }

  handlePageClick (e, pageIndex) {
    e.preventDefault()
    this.setState({
      activePageIndex: pageIndex
    })
  }

  render() {

    const { paginationMap, handleRefresh } = this.props
    const { activePageIndex } = this.state
    const page = paginationMap[activePageIndex]

    const refreshButton = (
      <div style={{marginRight: 10, float: 'right', cursor: 'pointer'}}><FaFresh style={{transform: 'scale(1.5)'}} onClick={handleRefresh}/></div>
    )

    if (page && page.length && paginationMap) {

      return (

        <div>
          { refreshButton}
          <div className="page-link-parent">
            <span className="ml-17">Pages: </span>
            {paginationMap.map ( (page, index) => {
              const isActive = (index == activePageIndex) ? 'page-link active-link' : 'page-link inactive-link'
              return <span className={isActive} onClick={(e) => this.handlePageClick(e, index)} key={"link-" + index}>{index+1}</span>
            })}
          </div>
          <div>

            { page.map ( (listItem, index) => {

              let eventGroup = {}

              listItem.events.forEach( event => {

                if (!eventGroup[event.action]) {
                  eventGroup[event.action] = {}
                  eventGroup[event.action].states = []
                }
                eventGroup[event.action].states.push(event)
                eventGroup[event.action].endState = event.state
              })

              return (

                <div className="jobstatus-wrapper" key={"jobstatus-wrapper-" + listItem.chouetteJobId + '-' + index}>
                  <EventStepper key={"event-group-" + listItem.chouetteJobId + '-' + index} groups={eventGroup} listItem={listItem}/>
                </div>
              )
            }) }
          </div>
        </div>
      )

    } else {
      return (
        <div className="jobstatus-wrapper">
          <div style={{fontWeight: 600}}>No status { refreshButton }</div>
        </div>
      )
    }

  }
}


export default EventDetails
