import React, { PropTypes } from 'react'
import { Pie as PieChart } from 'react-chartjs'
import { color } from '../components/styles'
import { connect } from 'react-redux'
import Loader from 'halogen/DotLoader'

class PieCard extends React.Component {

  static propTypes = {
    handlePieOnClick: PropTypes.func.isRequired,
    handleshowAllClick: PropTypes.func.isRequired,
    provider: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.segmentMap = {
      'Gyldige' : 'valid',
      'Snart ugyldige' : 'soonInvalid',
      'Ugyldige' : 'invalid',
      'valid' : 'Gyldige',
      'soonInvalid' : 'Snart ugyldige',
      'invalid' : 'Ugyldige',
      'all' : 'Alle linjer',
      'Alle linjer' : 'all'
    }
  }

  render() {

    const showAllStyle = {
      color: 'rgb(17, 105, 167)',
      fontWeight: 600,
      textDecoration: 'underline',
      cursor: 'pointer',
      marginTop: 10,
      textAlign: 'center'
    }

    let pieOptions = {
      animation: false,
      showTooltips: true,
      responsive: true,
      tooltipTemplate: "<%= label %> - <%= value %>"
    }

    const { stats, provider } = this.props

    if (!stats) return (
      <div style={{width: 200, height: 300, display: 'flex', alignItems: 'center',  margin: 50}}>
        <Loader color={color.font.info1} size="23px"/>
      </div>
    )

    const valid = stats.valid.lineNumbers.length
    const invalid = stats.invalid.lineNumbers.length
    const soonInvalid = stats.soonInvalid.lineNumbers.length

    const isInvalid = !valid && !invalid && !soonInvalid

    const pieData = [
      {
        value: valid,
        highlight: color.valid,
        color: color.font.valid,
        label: this.segmentMap['valid'],
      },
      {
        value: soonInvalid,
        color: color.font.expiring,
        highlight: color.expiring,
        label: this.segmentMap['soonInvalid'],
      },
      {
        value: invalid,
        color: color.font.invalid,
        highlight: color.invalid,
        label: this.segmentMap['invalid'],
      }
    ]

    return (
      <div style={{width: 200, height: 300, display: 'flex', flexDirection: 'column', margin: 50}}>
        <div>
          <div style={{fontWeight: 600, textAlign: 'center', marginBottom: 5}}>{provider.name}</div>
          { isInvalid
            ? <div style={{color: 'red', fontWeight: 600, textAlign: 'center'}}>No valid lines</div>
            :  <PieChart style={{marginTop: 0}} ref="chart" onClick={(e) => { this.props.handlePieOnClick(e, this.refs.chart.getChart()) } } data={pieData} width="100" height="100"  options={pieOptions}/>
          }
          { isInvalid
            ? null
            : <div onClick={() => this.props.handleshowAllClick()} style={showAllStyle}>Vis alle</div>
          }
        </div>
      </div>
    )

  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    stats: Object.keys(state.SuppliersReducer.lineStats).length ? state.SuppliersReducer.lineStats[ownProps.provider.id] : null
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps())(PieCard)


