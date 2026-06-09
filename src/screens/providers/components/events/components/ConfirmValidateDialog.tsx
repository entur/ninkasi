import { useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useValidateDatasetMutation } from '../hooks/useValidateDatasetMutation';

interface Props {
  providerId?: string;
  open: boolean;
  handleClose: () => void;
}

export const ConfirmValidateDialog = ({ providerId, open, handleClose }: Props) => {
  const { mutation } = useValidateDatasetMutation({ providerId });

  const onConfirm = useCallback(() => {
    mutation.mutate();
    handleClose();
  }, [mutation, handleClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Validate dataset</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to validate your dataset now?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={onConfirm}>
          Validate
        </Button>
      </DialogActions>
    </Dialog>
  );
};
