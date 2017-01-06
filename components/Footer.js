import React from 'react'
import { connect } from 'react-redux'
import SupplierActions from '../actions/SuppliersActions'
import cfgreader from '../config/readConfig'
import moment from 'moment'

class Footer extends React.Component {

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
      marginRight: 10,
      marginTop: 10
    }

    if (!graphStatus) {
      return null
    }

    return (
      <div style={statusStyle}>
        <span style={{display: 'block'}}>Graph status: {graphStatus.status}</span>
        <span style={{display: 'block', fontSize: '0.8em'}}>Since {moment(graphStatus.started).format('LLLL')}</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(Footer)
