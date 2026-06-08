import { useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FileUploadDialog } from './FileUploadDialog';
import { ConfirmValidateDialog } from './ConfirmValidateDialog';
import { ConfirmFlexUploadDialog } from './ConfirmFlexUploadDialog';

interface Props {
  providerId?: string;
  hideFlexDataImport?: boolean;
}

export const UploadAndValidation = ({ providerId, hideFlexDataImport = false }: Props) => {
  const [fileUploadDialogOpen, setFileUploadDialogOpen] = useState(false);
  const [flexDataset, setFlexDataset] = useState(false);
  const [confirmValidateDialogOpen, setConfirmValidateDialogOpen] = useState(false);
  const [confirmFlexUploadDialogOpen, setConfirmFlexUploadDialogOpen] = useState(false);

  if (!providerId) {
    return null;
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            endIcon={<CloudUploadIcon />}
            onClick={() => {
              setFlexDataset(false);
              setFileUploadDialogOpen(true);
            }}
          >
            Upload new dataset
          </Button>
          <Button variant="outlined" onClick={() => setConfirmValidateDialogOpen(true)}>
            Validate dataset
          </Button>
        </Stack>
        <Stack direction="row" spacing={1}>
          {!hideFlexDataImport && (
            <Button
              variant="contained"
              endIcon={<CloudUploadIcon />}
              onClick={() => setConfirmFlexUploadDialogOpen(true)}
            >
              Flexible transport: upload new dataset
            </Button>
          )}
        </Stack>
      </Box>
      <FileUploadDialog
        providerId={providerId}
        isModalOpen={fileUploadDialogOpen}
        setModalOpen={setFileUploadDialogOpen}
        isFlexDataset={flexDataset}
      />
      <ConfirmValidateDialog
        providerId={providerId}
        open={confirmValidateDialogOpen}
        handleClose={() => setConfirmValidateDialogOpen(false)}
      />
      <ConfirmFlexUploadDialog
        open={confirmFlexUploadDialogOpen}
        handleClose={() => setConfirmFlexUploadDialogOpen(false)}
        handleFlex={() => {
          setFlexDataset(true);
          setFileUploadDialogOpen(true);
        }}
        handleNonFlex={() => {
          setFlexDataset(false);
          setFileUploadDialogOpen(true);
        }}
      />
    </>
  );
};
