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
import { Autocomplete, TextField, Chip } from '@mui/material';

interface AdminZone {
  id: string;
  name: string;
  type: string;
}

interface ZoneOption {
  text: string;
  value: string;
}

interface AdminZoneSearchWrapperProps {
  administrativeZones: AdminZone[];
  chip?: { value: string; name: string } | null;
  handleDeleteChip?: () => void;
  handleNewRequest: (req: { value: string; text: string }) => void;
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

const AdminZoneSearchWrapper = ({
  administrativeZones,
  chip,
  handleDeleteChip,
  handleNewRequest,
}: AdminZoneSearchWrapperProps) => {
  const [inputValue, setInputValue] = useState('');

  const formattedZones: ZoneOption[] = administrativeZones.map(zone => ({
    text: `${zone.name}  (${getZoneType(zone.type)})`,
    value: zone.id,
  }));

  const onNewRequest = (option: ZoneOption) => {
    if (option.value && option.text) {
      handleNewRequest({ value: option.value, text: option.text });
    }
    setInputValue('');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Autocomplete
        style={{ marginTop: -5, flex: 2 }}
        options={formattedZones}
        getOptionLabel={option => option.text}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(_event, newValue) => {
          if (newValue) {
            onNewRequest(newValue);
          }
        }}
        fullWidth
        renderInput={params => (
          <TextField {...params} placeholder="Restrict to administrative zone" variant="outlined" />
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
};

export default AdminZoneSearchWrapper;
