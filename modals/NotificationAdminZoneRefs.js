import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NotificationAddZoneRef from './NotificationAddZoneRef';
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions';
import IconButton from 'material-ui/IconButton';
import MdRemove from 'material-ui/svg-icons/content/remove';

class NotificationAdminZoneRefs extends React.Component {

  static propTypes = {
    notification: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired
  };

  handleRemoveAdminRefRole() {
    const { adminRefs } = this.refs
    const { dispatch, index, notification } = this.props;
    const selectedIndex = adminRefs.options.selectedIndex
    const administrativeZoneRefs = (notification.eventFilter.administrativeZoneRefs || []);
    const adminZoneIdToDelete = administrativeZoneRefs[selectedIndex];

    if (adminZoneIdToDelete) {
      dispatch(OrganizationRegisterActions.removeAdminZoneRefToNotification(index, adminZoneIdToDelete));
    }
  }

  handleAddAdminRefRole(value) {
    const { index, dispatch } = this.props;
    dispatch(OrganizationRegisterActions.addAdminZoneRefToNotification(index, value));
  }

  render() {

    const { notification, visible, administrativeZones } = this.props;
    const administrativeZoneRefs = (notification.eventFilter.administrativeZoneRefs || []);

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
          Administrative zones
        </div>
        <div style={{display: 'flex'}}>
          <div style={{display: 'flex', flexDirection: 'column', flex: 2}}>
          <select multiple="multiple" ref="adminRefs" style={{ width: '100%', fontSize: 12 }}>
            {administrativeZoneRefs
            .map((ref, index) =>
              <option key={'entity-' + index}>{ref} </option>
            )}
          </select>
            <NotificationAddZoneRef
              handleAdd={this.handleAddAdminRefRole.bind(this)}
              dataSource={administrativeZones}
              handleDelete={this.handleRemoveAdminRefRole.bind(this)}
            />
          </div>
            <IconButton
              onClick={this.handleRemoveAdminRefRole.bind(this)}
            >
              <MdRemove
                color="#cc0000"
              />
            </IconButton>
          </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  administrativeZones: state.OrganizationReducer.administrativeZones
})

export default  connect(mapStateToProps)(NotificationAdminZoneRefs);