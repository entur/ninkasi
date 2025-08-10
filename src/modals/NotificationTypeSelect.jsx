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

import React from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';

class NotificationTypeSelect extends React.Component {
  static propTypes = {
    notification: PropTypes.object.isRequired,
    handleChangeNotificationType: PropTypes.func.isRequired,
  };

  render() {
    const { handleChangeNotificationType, notification, notificationTypes } = this.props;

    return (
      <FormControl style={{ flex: 1 }}>
        <Select
          value={notification.notificationType}
          onChange={e => {
            handleChangeNotificationType(e.target.value);
          }}
          displayEmpty
        >
          {notificationTypes.map(type => (
            <MenuItem key={'notification-type-' + type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

export default NotificationTypeSelect;
