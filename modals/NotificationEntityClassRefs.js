import React from 'react';
import PropTypes from 'prop-types';
import NotificationAddEntityClassRef from './NotificationAddEntityClassRef';

class NotificationEntityClassRef extends React.Component {

  static propTypes = {
    notification: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired
  };

  render() {

    const { notification, visible } = this.props;

    const  entityClassRefs = notification.eventFilter.entityClassificationRefs || [];

    return (
      <div
        style={{
          display: visible ? 'none' : 'flex',
          flexDirection: 'column',
          flex: 2,
          border: '1px solid #777'
        }}
      >
        <div style={{ width: '100%', fontSize: 12, fontWeight: 600 }}>
          Entity classification
        </div>
        <select multiple="multiple" style={{ width: '100%', fontSize: 12 }}>
          {entityClassRefs
          .map((ref, index) =>
            <option key={'entity-' + index}>{ref} </option>
          )}
        </select>
        <NotificationAddEntityClassRef/>
      </div>
    )
  }
}

export default  NotificationEntityClassRef;