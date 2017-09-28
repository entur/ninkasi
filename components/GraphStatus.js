import React from 'react';
import { connect } from 'react-redux';
import SupplierActions from '../actions/SuppliersActions';
import cfgreader from '../config/readConfig';
import moment from 'moment';

class GraphStatus extends React.Component {
  componentDidMount() {
    cfgreader.readConfig(
      function(config) {
        window.config = config;
        this.props.dispatch(SupplierActions.getGraphStatus());
        this.startPolling();
      }.bind(this)
    );
  }

  startPolling = () => {
    setTimeout(() => {
      setInterval(this.poll, 10000);
    }, 1000);
  };

  poll = () => {
    this.props.dispatch(SupplierActions.getGraphStatus());
  };

  getColorByStatus(status) {
    switch (status) {
      case 'STARTED':
        return '#08920e';
      case 'OK':
        return '#08920e';
      case 'FAILED':
        return '#990000';
      default:
        return 'grey';
    }
  }

  render() {
    const { graphStatus } = this.props;

    const statusStyle = {
      marginRight: 10,
      marginTop: 10,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column'
    };

    if (!graphStatus) {
      return null;
    }

    const { status } = graphStatus;

    return (
      <div style={statusStyle}>
        <span>
          Graph status:
          <span
            style={{ fontWeight: 600, marginLeft: 5, color: this.getColorByStatus(status)}}>
            {status}
          </span>
        </span>
        <span style={{fontSize: '0.8em'}}>
          {moment(graphStatus.started).fromNow()}
        </span>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  graphStatus: state.SuppliersReducer.graphStatus
});

export default connect(mapStateToProps)(GraphStatus);
