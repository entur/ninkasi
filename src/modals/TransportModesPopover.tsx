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
import { Menu, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import Button from '@mui/material/Button';

interface TransportModesPopoverProps {
  transportModes: string[];
  allTransportModes: string[];
  handleCheckTransportMode: (transportMode: string, isChecked: boolean) => void;
}

const TransportModesPopover = ({
  transportModes,
  allTransportModes,
  handleCheckTransportMode,
}: TransportModesPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen} sx={{ marginLeft: '10px' }}>
        <span>Generate service links for transport modes</span>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        {allTransportModes.map((transportMode, i) => {
          const checked = transportModes.indexOf(transportMode) > -1;
          return (
            <MenuItem key={'action-' + i} sx={{ fontSize: 12, minHeight: 18 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={e => {
                      handleCheckTransportMode(transportMode, e.target.checked);
                    }}
                  />
                }
                label={transportMode}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default TransportModesPopover;
