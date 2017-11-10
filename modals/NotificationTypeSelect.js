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
        style={{flex: 1}}
        onChange={(e, index, value) => {
          handleChangeNotificationType(value);
        }}
      >
        {notificationTypes.map( type =>
          <MenuItem
            key={'notification-type-' + type}
            id={type}
            label={type}
            value={type}
            primaryText={type}
          />
        )}
      </SelectField>
    );
  }
}

export default NotificationTypeSelect;
