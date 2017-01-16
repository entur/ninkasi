import React from 'react'
import { color } from '../components/styles'

class Timeline extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

      const { timetables, validDaysOffset, isLast } = this.props

      let { periods } = timetables[0]

      const timelineStyle = {
        border: '1px solid black',
        borderRadius: 5,
        background: color.timeLineBackground,
        height: '100%',
        width: '90%',
        margin: 'auto',
        display: 'block',
        overflowY: 'auto',
        marginBottom: isLast ? -15 : 'auto',
      }

      const timelineWrapper = {
        width: '101%',
        paddingBottom: isLast ? 0 : 10,
        paddingLeft: 10
      }

      let timeBlock = {
        background: color.timeLineBlockBackground,
        width: '100%',
        height: '100%',
        color: color.font.inverse,
        fontWeight: 500
      }

      let textStyle = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'block',
        margin: 'auto 10px',
        color: color.font.inverse,
        fontSize: '0.7em',
        fontWeight: 500
      }

      let hrStyle = {
        transform: 'rotate(90deg) translateX(-2px)',
        borderTop: '1px dotted',
        borderColor: color.border,
        marginTop: 9,
        width: 15,
        position: 'absolute',
        left: '68.33%'
      }

      return (
        <div style={timelineWrapper}>
          <hr style={hrStyle}/>
          <div style={timelineStyle}>
            {
              periods.map( (period, index) => {
                let periodBlock = {...timeBlock}
                periodBlock.width = (period.timelineEndPosition - period.timelineStartPosition) + '%'
                periodBlock.marginLeft = (period.timelineStartPosition + '%')
                return (
                  <div key={'timetable-period-'+index} style={periodBlock}>
                    <div title={timetables[0].objectId} style={textStyle}>{timetables[0].objectId}</div>
                  </div>)
              })
            }
          </div>
        </div>
      )
  }
}

export default Timeline
