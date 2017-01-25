import React, { PropTypes } from 'react'
import { Card, CardText } from 'material-ui/Card'
import { List, ListItem } from 'material-ui/List'
import Timeline from '../components/Timeline'
import HeaderTimeline from '../components/HeaderTimeline'
import { color } from '../components/styles'
import { filterLines} from '../util/dataManipulation'
import IconButton from 'material-ui/IconButton'
import CloseButton from 'material-ui/svg-icons/navigation/close';

class StatusCard extends React.Component {

  static propTypes = {
    selectedSegment: PropTypes.string.isRequired,
    stats: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    handleClose: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      sorting: 0
    }
  }

  changeSorting() {
    let states = 5
    let sort = (this.state.sorting + 1) % states
    this.setState({
      ...this.state,
      sorting: sort
    })
  }

  sortMethod( index = 0, ascending = true) {
    return function (a, b) {
      if (a[index] === b[index]) {
        return 0
      } else if (a[index] <  b[index]) {
        return (ascending) ? -1 : 1
      } else {
        return (ascending) ? 1 : -1
      }
    }
  }

  sortLines(stats, selectedSegment, daysValid) {
    let order = filterLines(stats, selectedSegment, daysValid)

    switch (this.state.sorting) {
      default:
        return order
      case 1:
        return order.sort()
      case 2:
        return order.sort().reverse()
      case 3:
        let daysAsc = stats.daysValid.sort( this.sortMethod('days', true) )
        return daysAsc.filter( (line) => order.indexOf(line.lineNumber) > 0).map((line) => line.lineNumber)
      case 4:
        let daysDesc = stats.daysValid.sort( this.sortMethod('days', false) )
        return daysDesc.filter( (line) => order.indexOf(line.lineNumber) > 0 ).map( (line) => line.lineNumber)
    }
  }

  sortIcon() {
    let def = <svg  xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 24"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/></svg>
    let down = <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 24"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/></svg>
    let up = <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
    let az = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18"><text x="12" y="12" textAnchor="middle">AZ</text></svg>
    let za = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18"><text x="12" y="12" textAnchor="middle">ZA</text></svg>
    switch (this.state.sorting) {
      default:
      case 0:
        return def
      case 1:
        return <div>{az}{down}</div>
      case 2:
        return <div>{za}{up}</div>
      case 3:
        return down
      case 4:
        return up
    }
  }

  handleToggleListItem(index) {
    let ref = this.refs['listItem'+index]
    ref.setState({
      ...ref.state,
      open: !ref.state.open
    })
  }

  render() {

    const { stats, title } = this.props

    if (!stats) return <div>Loading ...</div>

    let validDateMiddleStyle = {
      fontWeight: 600,
      marginLeft: ((100-17) - stats.validDaysOffset) + '%',
      display: 'inline-block'
    }

    let validDateStartStyle = {
      fontWeight: 600,
      display: 'inline-block',
      marginLeft: '3%',
      float: 'left'
    }

    let validDateEndStyle = {
      fontWeight: 600,
      display: 'inline-block',
      float: 'right',
      marginRight: '3%'
    }

    let sortIconStyle = {
      display: 'inline-block',
      float: 'left',
      cursor: 'pointer',
    }

    const { selectedSegment } = this.props
    const order = this.sortLines(stats, selectedSegment, stats.daysValid)

    return (
        <Card expanded={true} style={{flex: 4}}>
          <CardText
            style={{padding: '0vh 0'}}
          >
            <div style={{overflow: 'auto'}}>
                <Card>
                  <CardText style={{minHeight: 700}}>
                    <div style={{textTransform: 'uppercase', fontWeight: 600, marginLeft: 10, fontSize: '1.4em', display: 'block', paddingTop: 10, paddingBottom: 10}}>
                      { title }
                      { this.props.hideClose ? null : <IconButton style={{float: 'right'}} onClick={() => this.props.handleClose()} touch={true}><CloseButton/></IconButton> }
                    </div>
                    <div style={{display: 'block', marginTop: 10, marginBottom: 10, marginLeft: 4, padding: 2, background: color.tableHeader, opacity: '0.8', borderRadius: 7}}>
                      <div style={sortIconStyle} onClick={this.changeSorting.bind(this)} title="Sorter linjer">{this.sortIcon()}</div>
                      <div style={validDateStartStyle}>{stats.startDate}</div>
                      <div style={validDateMiddleStyle}>{stats.validFromDate} (120 days)</div>
                      <div style={validDateEndStyle}>{stats.endDate}</div>
                    </div>
                    <div
                      style={{maxHeight: 800, minHeight: 800, overflowY: 'scroll', overflowX: 'hidden', margin: 'auto', width: '100%'}}
                    >
                      <List
                        style={{width: '100%', boxShadow: 'none'}}
                      >
                        { order.map( (line, index) => (
                          <ListItem
                            key={'line'+index}
                            disabled
                            ref={'listItem'+index}
                            style={{padding: 0, marginLeft: 0, marginRight: 0, marginTop: 0, lineHeight: 0}}
                            children={
                              <div
                                key={'ht-wrapper'+index}
                                onClick={() => { this.handleToggleListItem(index) }}
                              >
                                <HeaderTimeline line={line}
                                  hoverText={stats.linesMap[line].lineNames.join(', ')}
                                  index={index} key={'HeaderTimeline'+index}
                                  validDaysOffset={stats.validDaysOffset}
                                  validFromDate={stats.validFromDate}
                                  effectivePeriods={stats.linesMap[line].effectivePeriods}
                                />
                              </div>
                            }
                            nestedItems={
                              [
                                <ListItem disabled key={'line-n'+index}
                                  style={{padding: 0, marginLeft: 0}}
                                  children={
                                    stats.linesMap[line].lines.map( (l,i) => (
                                      <Timeline
                                        key={'timelineItem'+index+'-'+i}
                                        timetables={l.timetables}
                                        isLast={i === stats.linesMap[line].lines.length-1}
                                        validDaysOffset={stats.validDaysOffset}
                                        index={i}
                                      />
                                    ))
                                  } />
                              ]
                            }
                          >
                          </ListItem>
                        ))}
                      </List>
                    </div>
                  </CardText>
                </Card>
            </div>
          </CardText>
        </Card>
    )
  }
}

export default StatusCard
