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

import { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface Zone {
  id: string;
  name: string;
  type: string;
}

interface ZoneOption {
  text: string;
  value: string;
}

interface NotificationAddZoneRefProps {
  dataSource: Zone[];
  handleAdd: (value: string) => void;
  handleDelete?: () => void;
}

const getZoneType = (type: string) => {
  const typeMap: Record<string, string> = {
    COUNTRY: 'Country',
    COUNTY: 'County',
    LOCALITY: 'Muncipality',
    CUSTOM: 'Custom',
  };
  return typeMap[type] || 'Uknown';
};

const NotificationAddZoneRef = ({ dataSource, handleAdd }: NotificationAddZoneRefProps) => {
  const [inputValue, setInputValue] = useState('');

  const formattedZones: ZoneOption[] = dataSource.map(zone => ({
    text: `${zone.name}  (${getZoneType(zone.type)})`,
    value: zone.id,
  }));

  const handleNewRequest = (option: ZoneOption) => {
    if (option.text && option.value) {
      handleAdd(option.value);
      setInputValue('');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
        <Autocomplete
          options={formattedZones}
          getOptionLabel={option => option.text}
          inputValue={inputValue}
          onInputChange={(_event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          onChange={(_event, newValue) => {
            if (newValue) {
              handleNewRequest(newValue);
            }
          }}
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
};

export default NotificationAddZoneRef;
