import React, { PropTypes } from 'react'
const FaChevronDown = require('react-icons/lib/fa/chevron-down')
const FaChevronUp  = require('react-icons/lib/fa/chevron-up')

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

  getBulletColor(state) {

    switch (state) {
      case "OK": return "green"
      case "PENDING": return  "orange"
      case "STARTED": return "yellow"
      case "FAILED": return "red"
      case "TERMINATED": return "green"
      case "IGNORED": return "grey"
    }

    return "blue"
  }

  addUnlistedStates(groups) {

    const states = ["FILE_TRANSFER", "IMPORT", "DATASPACE_TRANSFER", "VALIDATION", "EXPORT"]

    const lastState = Object.keys(groups)[Object.keys(groups).length-1]
    const indexOfLastState = states.indexOf(lastState)
    const availableStates = states.splice(indexOfLastState)

    availableStates.forEach( state => {
      if (!groups[state]) {
        groups[state] = {
          endState: "IGNORED"
        }
      }
    })

    return groups
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

    const bulletStyle = {
      height: 20,
      width: 20,
      borderRadius: 100,
      background: 'green',
      border: '1px solid #fff',
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

    const bullets = Object.keys(groups).map( (group, index) => {

      const isLast = Object.keys(formattedGroups).length == index+1
      let toolTipText = groups[group].endState

      if (groups[group].states && groups[group].states[groups[group].states.length-1]) {
        toolTipText += ' ' + groups[group].states[groups[group].states.length-1].date
      }

      return (
          <div style={groupStyle} key={"group-" + group + index}>
            <div title={toolTipText} style={Object.assign({}, bulletStyle, { background: this.getBulletColor(groups[group].endState)})}/>
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
          <div style={{display: 'inline-block'}}>
            <div style={{display: 'flex', flexDirection: 'column', lineHeight: '25px', marginTop: 10, cursor: 'default'}} onClick={event => event.stopPropagation()}>
              <div>Started: {listItem.firstEvent}</div>
              <div>Ended: {listItem.lastEvent}</div>
              <div>Duration: {listItem.duration}</div>
              <div>Correlation Id: <span style={{fontWeight: 600}}>{listItem.correlationId}</span></div>
            </div>
          </div>
          : null
        }
      </div>
    )
  }

}

export default EventStepper
