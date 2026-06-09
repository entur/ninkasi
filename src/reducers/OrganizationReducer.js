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

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import getApiConfig from 'actions/getApiConfig';
import { addNotification } from './UtilsReducer';
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

const sortBy = (list, key) => list.slice().sort((a, b) => a[key].localeCompare(b[key]));

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

/* ------------------------------------------------------------------ */
/* Async data thunks                                                  */
/* ------------------------------------------------------------------ */

export const fetchRoles = createAsyncThunk(
  'organization/fetchRoles',
  /** @param {() => Promise<string | undefined>} getToken */
  async getToken => {
    const url = `${window.config.organisationsBaseUrl}roles`;
    const response = await axios.get(url, await getApiConfig(getToken));
    return sortBy(response.data, 'id');
  }
);

export const fetchOrganizations = createAsyncThunk(
  'organization/fetchOrganizations',
  /** @param {() => Promise<string | undefined>} getToken */
  async getToken => {
    const url = `${window.config.organisationsBaseUrl}`;
    const response = await axios.get(url, await getApiConfig(getToken));
    return sortBy(response.data, 'name');
  }
);

export const fetchCodeSpaces = createAsyncThunk(
  'organization/fetchCodeSpaces',
  /** @param {() => Promise<string | undefined>} getToken */
  async getToken => {
    const url = `${window.config.organisationsBaseUrl}code_spaces`;
    const response = await axios.get(url, await getApiConfig(getToken));
    return response.data;
  }
);

export const fetchUsers = createAsyncThunk(
  'organization/fetchUsers',
  /** @param {() => Promise<string | undefined>} getToken */
  async getToken => {
    const url = `${window.config.organisationsBaseUrl}users?full=true`;
    const response = await axios.get(url, await getApiConfig(getToken));
    return sortBy(response.data, 'username');
  }
);

export const fetchM2MClients = createAsyncThunk(
  'organization/fetchM2MClients',
  /** @param {() => Promise<string | undefined>} getToken */
  async (getToken, { rejectWithValue }) => {
    const url = `${window.config.organisationsBaseUrl}m2m_clients?full=true`;
    try {
      const response = await axios.get(url, await getApiConfig(getToken));
      return sortBy(response.data, 'name');
    } catch (error) {
      console.log('Error receiving M2M clients', error);
      return rejectWithValue({ message: error?.message ?? String(error) });
    }
  }
);

export const fetchResponsibilitySets = createAsyncThunk(
  'organization/fetchResponsibilitySets',
  /** @param {() => Promise<string | undefined>} getToken */
  async (getToken, { dispatch, rejectWithValue }) => {
    const url = `${window.config.organisationsBaseUrl}responsibility_sets`;
    try {
      const response = await axios.get(url, await getApiConfig(getToken));
      return sortBy(response.data, 'name');
    } catch (error) {
      dispatch(addNotification({ message: 'Error getting responsibility sets', level: 'error' }));
      console.log('Error getting responsibility sets: ' + error.message);
      return rejectWithValue(error?.message ?? String(error));
    }
  }
);

export const fetchEntityTypes = createAsyncThunk(
  'organization/fetchEntityTypes',
  /** @param {() => Promise<string | undefined>} getToken */
  async getToken => {
    const url = `${window.config.organisationsBaseUrl}entity_types`;
    const response = await axios.get(url, await getApiConfig(getToken));
    return sortBy(response.data, 'name');
  }
);

export const fetchEventFilterTypes = createAsyncThunk(
  'organization/fetchEventFilterTypes',
  /** @param {() => Promise<string | undefined>} getToken */
  async getToken => {
    const url = `${window.config.eventsBaseUrl}notifications/event_filter_types`;
    const response = await axios.get(url, await getApiConfig(getToken));
    return response.data;
  }
);

export const fetchEventFilterStates = createAsyncThunk(
  'organization/fetchEventFilterStates',
  /** @param {() => Promise<string | undefined>} getToken */
  async getToken => {
    const url = `${window.config.eventsBaseUrl}notifications/job_states`;
    const response = await axios.get(url, await getApiConfig(getToken));
    return response.data;
  }
);

export const fetchNotificationTypes = createAsyncThunk(
  'organization/fetchNotificationTypes',
  /** @param {() => Promise<string | undefined>} getToken */
  async getToken => {
    const url = `${window.config.eventsBaseUrl}notifications/notification_types`;
    const response = await axios.get(url, await getApiConfig(getToken));
    return response.data;
  }
);

export const fetchAdministrativeZones = createAsyncThunk(
  'organization/fetchAdministrativeZones',
  /** @param {() => Promise<string | undefined>} getToken */
  async getToken => {
    const url = `${window.config.organisationsBaseUrl}administrative_zones`;
    const response = await axios.get(url, await getApiConfig(getToken));
    return response.data;
  }
);

