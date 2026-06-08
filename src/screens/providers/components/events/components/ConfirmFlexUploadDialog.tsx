import { useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

interface Props {
  open: boolean;
  handleClose: () => void;
  handleFlex: () => void;
  handleNonFlex: () => void;
}

export const ConfirmFlexUploadDialog = ({
  open,
  handleClose,
  handleFlex,
  handleNonFlex,
}: Props) => {
  const onFlex = useCallback(() => {
    handleFlex();
    handleClose();
  }, [handleFlex, handleClose]);

  const onNonFlex = useCallback(() => {
    handleNonFlex();
    handleClose();
  }, [handleNonFlex, handleClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload flexible transport dataset</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to upload a flexible transport dataset?</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onFlex}>
          Yes, upload flexible line
        </Button>
        <Button variant="outlined" onClick={onNonFlex}>
          No, upload regular line
        </Button>
      </DialogActions>
    </Dialog>
  );
};
