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
import PropTypes from 'prop-types';
import MdMore from 'material-ui/svg-icons/navigation/expand-more';
import MdLess from 'material-ui/svg-icons/navigation/expand-less';
import MdActive from 'material-ui/svg-icons/social/notifications-active';
import MdInactive from 'material-ui/svg-icons/social/notifications-off';
import IconButton from 'material-ui/IconButton';
import NotificationEventFilter from './NotificationEventFilter';

class NotificationTypeBox extends React.Component {
  static propTypes = {
    notification: PropTypes.object.isRequired,
    handleExpand: PropTypes.func.isRequired,
    expanded: PropTypes.bool.isRequired
  };

  render() {
    const { notification, index, handleExpand, expanded } = this.props;

    if (notification === null) return null;

    return (
      <div
        style={{
          border: '1px solid #eee',
          margin: 5
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            verticalAlign: 'middle',
            height: 40
          }}
        >
          <div style={{ display: 'flex' }}>
            {notification.enabled ? (
              <MdActive color="#1d9439" />
            ) : (
              <MdInactive color="#777" />
            )}
            <div style={{ fontWeight: 600, fontSize: 14 }}>
              {notification.notificationType}
              {notification.isNew && (
                <span
                  style={{
                    color: 'orange',
                    fontSize: 8,
                    verticalAlign: 'super'
                  }}
                >
                  New
                </span>
              )}
            </div>
          </div>
          <IconButton size="large">
            {expanded ? (
              <MdLess
                onClick={() => {
                  handleExpand(index, false);
                }}
              />
            ) : (
              <MdMore
                onClick={() => {
                  handleExpand(index, true);
                }}
              />
            )}
          </IconButton>
        </div>
        {expanded && (
          <NotificationEventFilter index={index} notification={notification} />
        )}
      </div>
    );
  }
}

export default NotificationTypeBox;
