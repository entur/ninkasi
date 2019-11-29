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
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';

class NotificationTypeSelect extends React.Component {
  static propTypes = {
    notification: PropTypes.object.isRequired,
    handleChangeNotificationType: PropTypes.func.isRequired
  };

  render() {
    const {
      handleChangeNotificationType,
      notification,
      notificationTypes
    } = this.props;

    return (
      <SelectField
        hintText="Notification type"
        floatingLabelText="Notification type"
        value={notification.notificationType}
        style={{ flex: 1 }}
        onChange={(e, index, value) => {
          handleChangeNotificationType(value);
        }}
      >
        {notificationTypes.map(type => (
          <MenuItem
            key={'notification-type-' + type}
            id={type}
            label={type}
            value={type}
            primaryText={type}
          />
        ))}
      </SelectField>
    );
  }
}

export default NotificationTypeSelect;
