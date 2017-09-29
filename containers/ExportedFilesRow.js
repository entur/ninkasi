import React, {Component} from 'react';
import moment from 'moment';
import { getSizeFromBytes } from '../utils/'

class ExportedFilesRow extends Component {
  render() {

    const { data, providerId } = this.props;
    const style = {
      padding: 2,
      border: '1px solid #eee',
      display: 'flex',
      alignItems: 'center',
    };

    const { NETEX, GTFS } = data;
    const netexDate = Array.isArray(NETEX) && NETEX[0] && NETEX[0].updated
      ? NETEX[0].updated
      : null;

    const netexFileSize = Array.isArray(NETEX) && NETEX[0] && NETEX[0].updated
      ? NETEX[0].fileSize
      : null;

    const gtfsFileSize = Array.isArray(GTFS) && GTFS[0] && GTFS[0].updated
      ? GTFS[0].fileSize
      : null;

    const gtfsDate = Array.isArray(GTFS) && GTFS[0] && GTFS[0].updated
      ? GTFS[0].updated
      : null;

    const diff = netexDate && gtfsDate
      ? moment.duration(moment(netexDate).diff(moment(gtfsDate))).humanize()
      : null;

    return (
      <div style={style}>
        <div style={{flex: 1.5}}>{data.referential}</div>
        <div style={{flex: 3}}>
          {netexDate && moment(netexDate).format('DD-MM-YYYY HH:mm:ss')}
        </div>
        <div style={{flex: 2}}>
          {netexFileSize && getSizeFromBytes(netexFileSize)}
        </div>
        <div style={{flex: 3}}>
          {gtfsDate && moment(gtfsDate).format('DD-MM-YYYY HH:mm:ss')}
        </div>
        <div style={{flex: 2}}>
          {gtfsFileSize && getSizeFromBytes(gtfsFileSize)}
        </div>
        <div style={{flex: 1}}>
          {diff}
        </div>
      </div>
    );
  }
}


export default ExportedFilesRow;
