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
import { Box, Menu, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import Button from '@mui/material/Button';
import { useAppDispatch } from 'store/hooks';
import { changeEventFilterStateReducer } from 'reducers/OrganizationReducer';

interface EventFilter {
  states?: string[];
}

interface EventFilterStatesPopoverProps {
  index: number;
  eventFilter: EventFilter;
  enabled: boolean;
  allStates: string[];
}

const EventFilterStatesPopover = ({
  index,
  eventFilter,
  enabled,
  allStates,
}: EventFilterStatesPopoverProps) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleCheckState = (state: string, isChecked: boolean) => {
    dispatch(changeEventFilterStateReducer({ index, state, isChecked }));
  };

  const states = eventFilter.states || [];

  return (
    <div>
      <Button
        variant="contained"
        disabled={!enabled}
        onClick={handleOpen}
        sx={{ marginLeft: '10px' }}
      >
        <span>
          States
          <Box component="span" sx={{ color: 'red' }}>
            *
          </Box>
        </span>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        {allStates.map((state, i) => {
          const checked = states.indexOf(state) > -1;

          return (
            <MenuItem key={'state-' + i} sx={{ fontSize: 12, minHeight: 18 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(_e, isChecked) => {
                      handleCheckState(state, isChecked);
                    }}
                  />
                }
                label={state}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default EventFilterStatesPopover;
