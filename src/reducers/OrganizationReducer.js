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

import { createSlice } from '@reduxjs/toolkit';
import * as types from 'actions/actionTypes';
import {
  changeFilterValue,
  changeJobDomainValue,
  changeFilterActions,
  changeFilterStates,
  addAdminRef,
  removeAdminRef,
  addEntityClassRef,
  removeEntityClassRef,
} from './OrganizationReducerUtils';

const initialState = {
  roles: [],
  organizations: [],
  codeSpaces: [],
  users: [],
  m2mClients: [],
  responsibilities: [],
  entityTypes: [],
  userNotifications: [],
  eventFilterTypes: [],
  eventFilterStates: [],
  jobDomains: [],
  jobDomainActions: {},
  administrativeZones: [],
  notificationTypes: [],
  userNotificationsLoading: false,
  m2mClientStatus: { error: null },
};

const setStatus = (state, key, code, error = null) => {
  state[key] = { error, code };
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(types.RECEIVED_ROLES, (state, action) => {
        state.roles = action.payLoad;
      })
      .addCase(types.CREATED_ROLE, state => setStatus(state, 'roleStatus', 'ROLE_CREATED'))
      .addCase(types.FAILED_CREATING_ROLE, (state, action) =>
        setStatus(state, 'roleStatus', 'ROLE_CREATED_FAILED', action.payLoad)
      )
      .addCase(types.RECEIVED_ORGANIZATIONS, (state, action) => {
        state.organizations = action.payLoad;
      })
      .addCase(types.CREATED_ORGANIZATION, state =>
        setStatus(state, 'organizationStatus', 'ORGANIZATION_CREATED')
      )
      .addCase(types.UPDATED_ORGANIZATION, state =>
        setStatus(state, 'organizationStatus', 'ORGANIZATION_UPDATED')
      )
      .addCase(types.FAILED_CREATING_ORGANIZATION, (state, action) =>
        setStatus(state, 'organizationStatus', 'ORGANIZATION_CREATED_FAILED', action.payLoad)
      )
      .addCase(types.CREATED_RESPONSIBILITY_SET, state =>
        setStatus(state, 'responsibilitySetStatus', 'RESPONSIBILITY_SET_CREATED')
      )
      .addCase(types.UPDATED_RESPONSIBILITY_SET, state =>
        setStatus(state, 'responsibilitySetStatus', 'RESPONSIBILITY_SET_UPDATED')
      )
      .addCase(types.CREATED_USER, state => setStatus(state, 'userStatus', 'USER_CREATED'))
      .addCase(types.UPDATED_USER, state => setStatus(state, 'userStatus', 'USER_UPDATED'))
      .addCase(types.CREATED_ENTITY_TYPE, state =>
        setStatus(state, 'entityTypeStatus', 'ENTITY_TYPE_CREATED')
      )
      .addCase(types.FAILED_CREATING_ENTITY_TYPE, (state, action) =>
        setStatus(state, 'entityTypeStatus', 'ENTITY_TYPE_CREATED_FAILED', action.payLoad)
      )
      .addCase(types.UPDATED_ENTITY_TYPE, state =>
        setStatus(state, 'entityTypeStatus', 'ENTITY_TYPE_UPDATED')
      )
      .addCase(types.CHANGED_EVENT_FILTER_TYPE, (state, action) => {
        state.userNotifications = changeFilterValue(
          state.userNotifications,
          'type',
          action.payLoad.index,
          action.payLoad.value
        );
      })
      .addCase(types.CHANGED_EVENT_FILTER_JOB_DOMAIN, (state, action) => {
        state.userNotifications = changeJobDomainValue(
          state.userNotifications,
          action.payLoad.index,
          action.payLoad.value
        );
      })
      .addCase(types.CHANGE_EVENT_FILTER_ACTION, (state, action) => {
        state.userNotifications = changeFilterActions(
          state.userNotifications,
          action.payLoad.index,
          action.payLoad.action,
          action.payLoad.isChecked
        );
      })
      .addCase(types.CHANGED_EVENT_FILTER_ORG_REF, (state, action) => {
        state.userNotifications = changeFilterValue(
          state.userNotifications,
          'organisationRef',
          action.payLoad.index,
          action.payLoad.organisationRef
        );
      })
      .addCase(types.UPDATED_NOTIFICATION_CONFIGURATION, state => {
        state.userNotifications.forEach(un => {
          delete un.isNew;
        });
      })
      .addCase(types.CHANGED_NOTIFICATION_TYPE, (state, action) => {
        const un = state.userNotifications[action.payLoad.index];
        if (un) {
          un.notificationType = action.payLoad.type;
        }
      })
      .addCase(types.CHANGE_EVENT_FILTER_STATE, (state, action) => {
        state.userNotifications = changeFilterStates(
          state.userNotifications,
          action.payLoad.index,
          action.payLoad.state,
          action.payLoad.isChecked
        );
      })
      .addCase(types.RECEIVED_ADMINISTRATIVE_ZONES, (state, action) => {
        state.administrativeZones = action.payLoad;
      })
      .addCase(types.RECEIVED_CODESPACES, (state, action) => {
        state.codeSpaces = action.payLoad;
      })
      .addCase(types.RECEIVED_USERS, (state, action) => {
        state.users = action.payLoad;
      })
      .addCase(types.RECEIVED_M2M_CLIENTS, (state, action) => {
        state.m2mClients = action.payLoad;
      })
      .addCase(types.CREATED_M2M_CLIENT, state => {
        state.m2mClientStatus = { error: null };
      })
      .addCase(types.UPDATED_M2M_CLIENT, state => {
        state.m2mClientStatus = { error: null };
      })
      .addCase(types.FAILED_M2M_CLIENT_OPERATION, (state, action) => {
        state.m2mClientStatus = { error: action.payLoad };
      })
      .addCase(types.RECEIVED_RESPONSIBILITES, (state, action) => {
        state.responsibilities = action.payLoad;
      })
      .addCase(types.RECEIVED_ENTITY_TYPES, (state, action) => {
        state.entityTypes = action.payLoad;
      })
      .addCase(types.RECEIVED_USER_NOTIFICATIONS, (state, action) => {
        state.userNotifications = action.payLoad;
        state.userNotificationsLoading = false;
      })
      .addCase(types.RECEIVED_EVENT_FILTER_TYPES, (state, action) => {
        state.eventFilterTypes = action.payLoad;
      })
      .addCase(types.RECEIVED_JOB_DOMAINS, (state, action) => {
        state.jobDomains = action.payLoad;
      })
      .addCase(types.RECEIVED_JOB_ACTIONS_FOR_DOMAIN, (state, action) => {
        state.jobDomainActions[action.payLoad.domain] = action.payLoad.data;
      })
      .addCase(types.RECEIVED_EVENT_FILTER_STATES, (state, action) => {
        state.eventFilterStates = action.payLoad;
      })
      .addCase(types.RECEIVED_NOTIFICATION_TYPES, (state, action) => {
        state.notificationTypes = action.payLoad;
      })
      .addCase(types.ADDED_ADMIN_ZONE_REF, (state, action) => {
        state.userNotifications = addAdminRef(
          state.userNotifications,
          action.payLoad.index,
          action.payLoad.id
        );
      })
      .addCase(types.REMOVED_ADMIN_ZONE_REF, (state, action) => {
        state.userNotifications = removeAdminRef(
          state.userNotifications,
          action.payLoad.index,
          action.payLoad.id
        );
      })
      .addCase(types.ADDED_ENTITY_CLASS_REF, (state, action) => {
        state.userNotifications = addEntityClassRef(
          state.userNotifications,
          action.payLoad.index,
          action.payLoad.entityClassRef
        );
      })
      .addCase(types.REMOVED_ENTITY_CLASS_REF, (state, action) => {
        state.userNotifications = removeEntityClassRef(
          state.userNotifications,
          action.payLoad.index,
          action.payLoad.entityClassRef
        );
      })
      .addCase(types.DELETED_USER_NOTIFICATION, (state, action) => {
        state.userNotifications.splice(action.payLoad, 1);
      })
      .addCase(types.REQUESTED_USER_NOTIFICATION, state => {
        state.userNotificationsLoading = true;
      })
      .addCase(types.ADDED_NEW_USER_NOTIFICATION, state => {
        state.userNotifications.push({
          enabled: false,
          isNew: true,
          notificationType: 'EMAIL',
          eventFilter: {
            type: 'JOB',
            jobDomain: 'TIMETABLE',
            actions: [],
            states: [],
          },
        });
      })
      .addCase(types.ENABLED_USER_NOTIFICATION, (state, action) => {
        const un = state.userNotifications[action.payLoad.index];
        if (un) {
          un.enabled = action.payLoad.enabled;
        }
      });
  },
});

export default organizationSlice.reducer;
