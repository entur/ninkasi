import React from 'react'
import { connect } from 'react-redux'
import SupplierActions from '../actions/SuppliersActions'
import cfgreader from '../config/readConfig'
import moment from 'moment'

class Header extends React.Component {

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

    const backgroundStyle = {
      backgroundColor: '#2f2f2f',
      width: '100%',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      color: '#fff'
    }

    const textStyle = {
      fontSize: '2.2em',
      fontWeight: 6000,
      padding: 20,
    }

    const statusStyle = {
      marginLeft: 'auto',
      paddingRight: 30,
    }

    return (
      <div style={backgroundStyle}>
        <span style={textStyle}>
            Ninkasi
        </span>
        {this.props.graphStatus
          ?
          <div style={statusStyle}>
            <span style={{display: 'block'}}>Graph status: {this.props.graphStatus.status}</span>
            <span style={{display: 'block', fontSize: '0.8em'}}>Since {moment(this.props.graphStatus.started).format('LLLL')}</span>
          </div>
          : null
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(Header)