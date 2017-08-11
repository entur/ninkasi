import React from 'react';
import MdHighlightOff from 'material-ui/svg-icons/action/highlight-off';
import MdCircleCheck from 'material-ui/svg-icons/action/check-circle';

const NotificationStatus = ({notification}) => {
  const enumMap = {
    "EMAIL": "Email",
    "EMAIL_BATCH": "Email batch",
    "WEB": "Web"
  };

  return (
    <div style={{display: 'flex'}}>
      { notification.enabled ?
        <MdCircleCheck style={{color: '#008000', height: 15, width: 15}}/>
      : <MdHighlightOff style={{color: '#cc0000', height: 15, width: 15}}/>
      }
      <span style={{fontWeight: 600, marginLeft: 4}}>{enumMap[notification.notificationType]}</span>
    </div>
  )
};

export default NotificationStatus;