import React from 'react'
import PieCard from '../components/PieCard'
import SuppliersActions from '../actions/SuppliersActions'
import LineStatsCard from './LineStatsCard'
import { segmentName, segmentName2Key } from '../util/dataManipulation'

class StatisticsDetails extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedProvider: false
    }
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

  handleClose() {
    this.setState({
      selectedProvider: false
    })
  }


  componentDidMount() {
    this.props.dispatch(SuppliersActions.getLineStats())
  }

  render() {

    const { suppliers, lineStats } = this.props
    const { selectedProvider, selectedSegment, daysValid } = this.state

    const title = segmentName(selectedSegment, daysValid)

    if (selectedProvider) {

      const provider =  suppliers.filter( provider => provider.id == selectedProvider)[0]

      return (
        <LineStatsCard handleClose={this.handleClose.bind(this)} selectedSegment={this.state.selectedSegment} title={`${provider.name} - ${title}`} stats={lineStats[selectedProvider]}/>
      )
    }

    const providerPies = suppliers.map( (provider, index) => (
      provider.chouetteInfo.migrateDataToProvider &&
        <PieCard
          provider={provider}
          key={'supplier-pie' + index}
          providerName={provider.name}
          handleShowAllClick={this.handleShowAll.bind(this)}
          handlePieOnClick={this.handlePieOnClick.bind(this)}
        />
    ))

    return (
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
        { providerPies }
      </div>
    )
  }
}



export default StatisticsDetails