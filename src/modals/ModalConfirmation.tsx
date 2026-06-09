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

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Button from '@mui/material/Button';

interface ModalConfirmationProps {
  open: boolean;
  title: string;
  body: string;
  handleClose: () => void;
  handleSubmit: () => void;
  actionBtnTitle: string;
}

const ModalConfirmation = ({
  open,
  title,
  body,
  handleClose,
  handleSubmit,
  actionBtnTitle,
}: ModalConfirmationProps) => {
  const actions = [
    <Button key="cancel" variant="text" color="primary" onClick={handleClose}>
      Cancel
    </Button>,
    <Button key="submit" variant="text" color="primary" onClick={handleSubmit}>
      {actionBtnTitle}
    </Button>,
  ];

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{body}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default ModalConfirmation;
