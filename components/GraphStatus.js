import React from 'react'
import { connect } from 'react-redux'
import SupplierActions from '../actions/SuppliersActions'
import cfgreader from '../config/readConfig'
import moment from 'moment'

class GraphStatus extends React.Component {

  componentWillMount() {
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
        <span style={{display: 'block'}}>Graph status: <span style={{fontWeight: 600, color: status === 'IDLE' ? '#ff9800' : '#08920e' }}>{status}</span></span>
        <span style={{display: 'block', fontSize: '0.8em'}}>{moment(graphStatus.started).fromNow()}</span>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    graphStatus: state.MardukReducer.graphStatus
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphStatus)
