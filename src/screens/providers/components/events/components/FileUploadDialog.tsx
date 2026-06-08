import { useDropzone } from 'react-dropzone';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from '@mui/material';
import { FileUploadState, useFileUploadMutation } from '../hooks/useFileUploadMutation';

interface Props {
  providerId?: string;
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  isFlexDataset: boolean;
}

const formatFileSize = (size: number): string => {
  if (size > 1024) {
    return `${(size / 1024).toFixed(2)} Mb`;
  }
  return `${size.toFixed(2)} Kb`;
};

export const FileUploadDialog = ({
  providerId,
  isModalOpen,
  setModalOpen,
  isFlexDataset,
}: Props) => {
  const { mutation, progress, fileUploadState } = useFileUploadMutation({
    providerId,
    isFlexDataset,
  });
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/zip': ['.zip', '.rar'],
    },
    multiple: true,
  });

  const totalFileSize = acceptedFiles.length
    ? acceptedFiles.map(file => file.size / 1024).reduce((f1, f2) => f1 + f2)
    : 0;

  return (
    <Dialog open={isModalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{isFlexDataset ? 'Upload new flex dataset' : 'Upload new dataset'}</DialogTitle>
      <DialogContent>
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            mt: 1,
            '&:hover': { borderColor: 'primary.main' },
          }}
        >
          <input {...getInputProps()} />
          <Typography variant="body2">
            Drop files here, or click to choose files to upload as a new dataset. Only .zip and .rar
            files are supported.
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Box
            component="select"
            multiple
            sx={{
              width: '100%',
              minHeight: 80,
              borderColor: 'divider',
              borderStyle: 'solid',
              borderWidth: 1,
              borderRadius: 1,
              p: 1,
              fontFamily: 'inherit',
            }}
          >
            {acceptedFiles.map((file, index) => (
              <option key={'file-' + index}>{file.name}</option>
            ))}
          </Box>
        </Box>

        {fileUploadState === FileUploadState.COMPLETED ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            Dataset uploaded
          </Alert>
        ) : null}
        {fileUploadState === FileUploadState.FAILED ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error uploading dataset
          </Alert>
        ) : null}
        {fileUploadState !== FileUploadState.NOT_STARTED ? (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        ) : null}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Typography variant="body2" sx={{ visibility: totalFileSize ? 'visible' : 'hidden' }}>
            Total size: {formatFileSize(totalFileSize)}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalOpen(false)}>Close</Button>
        <Button
          variant="contained"
          disabled={!acceptedFiles.length}
          onClick={() => {
            mutation.mutate([...acceptedFiles]);
          }}
        >
          Upload dataset
        </Button>
      </DialogActions>
    </Dialog>
  );
};
