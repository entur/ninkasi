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

import { Snackbar, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { clearNotification } from '@/reducers/UtilsReducer';

type Severity = 'error' | 'success' | 'warning' | 'info';

interface NotificationItem {
  message: string;
  level?: Severity;
}

const NotificationContainer = () => {
  const dispatch = useAppDispatch();
  const notification = useAppSelector(
    (state: any) => state.UtilsReducer.notification as NotificationItem | null | undefined
  );

  if (!notification?.message) return null;

  const handleClose = (_event?: unknown, reason?: string) => {
    if (reason === 'clickaway') return;
    dispatch(clearNotification());
  };

  return (
    <Snackbar
      key={notification.message}
      open
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={notification.level ?? 'info'}
        variant="filled"
        sx={{ minWidth: 300 }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationContainer;
