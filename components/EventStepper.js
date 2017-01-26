import React, { PropTypes } from 'react'
const FaChevronDown = require('react-icons/lib/fa/chevron-down')
const FaChevronUp  = require('react-icons/lib/fa/chevron-up')
import MdError from 'react-icons/lib/md/error'
import MdDone from 'react-icons/lib/md/check-circle'
import MdSchedule from 'react-icons/lib/md/schedule'
import MdBuild from 'react-icons/lib/md/build'
import MdHelpOutLine from 'react-icons/lib/md/help-outline'
import MdHour from 'react-icons/lib/md/hourglass-empty'

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
      "EXPORT" : "Export",
      "IMPORT" : "Import",
      "VALIDATION_LEVEL_1" : "Validation level 1",
      "DATASPACE_TRANSFER" : "Dataspace transfer",
      "VALIDATION_LEVEL_2" : "Validation level 2",
      "FILE_TRANSFER" : "File transfer"
    }
    return groupTextMap[group] || 'Unknown'
  }

  getIconByState(state) {
    switch (state) {
      case "OK": return <MdDone style={{color: 'green', width: 24, height: 22, marginTop: -2}}/>
      case "PENDING": return <MdHour style={{color: 'orange', width: 24, height: 22, marginTop: -2}}/>
      case "STARTED": return <MdBuild style={{color: '#2274b5', width: 24, height: 22, marginTop: -2}}/>
      case "FAILED": return <MdError style={{color: 'red', width: 24, height: 22, marginTop: -2}}/>
      case "DUPLICATE": return <MdError style={{color: 'red', width: 24, height: 22, marginTop: -2}}/>
      case "IGNORED": return <MdSchedule style={{color: 'grey', width: 24, height: 22, marginTop: -2}}/>
    }
    return <MdHelpOutLine style={{color: 'grey', width: 24, height: 22}}/>
  }

  addUnlistedStates(groups) {

    const states = ["FILE_TRANSFER", "IMPORT", "VALIDATION_LEVEL_1", "DATASPACE_TRANSFER", "VALIDATION_LEVEL_2", "EXPORT"]

    let groupsWithUnlisted = Object.assign({}, groups)

    states.forEach( state => {
      if (!groupsWithUnlisted[state]) {
        groupsWithUnlisted[state] = {
          endState: "IGNORED"
        }
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

  render() {

    const stepperstyle = {
      display: "flex",
      flexDirection: "row",
      alignContent : "center",
      alignItems: "center",
      justifyContent : "center",
      marginTop: 10
    }

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
      margin: 8
    }

    const { groups, listItem } = this.props
    const { expanded } = this.state

    const formattedGroups = this.addUnlistedStates(groups)

    const bullets = Object.keys(formattedGroups).map( (group, index) => {

      const isLast = Object.keys(formattedGroups).length == index+1
      let toolTipText = formattedGroups[group].endState

      if (formattedGroups[group].states && formattedGroups[group].states[formattedGroups[group].states.length-1]) {
        toolTipText += ' ' + formattedGroups[group].states[groups[group].states.length-1].date
      }

      return (
          <div style={groupStyle} key={"group-" + group + index}>
            <div title={toolTipText}>{ this.getIconByState((formattedGroups[group].endState))}</div>
            <div style={groupText}> { this.getGroupText(group) }</div>
            {!isLast ? <div style={linkStyle}></div> : null }
          </div>
        )
      }
    )

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
          {bullets}
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
