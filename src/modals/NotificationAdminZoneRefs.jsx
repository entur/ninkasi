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
import { connect } from 'react-redux';
import NotificationAddZoneRef from './NotificationAddZoneRef';
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';
import { IconButton } from '@mui/material';
import { Remove } from '@mui/icons-material';

class NotificationAdminZoneRefs extends React.Component {
  constructor(props) {
    super(props);
    this.adminRefsRef = React.createRef();
  }

  static propTypes = {
    notification: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired
  };

  handleRemoveAdminRefRole() {
    const adminRefs = this.adminRefsRef.current;
    const { dispatch, index, notification } = this.props;
    const selectedIndex = adminRefs.options.selectedIndex;
    const administrativeZoneRefs =
      notification.eventFilter.administrativeZoneRefs || [];
    const adminZoneIdToDelete = administrativeZoneRefs[selectedIndex];

    if (adminZoneIdToDelete) {
      dispatch(
        OrganizationRegisterActions.removeAdminZoneRefToNotification(
          index,
          adminZoneIdToDelete
        )
      );
    }
  }

  handleAddAdminRefRole(value) {
    const { index, dispatch } = this.props;
    dispatch(
      OrganizationRegisterActions.addAdminZoneRefToNotification(index, value)
    );
  }

  render() {
    const { notification, visible, administrativeZones } = this.props;
    const administrativeZoneRefs =
      notification.eventFilter.administrativeZoneRefs || [];

    return (
      <div
        style={{
          display: visible ? 'none' : 'flex',
          flexDirection: 'column',
          flex: 2,
          border: '1px solid #eee',
          padding: 5
        }}
      >
        <div style={{ width: '100%', fontSize: 12, fontWeight: 600 }}>
          Administrative zones
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 2 }}>
            <select
              multiple="multiple"
              ref={this.adminRefsRef}
              style={{ width: '100%', fontSize: 12 }}
            >
              {administrativeZoneRefs.map((ref, index) => (
                <option key={'entity-' + index}>
                  {ref} - {administrativeZones.find(az => az.id === ref).name}{' '}
                </option>
              ))}
            </select>
            <NotificationAddZoneRef
              handleAdd={this.handleAddAdminRefRole.bind(this)}
              dataSource={administrativeZones}
              handleDelete={this.handleRemoveAdminRefRole.bind(this)}
            />
          </div>
          <IconButton
            onClick={this.handleRemoveAdminRefRole.bind(this)}
            size="large"
          >
            <Remove style={{ color: '#cc0000' }} />
          </IconButton>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  administrativeZones: state.OrganizationReducer.administrativeZones
});

export default connect(mapStateToProps)(NotificationAdminZoneRefs);
