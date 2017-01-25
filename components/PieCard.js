import React, { PropTypes } from 'react'
import { Pie as PieChart } from 'react-chartjs'
import { color } from '../components/styles'
import Loader from 'halogen/DotLoader'
import { segmentName, segmentColor } from '../util/dataManipulation'

class PieCard extends React.Component {

  static propTypes = {
    handlePieOnClick: PropTypes.func.isRequired,
    handleshowAllClick: PropTypes.func,
    provider: PropTypes.object.isRequired
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
    const expiring = stats.validity.filter( lines => lines.numDaysAtLeastValid > 0 && lines.numDaysAtLeastValid < 120).reverse()

    const pieData = [
      {
        value: valid,
        highlight: color.valid,
        color: color.highlight.valid,
        label: segmentName('valid'),
      },
      {
        value: soonInvalid,
        color: color.soonInvalid,
        highlight: color.highlight.soonInvalid,
        label: segmentName('soonInvalid'),
      }
    ]

    for (let i in expiring) {
      let category = expiring[i]
      let numDays = category.numDaysAtLeastValid
      let length = category.lineNumbers.length

      pieData.push({
          value: length,
          color: segmentColor(numDays),
          highlight: segmentColor(numDays, 20),
          label: segmentName('dynamic', numDays),
        }
      )
    }
    pieData.push({
      value: invalid,
      color: color.invalid,
      highlight: color.highlight.invalid,
      label: segmentName('invalid'),
    })

    let pieDataIsNotEmpty = false

    pieData.forEach( data => {
      if (data.value) pieDataIsNotEmpty = true
    })

    if (!pieDataIsNotEmpty) return null

    return (
      <div style={{width: 200, height: 300, display: 'flex', flexDirection: 'column', margin: 50}}>
        <div>
          { this.props.hideHeader ? null : <div style={{fontWeight: 600, textAlign: 'center', marginBottom: 5, textOverflow: 'ellipses', whiteSpace: 'nowrap'}}>{provider.name}</div> }
            <PieChart style={{marginTop: 0}} ref="chart" onClick={(e) => { this.props.handlePieOnClick(e, this.refs.chart.getChart(), provider.id)} } data={pieData} width="100" height="100"  options={pieOptions}/>
          <div onClick={() => this.props.handleShowAllClick(120, provider.id)} style={showAllStyle}>Show all</div>
        </div>
      </div>
    )
  }
}
export default PieCard


