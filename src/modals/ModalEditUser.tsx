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
import {
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  InputLabel,
} from '@mui/material';
import ResponsiblitySetList from './ResponsiblitySetList';
import UserRespSetPopover from './UserRespSetPopover';

interface ContactDetails {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}

interface User {
  username: string;
  organisationRef: string;
  responsibilitySetRefs: string[];
  contactDetails: ContactDetails;
  personalAccount: boolean;
  [key: string]: any;
}

interface Organization {
  id: string;
  name: string;
}

interface Responsibility {
  id: string;
  name: string;
}

interface ModalEditUserProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleSubmit: (user: User) => void;
  user: any;
  takenUsernames: string[];
  organizations: Organization[];
  responsibilities: Responsibility[];
}

const emptyUser: User = {
  username: '',
  organisationRef: '',
  responsibilitySetRefs: [],
  contactDetails: { email: '', phone: '', firstName: '', lastName: '' },
  personalAccount: false,
};

const validateBy = (type: 'EMAIL' | 'USERNAME', value: string) => {
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRe = /^[a-zA-Z-. ]*$/;
  if (type === 'EMAIL') return emailRe.test(value);
  if (type === 'USERNAME') return usernameRe.test(value);
  return false;
};

const ModalEditUser = ({
  isModalOpen,
  handleCloseModal,
  handleSubmit,
  user: userProp,
  organizations,
  responsibilities,
}: ModalEditUserProps) => {
  const [user, setUser] = useState<User>(emptyUser);
  const [isAddingResponsibilitySet, setIsAddingResponsibilitySet] = useState(false);
  const [addRespAnchorEl, setAddRespAnchorEl] = useState<HTMLElement | null>(null);
  const [usernameValid, setUsernameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [originalUsername, setOriginalUsername] = useState('');
  const emailIsTaken = false;

  useEffect(() => {
    setUser({
      ...emptyUser,
      ...userProp,
      contactDetails: {
        ...emptyUser.contactDetails,
        ...(userProp?.contactDetails || {}),
      },
      personalAccount: userProp?.personalAccount || false,
    });
    setOriginalUsername(userProp?.username ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnClose = () => {
    setUser(emptyUser);
    setIsAddingResponsibilitySet(false);
    setAddRespAnchorEl(null);
    setUsernameValid(true);
    setEmailValid(true);
    setOriginalUsername('');
    handleCloseModal();
  };

  const handleChangeUsername = (value: string) => {
    const isValid = validateBy('USERNAME', value);
    setUser(prev => ({ ...prev, username: value }));
    setUsernameValid(isValid);
  };

  const handleChangeEmail = (value: string) => {
    const isValid = validateBy('EMAIL', value);
    setEmailValid(isValid);
    setUser(prev => ({
      ...prev,
      contactDetails: { ...prev.contactDetails, email: value },
    }));
  };

  const handleAddResponsibilitySet = (respSetId: string) => {
    setIsAddingResponsibilitySet(false);
    setUser(prev => ({
      ...prev,
      responsibilitySetRefs: [...prev.responsibilitySetRefs, respSetId],
    }));
  };

  const handleChangeIsPersonalAccount = (value: string) => {
    setUser(prev => ({ ...prev, personalAccount: value === 'personal_account' }));
  };

  const removeResponsibilitySet = (index: number) => {
    if (index > -1) {
      setUser(prev => ({
        ...prev,
        responsibilitySetRefs: [
          ...prev.responsibilitySetRefs.slice(0, index),
          ...prev.responsibilitySetRefs.slice(index + 1),
        ],
      }));
    }
  };

  const disableUpdate = !usernameValid || !emailValid;

  const actions = [
    <Button key="cancel" variant="outlined" onClick={handleOnClose}>
      Cancel
    </Button>,
    <Button
      key="update"
      variant="contained"
      disabled={disableUpdate}
      color="primary"
      onClick={() => handleSubmit(user)}
    >
      Update
    </Button>,
  ];

  return (
    <Dialog open={isModalOpen} onClose={handleOnClose} maxWidth="md" fullWidth>
      <DialogTitle>{'Editing user ' + originalUsername}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box onClick={e => e.stopPropagation()}>
            <FormControl>
              <RadioGroup
                defaultValue="notification_account"
                value={user.personalAccount ? 'personal_account' : 'notification_account'}
                onChange={e => {
                  e.stopPropagation();
                  handleChangeIsPersonalAccount(e.target.value);
                }}
              >
                <FormControlLabel
                  value="personal_account"
                  control={<Radio />}
                  label="Personal account"
                />
                <FormControlLabel
                  value="notification_account"
                  control={<Radio />}
                  label="Notification account"
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <TextField
            disabled
            placeholder="Username"
            label="Username"
            value={user.username}
            error={!usernameValid}
            helperText={
              !usernameValid ? 'Username can only include alphanumerics, hyphens and dot' : ''
            }
            onChange={e => handleChangeUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            placeholder="First name"
            label="First name"
            value={user.contactDetails?.firstName || ''}
            onChange={e =>
              setUser({
                ...user,
                contactDetails: {
                  ...(user.contactDetails || {}),
                  firstName: e.target.value,
                } as ContactDetails,
              })
            }
            fullWidth
            margin="normal"
            required
          />
          <TextField
            placeholder="Last name"
            label="Last name"
            value={user.contactDetails?.lastName || ''}
            onChange={e =>
              setUser({
                ...user,
                contactDetails: {
                  ...(user.contactDetails || {}),
                  lastName: e.target.value,
                } as ContactDetails,
              })
            }
            fullWidth
            margin="normal"
            required
          />
          <TextField
            placeholder="E-mail"
            label="E-mail"
            error={emailIsTaken || !emailValid}
            helperText={
              emailIsTaken ? 'E-mail already taken' : !emailValid ? 'Must be a valid e-mail' : ''
            }
            value={user.contactDetails?.email || ''}
            onChange={e => handleChangeEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            placeholder="Phonenumber"
            label="Phonenumber"
            value={user.contactDetails.phone}
            onChange={e =>
              setUser({
                ...user,
                contactDetails: {
                  ...user.contactDetails,
                  phone: e.target.value,
                },
              })
            }
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="edit-user-org-label">Organization</InputLabel>
            <Select
              labelId="edit-user-org-label"
              label="Organization"
              value={user.organisationRef}
              onChange={e => setUser({ ...user, organisationRef: e.target.value as string })}
            >
              {organizations.map(org => (
                <MenuItem key={org.id} value={org.id}>
                  {org.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <UserRespSetPopover
            responsibilities={responsibilities}
            addedRespSets={user.responsibilitySetRefs}
            anchorEl={addRespAnchorEl}
            handleAdd={handleAddResponsibilitySet}
            handleClose={() => setIsAddingResponsibilitySet(false)}
            open={isAddingResponsibilitySet}
          />
          <ResponsiblitySetList
            user={user}
            responsiblities={responsibilities}
            handleAdd={e => {
              setIsAddingResponsibilitySet(true);
              setAddRespAnchorEl(e.currentTarget);
            }}
            handleRemove={removeResponsibilitySet}
          />
        </Box>
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default ModalEditUser;
