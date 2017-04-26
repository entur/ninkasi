import React, { PropTypes } from 'react'
const FaChevronDown = require('react-icons/lib/fa/chevron-down')
const FaChevronUp  = require('react-icons/lib/fa/chevron-up')
import MdError from 'react-icons/lib/md/error'
import MdDone from 'react-icons/lib/md/check-circle'
import MdSchedule from 'react-icons/lib/md/schedule'
import FaCog from 'react-icons/lib/fa/cog'
import MdHelpOutLine from 'react-icons/lib/md/help-outline'
import MdHour from 'react-icons/lib/md/hourglass-empty'
import ControlledChouetteLink from '../components/ControlledChouetteLink'

class EventStepper extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  static propTypes = {
    groups: PropTypes.object.isRequired,
    listItem: PropTypes.object.isRequired
  }

  getGroupText(group) {
    const groupTextMap = {
      "EXPORT" : "GTFS Export",
      "IMPORT" : "Import",
      "VALIDATION_LEVEL_1" : "Validation level 1",
      "DATASPACE_TRANSFER" : "Dataspace transfer",
      "VALIDATION_LEVEL_2" : "Validation level 2",
      "FILE_TRANSFER" : "File transfer",
      "FILE_CLASSIFICATION": "File classification",
      "BUILD_GRAPH": "Build graph",
      "EXPORT_NETEX": "NeTEx Export",
    }
    return groupTextMap[group] || group || 'Unknown'
  }

  getIconByState(state) {
    switch (state) {
      case "OK": return <MdDone style={{color: 'green', width: 24, height: 22, marginTop: -2}}/>
      case "PENDING": return <MdHour style={{color: 'orange', width: 24, height: 22, marginTop: -2}}/>
      case "STARTED": return <FaCog style={{color: '#2274b5', width: 24, height: 22, marginTop: -2}}/>
      case "FAILED": return <MdError style={{color: 'red', width: 24, height: 22, marginTop: -2}}/>
      case "DUPLICATE": return <MdError style={{color: 'red', width: 24, height: 22, marginTop: -2}}/>
      case "IGNORED": return <MdSchedule style={{color: 'black', width: 24, height: 22, marginTop: -2}}/>
    }
    return <MdHelpOutLine style={{color: 'grey', width: 24, height: 22}}/>
  }

  eventStates() {
    return [
      "FILE_TRANSFER",
      "FILE_CLASSIFICATION",
      "IMPORT",
      "VALIDATION_LEVEL_1",
      "DATASPACE_TRANSFER",
      "VALIDATION_LEVEL_2",
      "EXPORT",
      "BUILD_GRAPH",
      "EXPORT_NETEX"
    ]
  }

  addUnlistedStates(groups) {

    const states = this.eventStates()

    let groupsWithUnlisted = Object.assign({}, groups)

    let firstStateFound = false

    states.forEach( state => {
      if (!groupsWithUnlisted[state]) {
        groupsWithUnlisted[state] = {
          endState: "IGNORED",
          missingBeforeStartStart: !firstStateFound
        }
      } else {
        firstStateFound = true
      }
    })

    let finalGroups = {}

    Object.keys(groupsWithUnlisted)
    .sort( (key1, key2) => states.indexOf(key1) - states.indexOf(key2) )
    .forEach( key  => {
      finalGroups[key] = groupsWithUnlisted[key]
    })
    return finalGroups
  }

  handleToggleVisibility (id) {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  combine(formattedGroups, groups, name) {
    const combined = []
    for (let i in groups) {
      const group = groups[i]
      combined[group] = formattedGroups[group]

      if (name !== group) {
        delete formattedGroups[group]
      }
    }
    formattedGroups[name] = combined
  }

  bullet(formattedGroups, groups) {
    const columnStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 45,
    }

    return Object.keys(formattedGroups).map((group, index) => {
        let column;
        let event = formattedGroups[group]
        if (event instanceof Array) {
          column = Object.keys(event).map((key, i) => {
            return this.renderEvent(event[key], event, key, i, false, i)
          })
        } else {
          column = this.renderEvent(event, groups, group, index, index === 0)
        }
        return <div style={columnStyle}>{column}</div>
      }
    )
  }

  renderEvent(event, groups, group, index, isFirst, columnIndex = 0) {
    const groupStyle = {
      display: "flex",
      flexDirection: "row",
    }

    const groupText = {
      fontSize: '0.9em',
      marginLeft: 5
    }

    const linkStyle = {
      display: "block",
      borderColor: "rgb(189, 189, 189)",
      marginLeft: -6,
      borderTopStyle: "solid",
      borderTopWidth: 1,
      width: 30,
      margin: 8,
      transform: columnIndex > 0 && 'translateY(-0.5em) rotate(25deg) ',
    }

    let toolTipText = event.endState

    if (event.states && event.states[event.states.length - 1]) {
      toolTipText += ' ' + event.states[groups[group].states.length - 1].date
    }

    return (
      <div style={groupStyle} key={"group-" + group + index}>
        { !isFirst && <div style={linkStyle}/> }
        <div title={toolTipText} style={{opacity: event.missingBeforeStartStart ? 0.2 : 1}}>
          { this.getIconByState((event.endState)) }
        </div>
        <div style={{...groupText, opacity: event.missingBeforeStartStart ? 0.2 : 1}}>
          <ControlledChouetteLink events={event}> { this.getGroupText(group) } </ControlledChouetteLink>
        </div>
      </div>
    )
  }

  render() {

    const stepperstyle = {
      display: "flex",
      flexDirection: "row",
      alignContent : "center",
      alignItems: "center",
      justifyContent : "center",
      marginTop: 10
    }

    const { groups, listItem } = this.props
    const { expanded } = this.state

    const formattedGroups = this.addUnlistedStates(groups)
    this.combine(formattedGroups, ['EXPORT', 'EXPORT_NETEX'], 'EXPORT')
    const bullets = this.bullet(formattedGroups, groups)

    // action, id, referential, children

    return (
      <div key={"event" + listItem.chouetteJobId} style={{marginLeft: 20, cursor: 'pointer'}} onClick={() => this.handleToggleVisibility()}>
        <div style={{display: 'flex', marginLeft: -20}}>
          <div title={"Duration: " + listItem.duration} style={{fontSize: '0.9em', fontWeight: 600, color: '#e59400', marginTop: -8, marginRight: 20}}>{listItem.started}</div>
          { listItem.provider && listItem.provider.name ?
            <div style={{fontSize: '0.8em', fontWeight: 600, flex: 1}}>{listItem.provider.name}</div>
            : null
          }
          <div style={{fontSize: '0.9em', fontWeight: 600, flex: 2}}>{listItem.fileName}</div>
        </div>
        <div style={stepperstyle}>
          { bullets }
          <div style={{marginLeft: 'auto', marginRight: 20, marginTop: -50}} onClick={() => this.handleToggleVisibility()}>
            { !expanded ? <FaChevronDown/> : <FaChevronUp/> }
          </div>
        </div>
        { expanded
          ?
            <div style={{display: 'flex', padding: 8, flexDirection: 'column', lineHeight: '25px', marginTop: 10, cursor: 'default', border: '1px solid #9E9E9E'}} onClick={event => event.stopPropagation()}>
              <div>Started: {listItem.firstEvent}</div>
              <div>Ended: {listItem.lastEvent}</div>
              <div>Duration: {listItem.duration}</div>
              <div>Correlation Id: <span style={{fontWeight: 600}}>{listItem.correlationId}</span></div>
            </div>
          : null
        }
      </div>
    )
  }

}

export default EventStepper