export const fetchJobActionsByDomain = createAsyncThunk(
  'organization/fetchJobActionsByDomain',
  /** @param {{ domain: string, getToken: () => Promise<string | undefined> }} arg */
  async ({ domain, getToken }) => {
    const url = `${window.config.eventsBaseUrl}notifications/job_actions/${domain}`;
    const response = await axios.get(url, await getApiConfig(getToken));
    return { data: response.data, domain };
  }
);

export const fetchJobDomains = createAsyncThunk(
  'organization/fetchJobDomains',
  /** @param {() => Promise<string | undefined>} getToken */
  async (getToken, { dispatch }) => {
    const url = `${window.config.eventsBaseUrl}notifications/job_domains`;
    const response = await axios.get(url, await getApiConfig(getToken));
    response.data.forEach(domain => {
      dispatch(fetchJobActionsByDomain({ domain, getToken }));
    });
    return response.data;
  }
);

/* ------------------------------------------------------------------ */
/* Slice                                                              */
/* ------------------------------------------------------------------ */

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    receivedRoles(state, action) {
      state.roles = action.payload;
    },
    createdRole(state) {
      setStatus(state, 'roleStatus', 'ROLE_CREATED');
    },
    failedCreatingRole(state, action) {
      setStatus(state, 'roleStatus', 'ROLE_CREATED_FAILED', action.payload);
    },
    receivedOrganizations(state, action) {
      state.organizations = action.payload;
    },
    createdOrganization(state) {
      setStatus(state, 'organizationStatus', 'ORGANIZATION_CREATED');
    },
    updatedOrganization(state) {
      setStatus(state, 'organizationStatus', 'ORGANIZATION_UPDATED');
    },
    failedCreatingOrganization(state, action) {
      setStatus(state, 'organizationStatus', 'ORGANIZATION_CREATED_FAILED', action.payload);
    },
    createdResponsibilitySet(state) {
      setStatus(state, 'responsibilitySetStatus', 'RESPONSIBILITY_SET_CREATED');
    },
    updatedResponsibilitySet(state) {
      setStatus(state, 'responsibilitySetStatus', 'RESPONSIBILITY_SET_UPDATED');
    },
    createdUser(state) {
      setStatus(state, 'userStatus', 'USER_CREATED');
    },
    updatedUser(state) {
      setStatus(state, 'userStatus', 'USER_UPDATED');
    },
    failedCreatingUser(state, action) {
      setStatus(state, 'userStatus', 'USER_CREATED_FAILED', action.payload);
    },
    createdEntityType(state) {
      setStatus(state, 'entityTypeStatus', 'ENTITY_TYPE_CREATED');
    },
    failedCreatingEntityType(state, action) {
      setStatus(state, 'entityTypeStatus', 'ENTITY_TYPE_CREATED_FAILED', action.payload);
    },
    updatedEntityType(state) {
      setStatus(state, 'entityTypeStatus', 'ENTITY_TYPE_UPDATED');
    },
    changedEventFilterType(state, action) {
      state.userNotifications = changeFilterValue(
        state.userNotifications,
        'type',
        action.payload.index,
        action.payload.value
      );
    },
    changedEventFilterJobDomain(state, action) {
      state.userNotifications = changeJobDomainValue(
        state.userNotifications,
        action.payload.index,
        action.payload.value
      );
    },
    changeEventFilterActionReducer(state, action) {
      state.userNotifications = changeFilterActions(
        state.userNotifications,
        action.payload.index,
        action.payload.action,
        action.payload.isChecked
      );
    },
    changedEventFilterOrgRef(state, action) {
      state.userNotifications = changeFilterValue(
        state.userNotifications,
        'organisationRef',
        action.payload.index,
        action.payload.organisationRef
      );
    },
    updatedNotificationConfiguration(state) {
      state.userNotifications.forEach(un => {
        delete un.isNew;
      });
    },
    changedNotificationType(state, action) {
      const un = state.userNotifications[action.payload.index];
      if (un) {
        un.notificationType = action.payload.type;
      }
    },
    changeEventFilterStateReducer(state, action) {
      state.userNotifications = changeFilterStates(
        state.userNotifications,
        action.payload.index,
        action.payload.state,
        action.payload.isChecked
      );
    },
    receivedCodespaces(state, action) {
      state.codeSpaces = action.payload;
    },
    receivedUsers(state, action) {
      state.users = action.payload;
    },
    receivedM2MClients(state, action) {
      state.m2mClients = action.payload;
    },
    createdM2MClient(state) {
      state.m2mClientStatus = { error: null };
    },
    updatedM2MClient(state) {
      state.m2mClientStatus = { error: null };
    },
    failedM2MClientOperation(state, action) {
      state.m2mClientStatus = { error: action.payload };
    },
    errorM2MClients(state, action) {
      state.m2mClientStatus = { error: action.payload };
    },
    receivedResponsibilities(state, action) {
      state.responsibilities = action.payload;
    },
    receivedEntityTypes(state, action) {
      state.entityTypes = action.payload;
    },
    receivedUserNotifications(state, action) {
      state.userNotifications = action.payload;
      state.userNotificationsLoading = false;
    },
    receivedEventFilterTypes(state, action) {
      state.eventFilterTypes = action.payload;
    },
    receivedJobDomains(state, action) {
      state.jobDomains = action.payload;
    },
    receivedJobActionsForDomain(state, action) {
      state.jobDomainActions[action.payload.domain] = action.payload.data;
    },
    receivedEventFilterStates(state, action) {
      state.eventFilterStates = action.payload;
    },
    receivedNotificationTypes(state, action) {
      state.notificationTypes = action.payload;
    },
    receivedAdministrativeZones(state, action) {
      state.administrativeZones = action.payload;
    },
    addedAdminZoneRef(state, action) {
      state.userNotifications = addAdminRef(
        state.userNotifications,
        action.payload.index,
        action.payload.id
      );
    },
    removedAdminZoneRef(state, action) {
      state.userNotifications = removeAdminRef(
        state.userNotifications,
        action.payload.index,
        action.payload.id
      );
    },
    addedEntityClassRef(state, action) {
      state.userNotifications = addEntityClassRef(
        state.userNotifications,
        action.payload.index,
        action.payload.entityClassRef
      );
    },
    removedEntityClassRef(state, action) {
      state.userNotifications = removeEntityClassRef(
        state.userNotifications,
        action.payload.index,
        action.payload.entityClassRef
      );
    },
    deletedUserNotification(state, action) {
      state.userNotifications.splice(action.payload, 1);
    },
    requestedUserNotification(state) {
      state.userNotificationsLoading = true;
    },
    addedNewUserNotification(state) {
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
    },
    enabledUserNotification(state, action) {
      const un = state.userNotifications[action.payload.index];
      if (un) {
        un.enabled = action.payload.enabled;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.organizations = action.payload;
      })
      .addCase(fetchCodeSpaces.fulfilled, (state, action) => {
        state.codeSpaces = action.payload;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchM2MClients.fulfilled, (state, action) => {
        state.m2mClients = action.payload;
      })
      .addCase(fetchM2MClients.rejected, (state, action) => {
        state.m2mClientStatus = { error: action.payload ?? action.error };
      })
      .addCase(fetchResponsibilitySets.fulfilled, (state, action) => {
        state.responsibilities = action.payload;
      })
      .addCase(fetchEntityTypes.fulfilled, (state, action) => {
        state.entityTypes = action.payload;
      })
      .addCase(fetchEventFilterTypes.fulfilled, (state, action) => {
        state.eventFilterTypes = action.payload;
      })
      .addCase(fetchEventFilterStates.fulfilled, (state, action) => {
        state.eventFilterStates = action.payload;
      })
      .addCase(fetchNotificationTypes.fulfilled, (state, action) => {
        state.notificationTypes = action.payload;
      })
      .addCase(fetchAdministrativeZones.fulfilled, (state, action) => {
        state.administrativeZones = action.payload;
      })
      .addCase(fetchJobDomains.fulfilled, (state, action) => {
        state.jobDomains = action.payload;
      })
      .addCase(fetchJobActionsByDomain.fulfilled, (state, action) => {
        state.jobDomainActions[action.payload.domain] = action.payload.data;
      });
  },
});

