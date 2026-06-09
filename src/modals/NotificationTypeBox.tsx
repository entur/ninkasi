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

import { ExpandMore, ExpandLess, NotificationsActive, NotificationsOff } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import NotificationEventFilter from './NotificationEventFilter';

interface NotificationLike {
  enabled: boolean;
  notificationType: string;
  eventFilter: any;
}

interface NotificationTypeBoxProps {
  notification: NotificationLike | null;
  index: number;
  handleExpand: (index: number, value: boolean) => void;
  expanded: boolean;
}

const NotificationTypeBox = ({
  notification,
  index,
  handleExpand,
  expanded,
}: NotificationTypeBoxProps) => {
  if (notification === null) return null;

  return (
    <Box
      sx={{
        border: '1px solid #eee',
        margin: '5px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          verticalAlign: 'middle',
          height: 40,
        }}
      >
        <Box sx={{ display: 'flex' }}>
          {notification.enabled ? (
            <NotificationsActive sx={{ color: '#1d9439' }} />
          ) : (
            <NotificationsOff sx={{ color: '#777' }} />
          )}
          <Box sx={{ fontWeight: 600, fontSize: 14 }}>{notification.notificationType}</Box>
        </Box>
        <IconButton size="large">
          {expanded ? (
            <ExpandLess
              onClick={() => {
                handleExpand(index, false);
              }}
            />
          ) : (
            <ExpandMore
              onClick={() => {
                handleExpand(index, true);
              }}
            />
          )}
        </IconButton>
      </Box>
      {expanded && <NotificationEventFilter index={index} notification={notification} />}
    </Box>
  );
};

export default NotificationTypeBox;
