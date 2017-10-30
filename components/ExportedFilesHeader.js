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
      color: '#fff',
    };

    return (
      <div style={style}>
        <div style={{flex: 2.5}}>Name</div>
        <div style={{flex: 1}}>Referential</div>
        <div style={{flex: 3}}>
          Netex exported
        </div>
        <div style={{flex: 1}}>
          Netex file
        </div>
        <div style={{flex: 3}}>
          GTFS exported
        </div>
        <div style={{flex: 1}}>
          GTFS file
        </div>
        <div style={{flex: 1}}>
          Difference
        </div>
        <div style={{flex: 4}}>
          Status
        </div>
      </div>
    );
  }
}
export default ExportedFilesHeader;
