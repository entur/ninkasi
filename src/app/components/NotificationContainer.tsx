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

import { useState, useEffect, useRef } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';
import { useAppSelector } from 'store/hooks';

interface NotificationItem {
  message: string;
  level?: string;
  key?: string;
}

const NotificationContainer = () => {
  const notification = useAppSelector(
    (state: any) => state.UtilsReducer.notification as NotificationItem | null | undefined
  );

  const [queue, setQueue] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<NotificationItem | null>(null);
  const processedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (notification && notification.message) {
      // Create a unique key for this notification
      const notificationKey = `${notification.message}-${notification.level}-${Date.now()}`;

      // Check if we've already processed this exact notification
      if (!processedRef.current.has(notificationKey)) {
        processedRef.current.add(notificationKey);

        // Add to queue
        setQueue(prevQueue => [...prevQueue, { ...notification, key: notificationKey }]);

        // Clean up old processed notifications (keep only last 50)
        if (processedRef.current.size > 50) {
          const entries = Array.from(processedRef.current);
          processedRef.current = new Set(entries.slice(-50));
        }
      }
    }
  }, [notification]);

  useEffect(() => {
    if (queue.length > 0 && !currentNotification) {
      // Set current notification from queue
      setCurrentNotification(queue[0]);
      setQueue(prevQueue => prevQueue.slice(1));
      setOpen(true);
    }
  }, [queue, currentNotification]);

  const handleClose = (_event?: unknown, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setCurrentNotification(null);
  };

  // Map the old notification levels to MUI severity
  const getSeverity = (level: string | undefined) => {
    switch (level) {
      case 'error':
        return 'error';
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      slots={{ transition: Slide }}
      slotProps={{ transition: { onExited: handleExited } }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {currentNotification ? (
        <Alert
          onClose={handleClose}
          severity={getSeverity(currentNotification.level)}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {currentNotification.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
};

export default NotificationContainer;
