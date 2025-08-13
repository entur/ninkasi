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
import { Autocomplete, TextField } from '@mui/material';

class NotificationAddZoneRef extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }

  handleNewRequest({ text, value }) {
    if (text && value) {
      this.props.handleAdd(value);
      this.setState({
        inputValue: '',
      });
    }
  }

  getZoneType(type) {
    const typeMap = {
      COUNTRY: 'Country',
      COUNTY: 'County',
      LOCALITY: 'Muncipality',
      CUSTOM: 'Custom',
    };
    return typeMap[type] || 'Uknown';
  }

  render() {
    const { dataSource } = this.props;

    const formattedZones = dataSource.map(zone => ({
      text: `${zone.name}  (${this.getZoneType(zone.type)})`,
      value: zone.id,
    }));

    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
          <Autocomplete
            options={formattedZones}
            getOptionLabel={option => option.text}
            inputValue={this.state.inputValue}
            onInputChange={(event, newInputValue) => {
              this.setState({ inputValue: newInputValue });
            }}
            onChange={(event, newValue) => {
              if (newValue) {
                this.handleNewRequest(newValue);
              }
            }}
            filterLimit={7}
            renderInput={params => (
              <TextField
                {...params}
                label="Add administrative zone"
                placeholder="Administrative zone"
                variant="outlined"
                margin="normal"
                size="small"
              />
            )}
          />
        </div>
      </div>
    );
  }
}

export default NotificationAddZoneRef;
