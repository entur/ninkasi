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

import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

interface NotificationLike {
  notificationType: string;
}

interface NotificationTypeSelectProps {
  notification: NotificationLike;
  notificationTypes: string[];
  handleChangeNotificationType: (value: string) => void;
}

const NotificationTypeSelect = ({
  notification,
  notificationTypes,
  handleChangeNotificationType,
}: NotificationTypeSelectProps) => (
  <FormControl style={{ flex: 1 }} margin="normal">
    <InputLabel id="notification-type-label">Notification type</InputLabel>
    <Select
      labelId="notification-type-label"
      label="Notification type"
      value={notification.notificationType}
      onChange={e => {
        handleChangeNotificationType(e.target.value as string);
      }}
    >
      {notificationTypes.map(type => (
        <MenuItem key={'notification-type-' + type} value={type}>
          {type}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default NotificationTypeSelect;