export const {
  receivedRoles,
  createdRole,
  failedCreatingRole,
  receivedOrganizations,
  createdOrganization,
  updatedOrganization,
  failedCreatingOrganization,
  createdResponsibilitySet,
  updatedResponsibilitySet,
  createdUser,
  updatedUser,
  failedCreatingUser,
  createdEntityType,
  failedCreatingEntityType,
  updatedEntityType,
  changedEventFilterType,
  changedEventFilterJobDomain,
  changeEventFilterActionReducer,
  changedEventFilterOrgRef,
  updatedNotificationConfiguration,
  changedNotificationType,
  changeEventFilterStateReducer,
  receivedCodespaces,
  receivedUsers,
  receivedM2MClients,
  createdM2MClient,
  updatedM2MClient,
  failedM2MClientOperation,
  errorM2MClients,
  receivedResponsibilities,
  receivedEntityTypes,
  receivedUserNotifications,
  receivedEventFilterTypes,
  receivedJobDomains,
  receivedJobActionsForDomain,
  receivedEventFilterStates,
  receivedNotificationTypes,
  receivedAdministrativeZones,
  addedAdminZoneRef,
  removedAdminZoneRef,
  addedEntityClassRef,
  removedEntityClassRef,
  deletedUserNotification,
  requestedUserNotification,
  addedNewUserNotification,
  enabledUserNotification,
} = organizationSlice.actions;

export default organizationSlice.reducer;
