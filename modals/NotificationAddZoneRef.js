import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';

class NotificationAddZoneRef extends React.Component {

  handleNewRequest(payLoad) {
    if (typeof payLoad === 'object') {
      this.props.handleAdd(payLoad.id);
    }
  };

  render() {

    const { dataSource } = this.props;

    const dataSourceConfig = {
      text: 'name',
      value: 'id',
    };

    return (
      <div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <AutoComplete
            maxSearchResults={7}
            style={{marginTop: -20}}
            floatingLabelText={"Add administrative zone"}
            animated={true}
            filter={(searchText, key) => searchText !== '' && key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1}
            hintText="Administrative zone"
            dataSource={dataSource}
            dataSourceConfig={dataSourceConfig}
            onNewRequest={this.handleNewRequest.bind(this)}
          />
        </div>
      </div>
    )
  }
}

export default NotificationAddZoneRef;