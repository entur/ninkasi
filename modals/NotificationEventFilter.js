import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import { connect } from 'react-redux';
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import EventFilterStatesPopover from './EventFilterStatesPopover';
import EventFilterActionsPopover from './EventFilterActionsPopover';
import OrganisationSelect from './OrganisationSelect';
import NotificationTypeSelect from './NotificationTypeSelect';
import NotificationAdminZoneRefs from './NotificationAdminZoneRefs'
import NotificationEntityClassRef from './NotificationEntityClassRefs'

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
      OrganizationRegisterActions.changeEventFilterOrganizationRef(index, organization)
    );
  }

  handleChangeNotificationType(type) {
    const { index, dispatch } = this.props;
    dispatch(
      OrganizationRegisterActions.changeNotificationType(index, type)
    );
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
        <div style={{display: 'flex', marginTop: -20}}>
          <NotificationTypeSelect
            notification={notification}
            notificationTypes={notificationTypes}
            handleChangeNotificationType={this.handleChangeNotificationType.bind(this)}
          />
          <OrganisationSelect
            organizations={organizations}
            notification={notification}
            handleChangeOrganization={this.handleChangeOrganization.bind(this)}
          />
        </div>
        <div style={{display: 'flex', marginTop: -20}}>
          <SelectField
            floatingLabelText="Type"
            onChange={this.handleChangeEventFilterType.bind(this)}
            value={notification.eventFilter.type}
          >
            {eventFilterTypes.map((eft, i) =>
              <MenuItem key={'filter-' + i} value={eft} primaryText={eft} />
            )}
          </SelectField>
          <SelectField
            floatingLabelText="JobDomain"
            onChange={this.handleChangeJobDomain.bind(this)}
            disabled={!enableJobSpecific}
            value={notification.eventFilter.jobDomain}
          >
            {jobDomains.map((domain, i) =>
              <MenuItem key={'domain-' + i} value={domain} primaryText={domain} />
            )}
          </SelectField>
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
          <div style={{ display: enableJobSpecific ? 'flex' : 'none'}}>
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
        </div>
        <Checkbox
          labelStyle={{ fontSize: 12, marginTop: 4, fontWeight: 600 }}
          label="Enabled"
          checked={notification.enabled}
          onCheck={(e, v) => this.handleEnabled(v)}
        />
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
