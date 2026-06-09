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

import { useEffect, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface Role {
  id?: string;
  name: string;
  privateCode: string;
}

interface ModalEditRoleProps {
  isModalOpen: boolean;
  role: Role | null;
  handleCloseModal: () => void;
  handleSubmit: (role: Role) => void;
}

const ModalEditRole = ({
  isModalOpen,
  role: roleProp,
  handleCloseModal,
  handleSubmit,
}: ModalEditRoleProps) => {
  const [role, setRole] = useState<Role | null>(roleProp);
  const [originalRoleName, setOriginalRoleName] = useState<string>(roleProp ? roleProp.name : '');

  useEffect(() => {
    if (roleProp) {
      setRole(roleProp);
      setOriginalRoleName(roleProp.name);
    }
  }, [roleProp]);

  if (!role) return null;

  const isSavable = role.name && role.name.length > 0;

  const actions = [
    <Button key="close" variant="text" onClick={handleCloseModal}>
      Close
    </Button>,
    <Button key="update" variant="text" disabled={!isSavable} onClick={() => handleSubmit(role)}>
      Update
    </Button>,
  ];

  return (
    <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
      <DialogTitle>{'Editing role ' + originalRoleName}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <TextField
            placeholder="Name"
            label="Name"
            value={role.name}
            onChange={e =>
              setRole({
                ...role,
                name: e.target.value,
              })
            }
            fullWidth
            margin="normal"
            required
          />
          <TextField
            disabled
            value={role.privateCode}
            placeholder="Private code"
            label="Private code"
            fullWidth
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default ModalEditRole;
