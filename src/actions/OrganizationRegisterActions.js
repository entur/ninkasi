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

import axios from 'axios';
import getApiConfig from './getApiConfig';
import { formatUserNotifications } from './OrganizationUtils';
import { addNotification } from 'reducers/UtilsReducer';
import {
  // slice sync action creators
  addedEntityClassRef,
  addedAdminZoneRef,
  removedAdminZoneRef,
  removedEntityClassRef,
  deletedUserNotification,
  addedNewUserNotification,
  enabledUserNotification,
  changedEventFilterType,
  changedEventFilterJobDomain,
  changedEventFilterOrgRef,
  changeEventFilterActionReducer,
  changeEventFilterStateReducer,
  changedNotificationType,
  requestedUserNotification,
  receivedUserNotifications,
  updatedNotificationConfiguration,
  createdRole,
  failedCreatingRole,
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
  createdM2MClient,
  updatedM2MClient,
  failedM2MClientOperation,
  // async thunks
  fetchRoles,
  fetchOrganizations,
  fetchCodeSpaces,
  fetchUsers,
  fetchM2MClients,
  fetchResponsibilitySets,
  fetchEntityTypes,
  fetchEventFilterTypes,
  fetchEventFilterStates,
  fetchNotificationTypes,
  fetchAdministrativeZones,
  fetchJobDomains,
  fetchJobActionsByDomain,
} from 'reducers/OrganizationReducer';

export const sortBy = (list, key) => {
  return list.sort((a, b) => a[key].localeCompare(b[key]));
};

const trim = data => JSON.parse(JSON.stringify(data).replace(/"\s+|\s+"/g, '"'));

/* ------------------------------------------------------------------ */
/* Plain side-effecting thunks                                        */
/* ------------------------------------------------------------------ */

const createRole = (role, getToken) => async dispatch => {
  const trimmedData = trim(role);
  const url = `${window.config.organisationsBaseUrl}roles`;
  return axios
    .post(url, trimmedData, await getApiConfig(getToken))
    .then(() => {
      dispatch(createdRole());
      dispatch(fetchRoles(getToken));
    })
    .catch(error => {
      dispatch(failedCreatingRole(error));
      dispatch(addNotification({ message: 'Error creating role', level: 'error' }));
      console.log('Error creating role', error);
    });
};

const updateRole = (role, getToken) => async dispatch => {
  const trimmedData = trim(role);
  const payload = { name: trimmedData.name };

  const url = `${window.config.organisationsBaseUrl}roles/${trimmedData.id}`;
  return axios
    .put(url, payload, await getApiConfig(getToken))
    .then(() => {
      dispatch(fetchRoles(getToken));
    })
    .catch(error => {
      dispatch(addNotification({ message: 'Error updating role', level: 'error' }));
      console.log('Error updating role', error);
    });
};

const deleteRole = (roleId, getToken) => async dispatch => {
  const url = `${window.config.organisationsBaseUrl}roles/${roleId}`;
  return axios
    .delete(url, await getApiConfig(getToken))
    .then(() => {
      dispatch(addNotification({ message: 'Role deleted', level: 'success' }));
      dispatch(fetchRoles(getToken));
    })
    .catch(error => {
      dispatch(addNotification({ message: 'Failed to delete role', level: 'error' }));
      console.log('Error deleting role with id ' + roleId, error);
    });
};

const createOrganization = (organization, getToken) => async dispatch => {
  const url = `${window.config.organisationsBaseUrl}`;
  const trimmedData = trim(organization);
  return axios
    .post(url, trimmedData, await getApiConfig(getToken))
    .then(() => {
      dispatch(createdOrganization());
      dispatch(fetchOrganizations(getToken));
    })
    .catch(error => {
      dispatch(failedCreatingOrganization(error));
      dispatch(addNotification({ message: 'Error creating organization', level: 'error' }));
      console.log('Error creating organization', error);
    });
};

const updateOrganization = (organization, getToken) => async dispatch => {
  const trimmedData = trim(organization);
  const url = `${window.config.organisationsBaseUrl}${trimmedData.id}`;
  return axios
    .put(url, trimmedData, await getApiConfig(getToken))
    .then(() => {
      dispatch(updatedOrganization());
      dispatch(fetchOrganizations(getToken));
    })
    .catch(error => {
      dispatch(addNotification({ message: 'Error updating organization', level: 'error' }));
      console.log('Error updating organization', error);
    });
};

