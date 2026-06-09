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
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface Role {
  name: string;
  privateCode: string;
}

interface ModalCreateRoleProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleSubmit: (role: Role) => void;
  takenPrivateCodes: string[];
}

const emptyRole: Role = { name: '', privateCode: '' };

const ModalCreateRole = ({
  isModalOpen,
  handleCloseModal,
  handleSubmit,
  takenPrivateCodes,
}: ModalCreateRoleProps) => {
  const [role, setRole] = useState<Role>(emptyRole);

  const handleOnClose = () => {
    setRole(emptyRole);
    handleCloseModal();
  };

  const invalidPrivateCode = takenPrivateCodes.indexOf(role.privateCode) > -1;
  const isSavable = !invalidPrivateCode && role.name.length > 0 && role.privateCode.length > 0;

  const actions = [
    <Button key="close" variant="text" onClick={handleOnClose}>
      Close
    </Button>,
    <Button key="create" variant="text" disabled={!isSavable} onClick={() => handleSubmit(role)}>
      Create
    </Button>,
  ];

  return (
    <Dialog open={isModalOpen} onClose={handleOnClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create a new role</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <TextField
            placeholder="Name"
            label="Name"
            value={role.name}
            onChange={e => setRole({ ...role, name: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            placeholder="Private code"
            label="Private code"
            error={invalidPrivateCode}
            helperText={invalidPrivateCode ? 'Private code already exists' : ''}
            value={role.privateCode}
            onChange={e => setRole({ ...role, privateCode: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
        </div>
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default ModalCreateRole;
