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
  passwordDialog: {
    open: false,
    password: null,
    userId: null,
    error: false,
    isNewUser: false,
  },
};

const removeByIndex = (list, index) => [...list.slice(0, index), ...list.slice(index + 1)];

const OrganizationReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.RECEIVED_ROLES:
      return Object.assign({}, state, { roles: action.payLoad });

    case types.CREATED_ROLE:
      return Object.assign({}, state, {
        roleStatus: {
          error: null,
          code: 'ROLE_CREATED',
        },
      });

    case types.OPENED_NEW_PASSWORD_DIALOG:
      return Object.assign({}, state, {
        passwordDialog: {
          open: true,
          userId: action.payLoad.userId,
          username: action.payLoad.username,
          isNewUser: action.payLoad.isNewUser,
          error: action.payLoad.error,
        },
      });

    case types.CLOSED_NEW_PASSWORD_DIALOG:
      return Object.assign({}, state, {
        passwordDialog: {
          open: false,
          password: null,
          userId: null,
          error: false,
          username: null,
          isNewUser: false,
        },
      });

    case types.FAILED_CREATING_ROLE:
      return Object.assign({}, state, {
        roleStatus: {
          error: action.payLoad,
          code: 'ROLE_CREATED_FAILED',
        },
      });

    case types.RECEIVED_ORGANIZATIONS:
      return Object.assign({}, state, { organizations: action.payLoad });

    case types.CREATED_ORGANIZATION:
      return Object.assign({}, state, {
        organizationStatus: {
          error: null,
          code: 'ORGANIZATION_CREATED',
        },
      });

    case types.UPDATED_ORGANIZATION:
      return Object.assign({}, state, {
        organizationStatus: {
          error: null,
          code: 'ORGANIZATION_UPDATED',
        },
      });

    case types.FAILED_CREATING_ORGANIZATION:
      return Object.assign({}, state, {
        organizationStatus: {
          error: action.payLoad,
          code: 'ORGANIZATION_CREATED_FAILED',
        },
      });

    case types.CREATED_RESPONSIBILITY_SET:
      return Object.assign({}, state, {
        responsibilitySetStatus: {
          error: null,
          code: 'RESPONSIBILITY_SET_CREATED',
        },
      });

    case types.CREATED_USER:
      return Object.assign({}, state, {
        userStatus: {
          error: null,
          code: 'USER_CREATED',
        },
      });

    case types.UPDATED_USER:
      return Object.assign({}, state, {
        userStatus: {
          error: null,
          code: 'USER_UPDATED',
        },
      });

    case types.CREATED_ENTITY_TYPE:
      return Object.assign({}, state, {
        entityTypeStatus: {
          error: null,
          code: 'ENTITY_TYPE_CREATED',
        },
      });

    case types.FAILED_CREATING_ENTITY_TYPE:
      return Object.assign({}, state, {
        entityTypeStatus: {
          error: action.payLoad,
          code: 'ENTITY_TYPE_CREATED_FAILED',
        },
      });

    case types.UPDATED_RESPONSIBILITY_SET:
      return Object.assign({}, state, {
        responsibilitySetStatus: {
          error: null,
          code: 'RESPONSIBILITY_SET_UPDATED',
        },
      });

    case types.UPDATED_ENTITY_TYPE:
      return Object.assign({}, state, {
        entityTypeStatus: {
          error: null,
          code: 'ENTITY_TYPE_UPDATED',
        },
      });

    case types.CHANGED_EVENT_FILTER_TYPE:
      return Object.assign({}, state, {
        userNotifications: changeFilterValue(
          state.userNotifications,
          'type',
          action.payLoad.index,
          action.payLoad.value
        ),
      });

    case types.CHANGED_EVENT_FILTER_JOB_DOMAIN:
      return Object.assign({}, state, {
        userNotifications: changeJobDomainValue(
          state.userNotifications,
          action.payLoad.index,
          action.payLoad.value
        ),
      });

    case types.CHANGE_EVENT_FILTER_ACTION:
      return Object.assign({}, state, {
        userNotifications: changeFilterActions(
          state.userNotifications,
          action.payLoad.index,
          action.payLoad.action,
          action.payLoad.isChecked
        ),
      });

    case types.CHANGED_EVENT_FILTER_ORG_REF:
      return Object.assign({}, state, {
        userNotifications: changeFilterValue(
          state.userNotifications,
          'organisationRef',
          action.payLoad.index,
          action.payLoad.organisationRef
        ),
      });

    case types.UPDATED_NOTIFICATION_CONFIGURATION:
      return Object.assign({}, state, {
        userNotifications: state.userNotifications.map(un => {
          delete un.isNew;
          return un;
        }),
      });

    case types.CHANGED_NOTIFICATION_TYPE:
      return Object.assign({}, state, {
        userNotifications: state.userNotifications.map((un, i) => {
          if (i === action.payLoad.index) {
            return {
              ...un,
              notificationType: action.payLoad.type,
            };
          }
          return un;
        }),
      });

    case types.CHANGE_EVENT_FILTER_STATE:
      return Object.assign({}, state, {
        userNotifications: changeFilterStates(
          state.userNotifications,
          action.payLoad.index,
          action.payLoad.state,
          action.payLoad.isChecked
        ),
      });

    case types.RECEIVED_ADMINISTRATIVE_ZONES:
      return Object.assign({}, state, {
        administrativeZones: action.payLoad,
      });

    case types.RECEIVED_CODESPACES:
      return Object.assign({}, state, { codeSpaces: action.payLoad });

    case types.RECEIVED_USERS:
      return Object.assign({}, state, { users: action.payLoad });

    case types.RECEIVED_M2M_CLIENTS:
      return Object.assign({}, state, { m2mClients: action.payLoad });

    case types.RECEIVED_RESPONSIBILITES:
      return Object.assign({}, state, { responsibilities: action.payLoad });

    case types.RECEIVED_ENTITY_TYPES:
      return Object.assign({}, state, { entityTypes: action.payLoad });

    case types.RECEIVED_USER_NOTIFICATIONS:
      return Object.assign({}, state, {
        userNotifications: action.payLoad,
        userNotificationsLoading: false,
      });

    case types.RECEIVED_EVENT_FILTER_TYPES:
      return Object.assign({}, state, {
        eventFilterTypes: action.payLoad,
      });

    case types.RECEIVED_JOB_DOMAINS:
      return Object.assign({}, state, {
        jobDomains: action.payLoad,
      });

    case types.RECEIVED_JOB_ACTIONS_FOR_DOMAIN:
      return Object.assign({}, state, {
        jobDomainActions: {
          ...state.jobDomainActions,
          [action.payLoad.domain]: action.payLoad.data,
        },
      });

    case types.RECEIVED_EVENT_FILTER_STATES:
      return Object.assign({}, state, {
        eventFilterStates: action.payLoad,
      });

    case types.RECEIVED_NOTIFICATION_TYPES:
      return Object.assign({}, state, {
        notificationTypes: action.payLoad,
      });

    case types.ADDED_ADMIN_ZONE_REF:
      return Object.assign({}, state, {
        userNotifications: addAdminRef(
          state.userNotifications,
          action.payLoad.index,
          action.payLoad.id
        ),
      });

    case types.REMOVED_ADMIN_ZONE_REF:
      return Object.assign({}, state, {
        userNotifications: removeAdminRef(
          state.userNotifications,
          action.payLoad.index,
          action.payLoad.id
        ),
      });

    case types.ADDED_ENTITY_CLASS_REF:
      return Object.assign({}, state, {
        userNotifications: addEntityClassRef(
          state.userNotifications,
          action.payLoad.index,
          action.payLoad.entityClassRef
        ),
      });

    case types.REMOVED_ENTITY_CLASS_REF:
      return Object.assign({}, state, {
        userNotifications: removeEntityClassRef(
          state.userNotifications,
          action.payLoad.index,
          action.payLoad.entityClassRef
        ),
      });

    case types.DELETED_USER_NOTIFICATION:
      return Object.assign({}, state, {
        userNotifications: removeByIndex(state.userNotifications, action.payLoad),
      });

    case types.REQUESTED_USER_NOTIFICATION:
      return Object.assign({}, state, {
        userNotificationsLoading: true,
      });

    case types.ADDED_NEW_USER_NOTIFICATION:
      return Object.assign({}, state, {
        userNotifications: state.userNotifications.concat({
          enabled: false,
          isNew: true,
          notificationType: 'EMAIL',
          eventFilter: {
            type: 'JOB',
            jobDomain: 'TIMETABLE',
            actions: [],
            states: [],
          },
        }),
      });

    case types.ENABLED_USER_NOTIFICATION:
      return Object.assign({}, state, {
        userNotifications: state.userNotifications.map((un, i) => {
          if (i === action.payLoad.index) {
            return {
              ...un,
              enabled: action.payLoad.enabled,
            };
          }
          return un;
        }),
      });

    default:
      return state;
  }
};

export default OrganizationReducer;
