import React, { Component } from 'react';
import moment from 'moment';
import { getSizeFromBytes } from '../utils/';
import StatusLabel from './StatusLabel';
import MdFileDownload from 'material-ui/svg-icons/file/file-download';

class ExportedFilesRow extends Component {
  diffMoreThan24Hours(date) {
    const now = Date.now();
    const diff = moment.duration(moment(date).diff(moment(now)));
    if (diff && diff._data) {
      const { years, months, days } = diff._data;
      if (Math.abs(years) > 0 || Math.abs(months) > 0 || Math.abs(days) > 1) {
        return true;
      }
    }
    return false;
  }

  getStatusLabel(netexDate, gtfsDate, index) {
    const errorBackground = 'rgba(255, 0, 0, 0.2)';
    const warningBackground = 'hsla(39, 100%, 50%, 0.21)';

    if (!netexDate || !gtfsDate) {
      return {
        label: <StatusLabel type="error" label="Netex or gtfs missing" />,
        background: errorBackground
      };
    }

    const diff = netexDate && gtfsDate
      ? moment.duration(moment(netexDate).diff(moment(gtfsDate)))
      : null;

    if (diff && diff._data) {
      const { years, months, days } = diff._data;
      if (Math.abs(years) > 0 || Math.abs(months) > 0 || Math.abs(days) > 1) {
        return {
          label: (
            <StatusLabel
              type="warning"
              label="Great delivery date difference"
            />
          ),
          background: warningBackground
        };
      }
    }

    const netextMoreThan24h = this.diffMoreThan24Hours(netexDate);
    const gtfsMoreThan24h = this.diffMoreThan24Hours(gtfsDate);

    let label = null;

    if (netextMoreThan24h && gtfsMoreThan24h) {
      label = 'Netex and GTFS older than 24h';
    } else if (netextMoreThan24h && !gtfsMoreThan24h) {
      label = 'Netex older than 24h';
    } else if (!netextMoreThan24h && gtfsMoreThan24h) {
      label = 'GTFS older than 24h';
    }

    if (label) {
      return {
        label: <StatusLabel type="error" label={label} />,
        background: errorBackground
      };
    }

    return {
      label: <StatusLabel type="success" label={'OK'} />,
      background: index % 2 ? '#fff' : 'rgba(238, 238, 238, 0.36)'
    };
  }

  render() {
    const { data, index, referential, providerName } = this.props;

    const { NETEX, GTFS } = data;

    const netexDate = Array.isArray(NETEX) && NETEX[0] && NETEX[0].updated
      ? NETEX[0].updated
      : null;

    const netexFileSize = Array.isArray(NETEX) && NETEX[0] && NETEX[0].fileSize
      ? NETEX[0].fileSize
      : null;

    const gtfsFileSize = Array.isArray(GTFS) && GTFS[0] && GTFS[0].fileSize
      ? GTFS[0].fileSize
      : null;

    const gtfsDate = Array.isArray(GTFS) && GTFS[0] && GTFS[0].updated
      ? GTFS[0].updated
      : null;

    const gtfsUrl = Array.isArray(GTFS) && GTFS[0] && GTFS[0].url
      ? GTFS[0].url
      : null;

    const netexUrl = Array.isArray(NETEX) && NETEX[0] && NETEX[0].url
      ? NETEX[0].url
      : null;

    const diff = netexDate && gtfsDate
      ? moment.duration(moment(netexDate).diff(moment(gtfsDate)))
      : null;

    const diffHumanized = diff ? diff.humanize() : null;

    const { background, label } = this.getStatusLabel(
      netexDate,
      gtfsDate,
      index
    );

    const style = {
      padding: 2,
      border: '1px solid #eee',
      display: 'flex',
      alignItems: 'center',
      background
    };

    const missingStyle = {
      fontStyle: 'italic',
    };

    return (
      <div style={style}>
        <div style={{ flex: 2.5 }}>{providerName}</div>
        <div style={{ flex: 1 }}>{data.referential || referential}</div>
        <div
          style={{
            flex: 3,
            fontStyle: !netexDate ? missingStyle.fontStyle : 'initial',
          }}
        >
          {netexDate ? moment(netexDate).format('LLLL') : 'NO DELIVERY'}
        </div>
        <div style={{ flex: 1 }}>
          {netexFileSize &&
            <a
              style={{ display: 'flex', alignItems: 'center' }}
              href={netexUrl}
              download={true}
            >
              <MdFileDownload color={'#2196F3'} />
              <span style={{ marginLeft: 2 }}>{`[${getSizeFromBytes(
                netexFileSize
              )}]`}</span>
            </a>}
        </div>
        <div
          style={{
            flex: 3,
            fontStyle: !gtfsDate ? missingStyle.fontStyle : 'initial',
          }}
        >
          {gtfsDate ? moment(gtfsDate).format('LLLL') : 'NO DELIVERY'}
        </div>
        <div style={{ flex: 1 }}>
          {gtfsFileSize &&
            <a
              style={{ display: 'flex', alignItems: 'center' }}
              href={gtfsUrl}
              download={true}
            >
              <MdFileDownload color={'#2196F3'} />
              <span style={{ marginLeft: 2 }}>{`[${getSizeFromBytes(
                gtfsFileSize
              )}]`}</span>
            </a>}
        </div>
        <div style={{ flex: 1 }}>
          {diffHumanized}
        </div>
        <div style={{ flex: 4 }}>
          {label}
        </div>
      </div>
    );
  }
}

export default ExportedFilesRow;
