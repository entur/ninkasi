import React from 'react'
import PieCard from '../components/PieCard'
import SuppliersActions from '../actions/SuppliersActions'

class StatisticsDetails extends React.Component {

  componentDidMount() {
    this.props.dispatch(SuppliersActions.getLineStats())
  }

  render() {

    const { suppliers, lineStats } = this.props

    if (!suppliers || lineStats) return null

    const providerPies = suppliers.map( (provider, index) => (
      provider.chouetteInfo.migrateDataToProvider &&
        <PieCard provider={provider} key={'supplier-pie' + index} providerName={provider.name} handleshowAllClick={() => { console.log(123)}} handlePieOnClick={() => { console.log(456)}}/>
    ))

    return (
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
        { providerPies }
      </div>
    )
  }

}

export default StatisticsDetails