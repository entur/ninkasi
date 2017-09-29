import React, {Component} from 'react';

class ExportedFilesHeader extends Component {
  render() {

    const style = {
      padding: 2,
      border: '1px solid #eee',
      display: 'flex',
      alignItems: 'center',
      fontWeight: 600,
      background: 'rgb(47, 47, 47)',
      color: '#fff'
    };

    return (
      <div style={style}>
        <div style={{flex: 1.5}}>Referential</div>
        <div style={{flex: 3}}>
          Netex delivered
        </div>
        <div style={{flex: 2}}>
          Netex file size
        </div>
        <div style={{flex: 3}}>
          GTFS delivered
        </div>
        <div style={{flex: 2}}>
          GTFS file size
        </div>
        <div style={{flex: 1}}>
          Difference
        </div>
      </div>
    );
  }
}
export default ExportedFilesHeader;
