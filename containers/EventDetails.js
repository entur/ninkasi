import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import Container from 'muicss/lib/react/container'
import EventStepper from '../components/EventStepper'
import SuppliersActions from '../actions/SuppliersActions'
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

  handleRefresh() {
    const { dispatch, activeId } = this.props
    dispatch(SuppliersActions.getProviderStatus(activeId))
  }

  render() {

    const { paginationMap } = this.props
    const { activePageIndex } = this.state
    const page = paginationMap[activePageIndex]

    const refreshButton = (
      <div style={{marginRight: 10, float: 'right', cursor: 'pointer'}}><FaFresh style={{transform: 'scale(1.5)'}} onClick={this.handleRefresh.bind(this)}/></div>
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
          <div>
            <div style={{fontWeight: 600}}>No status</div>
            { refreshButton}
          </div>
        </div>
      )
    }

  }
}

const mapStateToProps = (state, ownProps) => {

  var paginationMap = []
  var list = []

  if (state.SuppliersReducer.statusList) {
    list = state.SuppliersReducer.statusList.slice()
    for (let i = 0, j = list.length; i < j; i+=10) {
      paginationMap.push(list.slice(i,i+10))
    }
  }

  return {
    paginationMap: paginationMap,
    activeId: state.SuppliersReducer.activeId
  }
}


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails)
