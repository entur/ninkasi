import React, { PropTypes } from 'react'
import { color } from 'bogu/styles'

class HeaderTimeline extends React.Component {

  static propTypes = {
    hoverText: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    validDaysOffset: PropTypes.number.isRequired,
    validFromDate: PropTypes.string.isRequired,
    effectivePeriods: PropTypes.array.isRequired,
  }

  render() {

      const timelineStyle = {
        border: '1px solid black',
        borderRadius: 5,
        background: color.timeLineFail,
        height: 18,
        fontSize: '0%',
        flexGrow: 1,
        maxWidth: '90%',
        marginTop: 15,
        marginLeft: 20,
        marginRight: 20
      }

      let timelineWrapper = {
        width: '100%',
        marginBottom: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }

      let timeBlock = {
        background: color.timeLineSuccess,
        height: 'auto',
        cursor: 'pointer',
        fontWeight: 500,
        fontSize: '0.8rem',
        textAlign: 'center',
        display: 'inline-block',
        borderRight: '1px solid black',
      }

      const textSpanStyle = {
        color: color.font.inverse,
        height: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }

      const { effectivePeriods, validDaysOffset } = this.props

      let hrStyle = {
        transform: 'rotate(90deg) translateX(-2px)',
        borderTop: '1px dotted',
        borderColor: color.border,
        marginTop: 9,
        width: 15,
        position: 'absolute',
        left: '68.33%'
      }

      let hoverText = effectivePeriods.length ?  this.props.hoverText : 'Ugyldig linje. Mangler data'

      return (
        <div style={timelineWrapper}>
           <div
             title={hoverText}
             style={{cursor: 'pointer', fontSize: '1vw', minWidth: 40, marginLeft: -20, marginTop: 10, color: effectivePeriods.length ? color.effective : color.fail}}
            >
            {this.props.line}
          </div>
            <div style={timelineStyle}>
              <div style={hrStyle} id={"timeline-hr" + this.props.index}>!</div>
              <div key={'timeline-header-wrapper'+ this.props.index}>
                { effectivePeriods.map( (effectivePeriod, index) => {

                let periodBlock = {...timeBlock}
                periodBlock.width = (effectivePeriod.timelineEndPosition - effectivePeriod.timelineStartPosition) + '%'

                if (index == 0) {
                  periodBlock.marginLeft = (effectivePeriod.timelineStartPosition + '%')
                } else {
                  periodBlock.marginLeft = (effectivePeriod.timelineStartPosition - effectivePeriods[index-1].timelineEndPosition) + '%'
                }

                let itemText = effectivePeriod.to

                if (effectivePeriod.timelineStartPosition > 0 && effectivePeriod.from.localeCompare(effectivePeriod.to) !== 0) {
                  itemText = effectivePeriod.from + ' - ' + effectivePeriod.to
                }

                return (
                    <div
                      key={'timeline-header-block'+index}
                      style={periodBlock}>
                      <div style={textSpanStyle}>
                          <div className="period-block" style={{color: color.font.inverse, fontSize: '1.6em'}}>
                            <div title={itemText}>{itemText}</div>
                          </div>
                      </div>
                    </div>
                )
              })
              }
            </div>
          </div>
      </div>
      )
  }
}


 export default HeaderTimeline
