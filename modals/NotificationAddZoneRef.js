import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';

class NotificationAddZoneRef extends React.Component {

  handleNewRequest({text, value}) {
    if (text && value) {
      this.props.handleAdd(value);
      this.refs.adminSearch.setState({
        searchText: ''
      });
    }
  };

  getZoneType(type) {
    let typeMap = {
      COUNTRY: 'Country',
      COUNTY: 'County',
      LOCALITY: 'Muncipality',
      CUSTOM: 'Custom'
    };
    return typeMap[type] || 'Uknown';
  }

  render() {

    const { dataSource } = this.props;

    const formattedZones = dataSource.map(zone => ({
      text: `${zone.name}  (${this.getZoneType(zone.type)})`,
      value: zone.id
    }));

    return (
      <div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <AutoComplete
            maxSearchResults={7}
            ref="adminSearch"
            style={{marginTop: -15, marginBottom: -20}}
            floatingLabelText={"Add administrative zone"}
            animated={true}
            filter={(searchText, key) => searchText !== '' && key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1}
            hintText="Administrative zone"
            dataSource={formattedZones}
            onNewRequest={this.handleNewRequest.bind(this)}
          />
        </div>
      </div>
    )
  }
}

export default NotificationAddZoneRef;