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
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import {
  isReasonValid,
  MAX_REASON_LENGTH,
  MIN_REASON_LENGTH,
} from 'screens/graphControl/graphControlUtils';

interface EmergencyConfirmDialogProps {
  open: boolean;
  title: string;
  impact: string[];
  confirmLabel: string;
  severity?: 'error' | 'warning';
  pending?: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

/**
 * Confirmation of an emergency operation in production, with a mandatory reason recorded in the audit log.
 */
const EmergencyConfirmDialog = ({
  open,
  title,
  impact,
  confirmLabel,
  severity = 'error',
  pending = false,
  onCancel,
  onConfirm,
}: EmergencyConfirmDialogProps) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (open) {
      setReason('');
    }
  }, [open]);

  const valid = isReasonValid(reason);

  return (
    <Dialog open={open} onClose={pending ? undefined : onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Alert severity={severity}>
            {impact.map(line => (
              <div key={line}>{line}</div>
            ))}
          </Alert>
          <TextField
            label="Reason"
            required
            multiline
            minRows={2}
            autoFocus
            value={reason}
            onChange={event => setReason(event.target.value)}
            disabled={pending}
            slotProps={{ htmlInput: { maxLength: MAX_REASON_LENGTH } }}
            helperText={`Required, at least ${MIN_REASON_LENGTH} characters. Recorded with your name in the audit log.`}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color={severity}
          disabled={!valid || pending}
          onClick={() => onConfirm(reason.trim())}
          startIcon={pending ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmergencyConfirmDialog;
