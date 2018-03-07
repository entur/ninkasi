import React, { Component } from 'react';
import moment from 'moment';
import { getSizeFromBytes } from '../utils/';
import StatusLabel from './StatusLabel';
import MdFileDownload from 'material-ui/svg-icons/file/file-download';
import { ExportStatus } from '../actions/formatUtils';

class ExportedFilesRow extends Component {


  getStatusLabel(rowStatus, index) {
    const backgrounds = {
      [ExportStatus.ERROR]: 'rgba(255, 0, 0, 0.2)',
      [ExportStatus.WARNING]: 'hsla(39, 100%, 50%, 0.21)',
      [ExportStatus.OK]: index % 2 ? '#fff' : 'rgba(238, 238, 238, 0.36)'
    };

    if (!rowStatus) return {
      background: backgrounds[ExportStatus.OK],
      label: null
    };

    const { status, message } = rowStatus;

    return {
      label: <StatusLabel type={status} label={message} />,
      background: backgrounds[status]
    };
  }

  render() {
    const { data, index, referential, providerName } = this.props;

    const {
      netexDate,
      gtfsDate,
      netexFileSize,
      netexUrl,
      gtfsUrl,
      diffHumanized,
      gtfsFileSize,
      status
    } = data;


    const { background, label } = this.getStatusLabel(
      status,
      index
    );

    const norwayDisplayName = "Norway";
    const isAggregatedSet = (referential === norwayDisplayName);
    
    const style = {
      padding: 2,
      border: '1px solid #eee',
      display: 'flex',
      alignItems: 'center',
      background
    };

    const missingStyle = {
      fontStyle: 'italic'
    };

    return (
      <div style={style}>
        <div style={{ flex: 2.5 }}>{isAggregatedSet ? norwayDisplayName : providerName}</div>
        <div style={{ flex: 1 }}>{data.referential || referential}</div>
        <div
          style={{
            flex: 3,
            fontStyle: !netexDate ? missingStyle.fontStyle : 'initial'
          }}
        >
          {netexDate ? moment(netexDate).format('LLLL') : 'NO EXPORT'}
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
            fontStyle: !gtfsDate ? missingStyle.fontStyle : 'initial'
          }}
        >
          {gtfsDate ? moment(gtfsDate).format('LLLL') : 'NO EXPORT'}
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
