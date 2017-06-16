import React from 'react';
import PropTypes from 'prop-types';
import MdMore from 'material-ui/svg-icons/navigation/expand-more';
import MdLess from 'material-ui/svg-icons/navigation/expand-less';
import MdActive from 'material-ui/svg-icons/social/notifications-active'
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

    // TODO: use loader instead and check "isReceiving"
    if (notification == null) return null;

    return (
      <div style={{
        border: '1px solid #777',
      }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            verticalAlign: 'middle',
            height: 40,
          }}
        >
          <div style={{display: 'flex'}}>
            { notification.enabled ?
              <MdActive color="green"/>
              : <MdInactive color="red"/>
            }
            <div style={{ fontWeight: 600, fontSize: 14 }}>{notification.notificationType}</div>
          </div>
          <IconButton>
            {expanded ?
              <MdLess onClick={() => { handleExpand(index, false)}}/>
              : <MdMore onClick={() => { handleExpand(index, true)}}/>}
          </IconButton>
        </div>
        { expanded && <NotificationEventFilter index={index} notification={notification}/> }
      </div>
    );
  }
}

export default NotificationTypeBox;
