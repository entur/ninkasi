/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import SupplierActions from 'actions/SuppliersActions';
import cfgreader from 'config/readConfig';
import moment from 'moment';

const getColorByStatus = status => {
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
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'row',
  margin: '0 20px',
  lineHeight: '24px'
};

const wrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  margin: '0 10px'
};

const statusStyle = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row'
};

const GraphStatusDetails = ({ status, started }) => (
  <div style={statusStyle}>
    {status && started && (
      <>
        <span
          style={{
            fontWeight: 600,
            marginLeft: 5,
            color: getColorByStatus(status)
          }}
        >
          {status}
        </span>
        <span
          title={moment(started).format('DD-MM-YYYY hh:mm:ss')}
          style={{ fontSize: '0.8em', paddingLeft: 5, whiteSpace: 'nowrap' }}
        >
          {moment(started).fromNow()}
        </span>
      </>
    )}
  </div>
);

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

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  startPolling = () => {
    setTimeout(() => {
      this._timer = setInterval(this.poll, 10000);
    }, 1000);
  };

  poll = () => {
    this.props.dispatch(SupplierActions.getGraphStatus());
  };

  render() {
    const { graphStatus, baseGraphStatus } = this.props;

    if (!graphStatus || !baseGraphStatus) {
      return null;
    }

    return (
      <div style={containerStyle}>
        <div style={wrapperStyle}>
          <h4 style={{ fontWeight: 'bold', margin: '0' }}>Graph status</h4>
          <h4 style={{ fontWeight: 'bold', margin: '0' }}>Base graph status</h4>
        </div>
        <div style={wrapperStyle}>
          {graphStatus.otp2 && (
            <GraphStatusDetails
              status={graphStatus.otp2.status}
              started={graphStatus.otp2.started}
            />
          )}
          {baseGraphStatus.otp2 && (
            <GraphStatusDetails
              status={baseGraphStatus.otp2.status}
              started={baseGraphStatus.otp2.started}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  graphStatus: state.SuppliersReducer.graphStatus,
  baseGraphStatus: state.SuppliersReducer.baseGraphStatus
});

export default connect(mapStateToProps)(GraphStatus);
