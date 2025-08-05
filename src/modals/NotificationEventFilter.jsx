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
import Checkbox from 'material-ui/Checkbox';
import { connect } from 'react-redux';
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';
import { FormControl, Select, MenuItem } from '@mui/material';
import EventFilterStatesPopover from './EventFilterStatesPopover';
import EventFilterActionsPopover from './EventFilterActionsPopover';
import OrganisationSelect from './OrganisationSelect';
import NotificationTypeSelect from './NotificationTypeSelect';
import NotificationAdminZoneRefs from './NotificationAdminZoneRefs';
import NotificationEntityClassRef from './NotificationEntityClassRefs';
import IconButton from 'material-ui/IconButton';
import MdDelete from 'material-ui/svg-icons/action/delete';

class NotificationEventFilter extends React.Component {
  handleEnabled(value) {
    const { index, dispatch } = this.props;
    dispatch(OrganizationRegisterActions.setEnabledNotification(index, value));
  }

  handleChangeEventFilterType(event, key, value) {
    const { index, dispatch } = this.props;
    dispatch(OrganizationRegisterActions.changeEventFilterType(index, value));
  }

  handleChangeJobDomain(event, key, value) {
    const { index, dispatch } = this.props;
    dispatch(
      OrganizationRegisterActions.changeEventFilterJobDomain(index, value)
    );
  }

  handleChangeOrganization(organization) {
    const { index, dispatch } = this.props;
    dispatch(
      OrganizationRegisterActions.changeEventFilterOrganizationRef(
        index,
        organization
      )
    );
  }

  handleChangeNotificationType(type) {
    const { index, dispatch } = this.props;
    dispatch(OrganizationRegisterActions.changeNotificationType(index, type));
  }

  deleteUserNotification() {
    const { index, dispatch } = this.props;
    dispatch(OrganizationRegisterActions.deleteUserNotification(index));
  }

  getErrorMessage() {
    const { notification } = this.props;
    if (notification.eventFilter.type === 'JOB') {
      let missingFields = [];

      if (
        notification.eventFilter.actions &&
        notification.eventFilter.actions.length === 0
      ) {
        missingFields.push('actions');
      }

      if (
        notification.eventFilter.states &&
        notification.eventFilter.states.length === 0
      ) {
        missingFields.push('states');
      }

      if (missingFields.length) {
        let fieldIsOrAre =
          missingFields.length === 1 ? 'field is ' : 'fields are ';
        return `Required* ${fieldIsOrAre} missing for ${missingFields.join(
          ' and '
        )}`;
      }
    }
    return '';
  }

  render() {
    const {
      notification,
      eventFilterTypes,
      eventFilterStates,
      jobDomains,
      jobDomainActions,
      index,
      organizations,
      notificationTypes
    } = this.props;
    const enableJobSpecific =
      notification.eventFilter.type && notification.eventFilter.type === 'JOB';

    return (
      <div style={{ display: 'block', padding: 10 }}>
        <div style={{ display: 'flex', marginTop: -10 }}>
          <NotificationTypeSelect
            notification={notification}
            notificationTypes={notificationTypes}
            handleChangeNotificationType={this.handleChangeNotificationType.bind(
              this
            )}
          />
          <OrganisationSelect
            organizations={organizations}
            notification={notification}
            handleChangeOrganization={this.handleChangeOrganization.bind(this)}
          />
        </div>
        <div style={{ display: 'flex', marginTop: -10 }}>
          <FormControl style={{ flex: 1 }}>
            <Select
              onChange={e =>
                this.handleChangeEventFilterType(e, null, e.target.value)
              }
              value={notification.eventFilter.type}
              displayEmpty
            >
              {eventFilterTypes.map((eft, i) => (
                <MenuItem key={'filter-' + i} value={eft}>
                  {eft}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl style={{ marginLeft: 10, flex: 1 }}>
            <Select
              onChange={e =>
                this.handleChangeJobDomain(e, null, e.target.value)
              }
              disabled={!enableJobSpecific}
              value={notification.eventFilter.jobDomain}
              displayEmpty
            >
              {jobDomains.map((domain, i) => (
                <MenuItem key={'domain-' + i} value={domain}>
                  {domain}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              display: enableJobSpecific ? 'none' : 'flex',
              flexDirection: 'column',
              flex: 2
            }}
          >
            <NotificationAdminZoneRefs
              index={index}
              notification={notification}
              visible={enableJobSpecific}
            />
            <NotificationEntityClassRef
              index={index}
              notification={notification}
              visible={enableJobSpecific}
            />
          </div>
          <div
            style={{
              display: enableJobSpecific ? 'flex' : 'none',
              marginTop: 10,
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex' }}>
              <EventFilterActionsPopover
                index={index}
                eventFilter={notification.eventFilter}
                enabled={enableJobSpecific}
                allActions={jobDomainActions}
              />
              <EventFilterStatesPopover
                enabled={enableJobSpecific}
                allStates={eventFilterStates}
                eventFilter={notification.eventFilter}
                index={index}
              />
            </div>
            <div style={{ color: 'red', fontSize: '0.8em', marginLeft: 10 }}>
              {this.getErrorMessage()}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: 10, alignItems: 'center' }}>
          <Checkbox
            label="Enabled"
            style={{ width: 'auto' }}
            checked={notification.enabled}
            onCheck={(e, v) => this.handleEnabled(v)}
          />
          <IconButton
            onClick={this.deleteUserNotification.bind(this)}
            size="large"
          >
            <MdDelete />
          </IconButton>
          <span>Delete</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  eventFilterTypes: state.OrganizationReducer.eventFilterTypes,
  jobDomains: state.OrganizationReducer.jobDomains,
  jobDomainActions: state.OrganizationReducer.jobDomainActions,
  eventFilterStates: state.OrganizationReducer.eventFilterStates,
  organizations: state.OrganizationReducer.organizations,
  notificationTypes: state.OrganizationReducer.notificationTypes
});

export default connect(mapStateToProps)(NotificationEventFilter);
