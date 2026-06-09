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

import {
  Checkbox,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  changedEventFilterType,
  changedEventFilterJobDomain,
  changedEventFilterOrgRef,
  changedNotificationType,
  enabledUserNotification,
  deletedUserNotification,
} from 'reducers/OrganizationReducer';
import EventFilterStatesPopover from './EventFilterStatesPopover';
import EventFilterActionsPopover from './EventFilterActionsPopover';
import OrganisationSelect from './OrganisationSelect';
import NotificationTypeSelect from './NotificationTypeSelect';
import NotificationAdminZoneRefs from './NotificationAdminZoneRefs';
import NotificationEntityClassRefs from './NotificationEntityClassRefs';

interface EventFilter {
  type?: string;
  jobDomain?: string;
  actions?: string[];
  states?: string[];
  organisationRef?: string;
  administrativeZoneRefs?: string[];
  entityClassificationRefs?: string[];
}

interface Notification {
  enabled: boolean;
  notificationType: string;
  eventFilter: EventFilter;
}

interface NotificationEventFilterProps {
  notification: Notification;
  index: number;
}

const NotificationEventFilter = ({ notification, index }: NotificationEventFilterProps) => {
  const dispatch = useAppDispatch();
  const eventFilterTypes = useAppSelector((s: any) => s.OrganizationReducer.eventFilterTypes);
  const jobDomains = useAppSelector((s: any) => s.OrganizationReducer.jobDomains);
  const jobDomainActions = useAppSelector((s: any) => s.OrganizationReducer.jobDomainActions);
  const eventFilterStates = useAppSelector((s: any) => s.OrganizationReducer.eventFilterStates);
  const organizations = useAppSelector((s: any) => s.OrganizationReducer.organizations);
  const notificationTypes = useAppSelector((s: any) => s.OrganizationReducer.notificationTypes);

  const handleEnabled = (value: boolean) => {
    dispatch(enabledUserNotification({ index, enabled: value }));
  };

  const handleChangeEventFilterType = (value: string) => {
    dispatch(changedEventFilterType({ index, value }));
  };

  const handleChangeJobDomain = (value: string) => {
    dispatch(changedEventFilterJobDomain({ index, value }));
  };

  const handleChangeOrganization = (organisationRef: string) => {
    dispatch(changedEventFilterOrgRef({ index, organisationRef }));
  };

  const handleChangeNotificationType = (type: string) => {
    dispatch(changedNotificationType({ index, type }));
  };

  const deleteUserNotificationHandler = () => {
    dispatch(deletedUserNotification(index));
  };

  const getErrorMessage = () => {
    if (notification.eventFilter.type === 'JOB') {
      const missingFields: string[] = [];

      if (notification.eventFilter.actions && notification.eventFilter.actions.length === 0) {
        missingFields.push('actions');
      }

      if (notification.eventFilter.states && notification.eventFilter.states.length === 0) {
        missingFields.push('states');
      }

      if (missingFields.length) {
        const fieldIsOrAre = missingFields.length === 1 ? 'field is ' : 'fields are ';
        return `Required* ${fieldIsOrAre} missing for ${missingFields.join(' and ')}`;
      }
    }
    return '';
  };

  const enableJobSpecific =
    !!notification.eventFilter.type && notification.eventFilter.type === 'JOB';

  return (
    <div style={{ display: 'block', padding: 10 }}>
      <div style={{ display: 'flex', marginTop: 10 }}>
        <NotificationTypeSelect
          notification={notification}
          notificationTypes={notificationTypes}
          handleChangeNotificationType={handleChangeNotificationType}
        />
        <OrganisationSelect
          organizations={organizations}
          notification={notification}
          handleChangeOrganization={handleChangeOrganization}
        />
      </div>
      <div style={{ display: 'flex', marginTop: 10 }}>
        <FormControl style={{ flex: 1 }} margin="normal">
          <InputLabel id="event-filter-type-label">Event filter type</InputLabel>
          <Select
            labelId="event-filter-type-label"
            label="Event filter type"
            onChange={e => handleChangeEventFilterType(e.target.value as string)}
            value={notification.eventFilter.type ?? ''}
          >
            {eventFilterTypes.map((eft: string, i: number) => (
              <MenuItem key={'filter-' + i} value={eft}>
                {eft}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ marginLeft: 16, flex: 1 }} margin="normal">
          <InputLabel id="job-domain-label">Job domain</InputLabel>
          <Select
            labelId="job-domain-label"
            label="Job domain"
            onChange={e => handleChangeJobDomain(e.target.value as string)}
            disabled={!enableJobSpecific}
            value={notification.eventFilter.jobDomain ?? ''}
          >
            {jobDomains.map((domain: string, i: number) => (
              <MenuItem key={'domain-' + i} value={domain}>
                {domain}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 16 }}>
        <div
          style={{
            display: enableJobSpecific ? 'none' : 'flex',
            flexDirection: 'column',
            flex: 2,
            gap: '16px',
          }}
        >
          <NotificationAdminZoneRefs
            index={index}
            notification={notification}
            visible={enableJobSpecific}
          />
          <NotificationEntityClassRefs
            index={index}
            notification={notification}
            visible={enableJobSpecific}
          />
        </div>
        <div
          style={{
            display: enableJobSpecific ? 'flex' : 'none',
            marginTop: 10,
            alignItems: 'center',
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
          <div style={{ color: 'red', fontSize: '0.8em', marginLeft: 10 }}>{getErrorMessage()}</div>
        </div>
      </div>
      <div style={{ display: 'flex', marginTop: 16, alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={notification.enabled}
              onChange={e => handleEnabled(e.target.checked)}
            />
          }
          label="Enabled"
          style={{ width: 'auto' }}
        />
        <IconButton onClick={deleteUserNotificationHandler} size="large">
          <Delete />
        </IconButton>
        <span>Delete</span>
      </div>
    </div>
  );
};

export default NotificationEventFilter;
