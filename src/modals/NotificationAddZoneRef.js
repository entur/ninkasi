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
import AutoComplete from 'material-ui/AutoComplete';

class NotificationAddZoneRef extends React.Component {
  handleNewRequest({ text, value }) {
    if (text && value) {
      this.props.handleAdd(value);
      this.refs.adminSearch.setState({
        searchText: ''
      });
    }
  }

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
        <div
          style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}
        >
          <AutoComplete
            maxSearchResults={7}
            ref="adminSearch"
            floatingLabelText={'Add administrative zone'}
            animated={true}
            filter={(searchText, key) =>
              searchText !== '' &&
              key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
            }
            hintText="Administrative zone"
            dataSource={formattedZones}
            onNewRequest={this.handleNewRequest.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default NotificationAddZoneRef;
