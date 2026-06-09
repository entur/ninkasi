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

import { useRef, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, Select, MenuItem, InputLabel, IconButton } from '@mui/material';
import { Remove, Add } from '@mui/icons-material';

interface Classification {
  name: string;
  privateCode: string;
}

interface EntityType {
  name: string;
  privateCode: string;
  codeSpace: string;
  classifications: Classification[];
}

interface CodeSpace {
  id: string;
  xmlns: string;
}

interface ModalCreateEntityTypeProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleSubmit: (entityType: EntityType) => void;
  takenPrivateCodes: string[];
  codeSpaces: CodeSpace[];
}

const initialEntityType: EntityType = {
  name: '',
  privateCode: '',
  codeSpace: '',
  classifications: [],
};

const initialTempClassification: Classification = {
  name: '',
  privateCode: '',
};

const ModalCreateEntityType = ({
  isModalOpen,
  handleCloseModal,
  handleSubmit,
  takenPrivateCodes,
  codeSpaces,
}: ModalCreateEntityTypeProps) => {
  const classificationsRef = useRef<HTMLSelectElement | null>(null);
  const [entityType, setEntityType] = useState<EntityType>(initialEntityType);
  const [isCreatingNewClassification, setIsCreatingNewClassification] = useState(false);
  const [tempClassification, setTempClassification] =
    useState<Classification>(initialTempClassification);

  const handleOnClose = () => {
    setEntityType(initialEntityType);
    setIsCreatingNewClassification(false);
    setTempClassification(initialTempClassification);
    handleCloseModal();
  };

  const getClassificationTitle = (classification: Classification) =>
    `name=${classification.name}, privateCode=${classification.privateCode}`;

  const handleAddClassification = () => {
    setIsCreatingNewClassification(false);
    setEntityType({
      ...entityType,
      classifications: [...entityType.classifications, tempClassification],
    });
    setTempClassification(initialTempClassification);
  };

  const handleRemoveClassification = () => {
    const classifications = classificationsRef.current;
    if (!classifications) return;
    const idx = classifications.options.selectedIndex;
    if (idx > -1) {
      setEntityType({
        ...entityType,
        classifications: [
          ...entityType.classifications.slice(0, idx),
          ...entityType.classifications.slice(idx + 1),
        ],
      });
    }
  };

  const invalidPrivateCode = takenPrivateCodes.indexOf(entityType.privateCode) > -1;
  const isClassificationPrivateCodeTaken =
    entityType.classifications.map(c => c.privateCode).indexOf(tempClassification.privateCode) > -1;
  const isSavable =
    !invalidPrivateCode &&
    entityType.name.length > 0 &&
    entityType.codeSpace.length > 0 &&
    entityType.privateCode.length > 0;

  const actions = [
    <Button key="close" variant="text" onClick={handleOnClose}>
      Close
    </Button>,
    <Button
      key="create"
      variant="text"
      disabled={!isSavable}
      onClick={() => handleSubmit(entityType)}
    >
      Create
    </Button>,
  ];

  return (
    <Dialog open={isModalOpen} onClose={handleOnClose} maxWidth="md" fullWidth>
      <DialogTitle>Create a new entity type</DialogTitle>
      <DialogContent>
        <Box>
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
              value={entityType.name}
              onChange={e => setEntityType({ ...entityType, name: e.target.value })}
              fullWidth
            />
            <TextField
              placeholder="private code"
              label="Private code"
              error={invalidPrivateCode}
              helperText={invalidPrivateCode ? 'Private code already exists' : ''}
              value={entityType.privateCode}
              onChange={e => setEntityType({ ...entityType, privateCode: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="codespace-label">Codespace</InputLabel>
              <Select
                labelId="codespace-label"
                label="Codespace"
                value={entityType.codeSpace}
                onChange={e =>
                  setEntityType({ ...entityType, codeSpace: e.target.value as string })
                }
              >
                {codeSpaces.map(codeSpace => (
                  <MenuItem key={codeSpace.id} value={codeSpace.id}>
                    {codeSpace.xmlns}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ width: '100%', fontSize: 12 }}>Entity classifications</Box>
            <Box
              component="select"
              multiple
              sx={{ width: '100%', fontSize: 12 }}
              ref={classificationsRef}
            >
              {entityType.classifications.map((et, index) => (
                <option key={'ec-' + index}>{getClassificationTitle(et)} </option>
              ))}
            </Box>
            <Box sx={{ textAlign: 'left', width: '100%' }}>
              <IconButton onClick={() => setIsCreatingNewClassification(true)} size="large">
                <Add sx={{ color: '#228B22' }} />
              </IconButton>
              <IconButton onClick={handleRemoveClassification} size="large">
                <Remove sx={{ color: '#cc0000' }} />
              </IconButton>
            </Box>
            {isCreatingNewClassification ? (
              <Box sx={{ border: '1px dotted', width: '100%' }}>
                <Box
                  sx={{
                    fontSize: 12,
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                >
                  New classification
                </Box>
                <TextField
                  placeholder="Name"
                  label="Name"
                  value={tempClassification.name}
                  onChange={e =>
                    setTempClassification({ ...tempClassification, name: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  placeholder="Private code"
                  label="Private code"
                  error={isClassificationPrivateCodeTaken}
                  helperText={
                    isClassificationPrivateCodeTaken ? 'Private code is already taken' : ''
                  }
                  onChange={e =>
                    setTempClassification({
                      ...tempClassification,
                      privateCode: e.target.value,
                    })
                  }
                  value={tempClassification.privateCode}
                  fullWidth
                />
                <Button
                  variant="text"
                  sx={{ width: '100%' }}
                  disabled={
                    isClassificationPrivateCodeTaken ||
                    !tempClassification.name.length ||
                    !tempClassification.privateCode.length
                  }
                  onClick={handleAddClassification}
                >
                  Add
                </Button>
              </Box>
            ) : null}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default ModalCreateEntityType;
