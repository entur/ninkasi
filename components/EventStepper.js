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
      "VALIDATION" : "Validation",
      "IMPORT" : "Import",
      "DATASPACE_TRANSFER" : "Dataspace transfer",
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

    const states = ["FILE_TRANSFER", "IMPORT", "VALIDATION", "DATASPACE_TRANSFER", "EXPORT"]

    states.forEach( state => {
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

    const endStateClass = (listItem.endState === 'TIMEOUT' || listItem.endState === 'ERROR' || listItem.endState === 'FAILED') ? 'error' : 'success'


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
        <div style={{fontSize: '0.9em', fontWeight: 600}}>{listItem.fileName}</div>
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
              <div>End state: <span className={endStateClass}>{listItem.endState}</span></div>
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
