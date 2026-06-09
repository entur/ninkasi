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
import { changeEventFilterActionReducer } from 'reducers/OrganizationReducer';

interface EventFilter {
  jobDomain?: string;
  actions?: string[];
}

interface EventFilterActionsPopoverProps {
  index: number;
  eventFilter: EventFilter;
  enabled: boolean;
  allActions: Record<string, string[]>;
}

const EventFilterActionsPopover = ({
  index,
  eventFilter,
  enabled,
  allActions,
}: EventFilterActionsPopoverProps) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleCheckAction = (action: string, isChecked: boolean) => {
    dispatch(changeEventFilterActionReducer({ index, action, isChecked }));
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const actions = eventFilter.actions || [];
  const allActionsChecked = actions.indexOf('*') > -1;

  return (
    <div>
      <Button
        variant="contained"
        disabled={!enabled && !eventFilter.jobDomain}
        onClick={handleOpen}
      >
        <span>
          Actions
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
        {eventFilter.jobDomain &&
          allActions[eventFilter.jobDomain].map((action, i) => {
            const actionLabel = action === '*' ? 'ALL' : action;
            const checked = allActionsChecked ? true : actions.indexOf(action) > -1;

            return (
              <MenuItem key={'action-' + i} sx={{ fontSize: 12, minHeight: 18 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(_e, isChecked) => {
                        handleCheckAction(action, isChecked);
                      }}
                    />
                  }
                  label={actionLabel}
                />
              </MenuItem>
            );
          })}
      </Menu>
    </div>
  );
};

export default EventFilterActionsPopover;
