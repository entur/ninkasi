import React, { PropTypes } from 'react'
import PieCard from '../components/PieCard'
import SuppliersActions from '../actions/SuppliersActions'
import LineStatsCard from './LineStatsCard'
import { segmentName, segmentName2Key } from '../util/dataManipulation'
import { connect } from 'react-redux'

class StatisticsForProvider extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedSegment: 'all',
      daysValid: 180
    }
  }


  static propTypes = {
    provider: PropTypes.object.isRequired,
  }

  handlePieOnClick(e, chart, provider) {

    if (chart.getSegmentsAtEvent(e)[0]) {

      let clickedSegmentLabel = chart.getSegmentsAtEvent(e)[0].label
      let clickedSegmentValue = chart.getSegmentsAtEvent(e)[0].value

      let selected = segmentName2Key(clickedSegmentLabel)

      this.setState({
        selectedSegment: selected.segment,
        daysValid: selected.daysValid,
        segmentValue: clickedSegmentValue,
        selectedProvider: provider
      })
    }
  }

  handleShowAll(value, provider) {
    this.setState({
      selectedSegment: 'all',
      daysValid: 180,
      segmentValue: value,
      selectedProvider: provider
    })
  }

  componentDidMount() {
    this.props.dispatch(SuppliersActions.getLineStatsForProvider(this.props.provider.id))
  }

  render() {

    const { lineStats, provider } = this.props
    const { selectedSegment, daysValid } = this.state

    const title = segmentName(selectedSegment, daysValid)

    return (
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
        <LineStatsCard daysValid={daysValid} selectedSegment={selectedSegment} title={`${provider.name} - ${title}`} stats={lineStats}/>
        <PieCard
          provider={provider}
          key={'supplier-pie'}
          handleShowAllClick={this.handleShowAll.bind(this)}
          handlePieOnClick={this.handlePieOnClick.bind(this)}
          stats={lineStats}
          hideHeader
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    lineStats: state.SuppliersReducer.lineStats[ownProps.provider.id]
  }
}


export default connect(mapStateToProps)(StatisticsForProvider)