const deleteOrganization = (organizationId, getToken) => async dispatch => {
  const url = `${window.config.organisationsBaseUrl}${organizationId}`;
  return axios
    .delete(url, await getApiConfig(getToken))
    .then(() => {
      dispatch(addNotification({ message: 'Deleted organization', level: 'success' }));
      dispatch(fetchOrganizations(getToken));
    })
    .catch(error => {
      dispatch(addNotification({ message: 'Failed to delete organization', level: 'error' }));
      console.log('Error deleting organization with id ' + organizationId, error);
    });
};

const createUser = (user, getToken) => async dispatch => {
  const url = `${window.config.organisationsBaseUrl}users`;
  const trimmedData = trim(user);

  return axios
    .post(url, trimmedData, await getApiConfig(getToken))
    .then(() => {
      dispatch(addNotification({ message: 'Created user successfully', level: 'success' }));
      dispatch(createdUser());
      dispatch(fetchUsers(getToken));
    })
    .catch(error => {
      dispatch(failedCreatingUser(error));
      dispatch(addNotification({ message: 'Error creating user', level: 'error' }));
      console.log('Error creating user', error);
    });
};

const updateUser = (user, getToken) => async dispatch => {
  const trimmedData = trim(user);
  const url = `${window.config.organisationsBaseUrl}users/${trimmedData.id}`;

  return axios
    .put(url, trimmedData, await getApiConfig(getToken))
    .then(() => {
      dispatch(addNotification({ message: 'Updated user successfully', level: 'success' }));
      dispatch(updatedUser());
      dispatch(fetchUsers(getToken));
    })
    .catch(error => {
      dispatch(failedCreatingUser(error));
      dispatch(addNotification({ message: 'Error updating user', level: 'error' }));
      console.log('Error updating user', error);
    });
};

const deleteUser = (userId, getToken) => async dispatch => {
  const url = `${window.config.organisationsBaseUrl}users/${userId}`;
  return axios
    .delete(url, await getApiConfig(getToken))
    .then(() => {
      dispatch(fetchUsers(getToken));
    })
    .catch(error => {
      console.log('Error deleting user with id ' + userId, error);
    });
};

const createM2MClient = (client, getToken) => async dispatch => {
  const url = `${window.config.organisationsBaseUrl}m2m_clients`;
  const trimmedData = trim(client);

  return axios
    .post(url, trimmedData, await getApiConfig(getToken))
    .then(() => {
      dispatch(addNotification({ message: 'Created M2M client successfully', level: 'success' }));
      dispatch(createdM2MClient());
      dispatch(fetchM2MClients(getToken));
    })
    .catch(error => {
      dispatch(failedM2MClientOperation(error));
      dispatch(addNotification({ message: 'Error creating M2M client', level: 'error' }));
      console.log('Error creating M2M client', error);
    });
};

const updateM2MClient = (client, getToken) => async dispatch => {
  const url = `${window.config.organisationsBaseUrl}m2m_clients/${client.privateCode}`;
  const trimmedData = trim(client);

  return axios
    .put(url, trimmedData, await getApiConfig(getToken))
    .then(() => {
      dispatch(addNotification({ message: 'Updated M2M client successfully', level: 'success' }));
      dispatch(updatedM2MClient());
      dispatch(fetchM2MClients(getToken));
    })
    .catch(error => {
      dispatch(failedM2MClientOperation(error));
      dispatch(addNotification({ message: 'Error updating M2M client', level: 'error' }));
      console.log('Error updating M2M client', error);
    });
};

const deleteM2MClient = (clientId, getToken) => async dispatch => {
  const url = `${window.config.organisationsBaseUrl}m2m_clients/${clientId}`;

  return axios
    .delete(url, await getApiConfig(getToken))
    .then(() => {
      dispatch(addNotification({ message: 'Deleted M2M client successfully', level: 'success' }));
      dispatch(fetchM2MClients(getToken));
    })
    .catch(error => {
      dispatch(addNotification({ message: 'Error deleting M2M client', level: 'error' }));
      console.log('Error deleting M2M client', error);
    });
};

const createEntityType = (entityType, getToken) => async dispatch => {
  const url = `${window.config.organisationsBaseUrl}entity_types`;
  const trimmedData = trim(entityType);

  return axios
    .post(url, trimmedData, await getApiConfig(getToken))
    .then(() => {
      dispatch(createdEntityType());
      dispatch(fetchEntityTypes(getToken));
    })
    .catch(error => {
      dispatch(failedCreatingEntityType(error));
      dispatch(addNotification({ message: 'Error creating entity type', level: 'error' }));
      console.log('Error creating entity type', error);
    });
};

