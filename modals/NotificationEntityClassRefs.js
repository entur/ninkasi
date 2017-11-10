import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NotificationAddEntityClassRef from './NotificationAddEntityClassRef';
import IconButton from 'material-ui/IconButton';
import MdRemove from 'material-ui/svg-icons/content/remove';
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions';

class NotificationEntityClassRef extends React.Component {
  static propTypes = {
    notification: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired
  };

  handleRemoveEntityClass() {
    const { entityRefs } = this.refs;
    const { dispatch, index, notification } = this.props;
    const selectedIndex = entityRefs.options.selectedIndex;
    const entityClassRefs =
      notification.eventFilter.entityClassificationRefs || [];
    const entityClassToRemove = entityClassRefs[selectedIndex];

    if (entityClassToRemove) {
      dispatch(
        OrganizationRegisterActions.removeEntityClassRefNotification(
          index,
          entityClassToRemove
        )
      );
    }
  }

  render() {
    const { notification, visible } = this.props;

    const entityClassRefs =
      notification.eventFilter.entityClassificationRefs || [];

    return (
      <div
        style={{
          display: visible ? 'none' : 'flex',
          flexDirection: 'column',
          flex: 2,
          border: '1px solid #eee',
          marginTop: 10,
          padding: 5
        }}
      >
        <div style={{ width: '100%', fontSize: 12, fontWeight: 600 }}>
          Entity classification<span style={{ color: 'red', fontSize: 10 }}>
            *
          </span>
        </div>
        <div style={{ display: 'flex' }}>
          <select
            multiple="multiple"
            ref="entityRefs"
            style={{ width: '100%', fontSize: 12, flex: 2 }}
          >
            {entityClassRefs.map((ref, index) =>
              <option key={'entity-' + index}>{ref} </option>
            )}
          </select>
          <IconButton onClick={this.handleRemoveEntityClass.bind(this)}>
            <MdRemove color="#cc0000" />
          </IconButton>
        </div>
        {entityClassRefs.length === 0 &&
          <span
            style={{
              fontSize: 12,
              color: 'red',
              textAlign: 'left',
            }}
          >
            Required set of entity classifications can not be empty
          </span>}
        <NotificationAddEntityClassRef index={this.props.index} />
      </div>
    );
  }
}

export default connect(null)(NotificationEntityClassRef);
