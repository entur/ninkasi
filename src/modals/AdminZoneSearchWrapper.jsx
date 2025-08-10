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
import { Chip } from '@mui/material';

class AdminZoneSearchWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
    };
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

  handleNewRequest({ value, text }, index) {
    if (value && text) {
      this.props.handleNewRequest({
        value,
        text,
      });
    }

    this.setState({
      inputValue: '',
    });
  }

  render() {
    const { administrativeZones, chip, handleDeleteChip } = this.props;

    const formattedZones = administrativeZones.map(zone => ({
      text: `${zone.name}  (${this.getZoneType(zone.type)})`,
      value: zone.id,
    }));

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Autocomplete
          style={{ marginTop: -5, flex: 2 }}
          options={formattedZones}
          getOptionLabel={option => option.text}
          inputValue={this.state.inputValue}
          onInputChange={(event, newInputValue) => {
            this.setState({ inputValue: newInputValue });
          }}
          onChange={(event, newValue) => {
            if (newValue) {
              this.handleNewRequest(newValue, -1);
            }
          }}
          filterLimit={7}
          fullWidth
          renderInput={params => (
            <TextField
              {...params}
              placeholder="Restrict to administrative zone"
              variant="outlined"
            />
          )}
        />
        <div style={{ flex: 1, width: '100%', textAlign: 'center' }}>
          {chip ? (
            <Chip
              label={chip.name}
              style={{ marginTop: -12, marginLeft: 20 }}
              onDelete={handleDeleteChip}
            />
          ) : (
            <div style={{ fontSize: 12, fontStyle: 'italic' }}>No restrictions ...</div>
          )}
        </div>
      </div>
    );
  }
}

export default AdminZoneSearchWrapper;