const updateEntityType = (entityType, getToken) => async dispatch => {
  const trimmedData = trim(entityType);
  const url = `${window.config.organisationsBaseUrl}entity_types/${trimmedData.id}`;
  return axios
    .put(url, trimmedData, await getApiConfig(getToken))
    .then(() => {
      dispatch(updatedEntityType());
      dispatch(fetchEntityTypes(getToken));
    })
    .catch(error => {
      dispatch(addNotification({ message: 'Error updating entity type', level: 'error' }));
      console.log('Error updating entity type', error);
    });
};

const deleteEntityType = (entityTypeId, getToken) => async dispatch => {
  const url = `${window.config.organisationsBaseUrl}entity_types/${entityTypeId}`;
  return axios
    .delete(url, await getApiConfig(getToken))
    .then(() => {
      dispatch(addNotification({ message: 'Deleted entity type', level: 'success' }));
      dispatch(fetchEntityTypes(getToken));
    })
    .catch(error => {
      dispatch(addNotification({ message: 'Unable to delete entity type', level: 'error' }));
      console.log('Error deleting entity_type with id ' + entityTypeId, error);
    });
};

const createResponsibilitySet = (responsibilitySet, getToken) => async dispatch => {
  const url = `${window.config.organisationsBaseUrl}responsibility_sets`;
  const trimmedData = trim(responsibilitySet);

  return axios
    .post(url, trimmedData, await getApiConfig(getToken))
    .then(() => {
      dispatch(createdResponsibilitySet());
      dispatch(fetchResponsibilitySets(getToken));
    })
    .catch(error => {
      dispatch(addNotification({ message: 'Error creating responsibility set', level: 'error' }));
      console.log('Error creating responsibility set: ' + error.message);
    });
};

const updateResponsibilitySet = (responsibilitySet, getToken) => async dispatch => {
  const trimmedData = trim(responsibilitySet);
  const url = `${window.config.organisationsBaseUrl}responsibility_sets/${trimmedData.id}`;
  return axios
    .put(url, trimmedData, await getApiConfig(getToken))
    .then(() => {
      dispatch(updatedResponsibilitySet());
      dispatch(fetchResponsibilitySets(getToken));
    })
    .catch(error => {
      dispatch(addNotification({ message: 'Error updating responsibility set', level: 'error' }));
      console.log('Error updating responsibility set: ' + error.message);
    });
};

const deleteResponsibilitySet = (responsibilitySetId, getToken) => async dispatch => {
  const url = `${window.config.organisationsBaseUrl}responsibility_sets/${responsibilitySetId}`;
  return axios
    .delete(url, await getApiConfig(getToken))
    .then(() => {
      dispatch(addNotification({ message: 'Responsibility set deleted', level: 'success' }));
      dispatch(fetchResponsibilitySets(getToken));
    })
    .catch(error => {
      dispatch(addNotification({ message: 'Failed to delete responsibility set', level: 'error' }));
      console.log('Error deleting responsibility_set with id ' + responsibilitySetId, error);
    });
};

/* ------------------------------------------------------------------ */
/* getUserNotifications — conditional warm-up + fetch                 */
/* ------------------------------------------------------------------ */

const getUserNotifications = (username, getToken) => async (dispatch, getState) => {
  const url = `${window.config.organisationsBaseUrl}users/${username}/notification_configurations`;

  dispatch(requestedUserNotification());

  const state = getState();
  const {
    eventFilterTypes,
    jobDomains,
    eventFilterStates,
    organizations,
    administrativeZones,
    notificationTypes,
    entityTypes,
  } = state.OrganizationReducer;

  if (!eventFilterTypes.length) {
    dispatch(fetchEventFilterTypes(getToken));
  }

  if (!jobDomains.length) {
    dispatch(fetchJobDomains(getToken));
  }

  if (!eventFilterStates.length) {
    dispatch(fetchEventFilterStates(getToken));
  }

  if (!organizations.length) {
    dispatch(fetchOrganizations(getToken));
  }

  if (!administrativeZones.length) {
    dispatch(fetchAdministrativeZones(getToken));
  }

  if (!notificationTypes.length) {
    dispatch(fetchNotificationTypes(getToken));
  }

  if (!entityTypes.length) {
    dispatch(fetchEntityTypes(getToken));
  }

  return axios
    .get(url, await getApiConfig(getToken))
    .then(response => {
      dispatch(receivedUserNotifications(response.data));
    })
    .catch(error => {
      console.log('Error receiving user notifications', error);
    });
};

