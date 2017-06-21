import React from 'react'
import { connect } from 'react-redux'
import SupplierActions from '../actions/SuppliersActions'
import cfgreader from '../config/readConfig'
import moment from 'moment'

class GraphStatus extends React.Component {

  componentDidMount() {
    cfgreader.readConfig( (function(config) {
      window.config = config
      this.props.dispatch(SupplierActions.getGraphStatus())
      this.startPolling()
    }).bind(this))
  }

  startPolling = () => {
    setTimeout(() => {
      setInterval(this.poll, 10000)
    }, 1000)
  }

  poll = () => {
    this.props.dispatch(SupplierActions.getGraphStatus())
  }

  getColorByStatus(status) {
    switch (status) {
      case 'STARTED': return '#08920e'
      case 'OK': return '#08920e'
      case 'FAILED': return '#990000'
      default: return 'grey'
    }
  }

  render() {

    const { graphStatus } = this.props

    const statusStyle = {
      float: 'right',
      marginRight: 15,
      marginTop: 20
    }

    if (!graphStatus) {
      return null
    }

    const { status } = graphStatus

    return (
      <div style={statusStyle}>
        <span style={{display: 'block'}}>Graph status: <span style={{fontWeight: 600, color: this.getColorByStatus(status) }}>{status}</span></span>
        <span style={{display: 'block', fontSize: '0.8em'}}>{moment(graphStatus.started).fromNow()}</span>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    graphStatus: state.SuppliersReducer.graphStatus
  }
}


export default connect(mapStateToProps)(GraphStatus)
