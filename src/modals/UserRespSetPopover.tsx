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

import { Menu, MenuItem } from '@mui/material';

interface Responsibility {
  id: string;
  name: string;
}

interface UserRespSetPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  handleAdd: (id: string) => void;
  responsibilities?: Responsibility[];
  addedRespSets: string[];
}

const UserRespSetPopover = ({
  open,
  anchorEl,
  handleClose,
  handleAdd,
  responsibilities = [],
  addedRespSets,
}: UserRespSetPopoverProps) => {
  // Copy before sort — RTK state arrays are frozen.
  const sorted = [...responsibilities]
    .filter(r => r.id)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Menu
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      PaperProps={{ style: { maxHeight: '500px' } }}
    >
      {sorted.map(r => (
        <MenuItem
          style={{ fontSize: '0.9em' }}
          key={r.id}
          disabled={addedRespSets.indexOf(r.id) > -1}
          onClick={() => {
            handleAdd(r.id);
          }}
        >
          {r.name}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default UserRespSetPopover;