const updateUserNotification = (username, getToken) => async (dispatch, getState) => {
  const state = getState();
  const jobDomainActions = state.OrganizationReducer.jobDomainActions;
  const notificationConfiguration = formatUserNotifications(
    state.OrganizationReducer.userNotifications,
    jobDomainActions
  );

  const url = `${
    window.config.organisationsBaseUrl
  }users/${username.trim()}/notification_configurations`;
  return axios
    .put(url, notificationConfiguration, await getApiConfig(getToken))
    .then(() => {
      dispatch(updatedNotificationConfiguration());
      dispatch(
        addNotification({ message: 'Notification configuration updated', level: 'success' })
      );
    })
    .catch(() => {
      dispatch(
        addNotification({
          message: 'Unable to save notification configuration',
          level: 'error',
        })
      );
    });
};

/* ------------------------------------------------------------------ */
/* Plain helper (returns Promise directly, not dispatched)            */
/* ------------------------------------------------------------------ */

const getEntityByClassification = async (entityType, getToken) => {
  const url = `${window.config.organisationsBaseUrl}entity_types/${entityType}/entity_classifications`;
  return axios.get(url, await getApiConfig(getToken));
};

/* ------------------------------------------------------------------ */
/* Sync action wrappers — keep argument signatures back-compat        */
/* ------------------------------------------------------------------ */

const addEntityRefToNotification = (index, entityClassRef) =>
  addedEntityClassRef({ index, entityClassRef });

const removeEntityClassRefNotification = (index, entityClassRef) =>
  removedEntityClassRef({ index, entityClassRef });

const addAdminZoneRefToNotification = (index, id) => addedAdminZoneRef({ index, id });

const removeAdminZoneRefToNotification = (index, id) => removedAdminZoneRef({ index, id });

const deleteUserNotificationAction = index => deletedUserNotification(index);

const addNewUserNotification = () => addedNewUserNotification();

const setEnabledNotification = (index, enabled) => enabledUserNotification({ index, enabled });

const changeEventFilterType = (index, value) => changedEventFilterType({ index, value });

const changeEventFilterJobDomain = (index, value) => changedEventFilterJobDomain({ index, value });

const changeEventFilterOrganizationRef = (index, organisationRef) =>
  changedEventFilterOrgRef({ index, organisationRef });

const changeEventFilterAction = (index, action, isChecked) =>
  changeEventFilterActionReducer({ index, action, isChecked });

const changeEventFilterState = (index, state, isChecked) =>
  changeEventFilterStateReducer({ index, state, isChecked });

const changeNotificationType = (index, type) => changedNotificationType({ index, type });

/* ------------------------------------------------------------------ */
/* Namespace re-export                                                */
/* ------------------------------------------------------------------ */

const OrganizationRegisterActions = {
  // async data thunks (back-compat aliases keep get* naming)
  getRoles: fetchRoles,
  getOrganizations: fetchOrganizations,
  getCodeSpaces: fetchCodeSpaces,
  getUsers: fetchUsers,
  getM2MClients: fetchM2MClients,
  getResponbilitySets: fetchResponsibilitySets,
  getEntityTypes: fetchEntityTypes,
  getEventFilterTypes: fetchEventFilterTypes,
  getEventFilterStates: fetchEventFilterStates,
  getNotificationTypes: fetchNotificationTypes,
  getAdministrativeZones: fetchAdministrativeZones,
  getJobDomains: fetchJobDomains,
  getJobActionsByDomain: (domain, getToken) => fetchJobActionsByDomain({ domain, getToken }),
  // side-effecting thunks
  createRole,
  updateRole,
  deleteRole,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  createUser,
  updateUser,
  deleteUser,
  createM2MClient,
  updateM2MClient,
  deleteM2MClient,
  createEntityType,
  updateEntityType,
  deleteEntityType,
  createResponsibilitySet,
  updateResponsibilitySet,
  deleteResponsibilitySet,
  getUserNotifications,
  updateUserNotification,
  // sync action creators
  addEntityRefToNotification,
  removeEntityClassRefNotification,
  addAdminZoneRefToNotification,
  removeAdminZoneRefToNotification,
  deleteUserNotification: deleteUserNotificationAction,
  addNewUserNotification,
  setEnabledNotification,
  changeEventFilterType,
  changeEventFilterJobDomain,
  changeEventFilterOrganizationRef,
  changeEventFilterAction,
  changeEventFilterState,
  changeNotificationType,
  // plain helper
  getEntityByClassification,
};

export default OrganizationRegisterActions;
