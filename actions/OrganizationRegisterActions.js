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
import * as types from './actionTypes';
import {formatUserNotifications} from './OrganizationUtils';
import SuppliersActions from './SuppliersActions';
import uuid from 'uuid/v4';

function sendData(payLoad, type) {
    return {
        payLoad: payLoad,
        type: type
    };
}

var OrganizationRegisterActions = {};

const getConfig = () => {
    let config = {};
    let token = localStorage.getItem('NINKASI::jwt');

    config.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
        'X-Correlation-Id': uuid()
    };
    return config;
};

OrganizationRegisterActions.getRoles = () => dispatch => {
    const url = `${window.config.organisationsBaseUrl}roles`;
    return axios
        .get(url, getConfig())
        .then(response => {
            dispatch(sendData(sortBy(response.data, 'id'), types.RECEIVED_ROLES));
        })
        .catch(error => {
            console.log('Error receiving roles', error);
        });
};

OrganizationRegisterActions.addEntityRefToNotification = (
    index,
    entityClassRef
) => dispatch => {
    dispatch(
        sendData(
            {
                index,
                entityClassRef
            },
            types.ADDED_ENTITY_CLASS_REF
        )
    );
};

OrganizationRegisterActions.deleteUserNotification = index => dispatch => {
    dispatch(sendData(index, types.DELETED_USER_NOTIFICATION));
};

OrganizationRegisterActions.removeEntityClassRefNotification = (
    index,
    entityClassRef
) => dispatch => {
    dispatch(
        sendData(
            {
                index,
                entityClassRef
            },
            types.REMOVED_ENTITY_CLASS_REF
        )
    );
};

OrganizationRegisterActions.createRole = role => dispatch => {
    const trimmedData = JSON.parse(JSON.stringify(role).replace(/"\s+|\s+"/g, '"'));
    const url = `${window.config.organisationsBaseUrl}roles`;
    return axios
        .post(url, trimmedData, getConfig())
        .then(response => {
            dispatch(sendData(null, types.CREATED_ROLE));
            dispatch(OrganizationRegisterActions.getRoles());
        })
        .catch(error => {
            dispatch(sendData(types.ERROR_CREATE_PROVIDER, error));
        });
};

OrganizationRegisterActions.updateRole = role => dispatch => {
    const trimmedData = JSON.parse(JSON.stringify(role).replace(/"\s+|\s+"/g, '"'));
    const payLoad = {name: trimmedData.name};

    const url = `${window.config.organisationsBaseUrl}roles/${trimmedData.id}`;
    return axios
        .put(url, payLoad, getConfig())
        .then(response => {
            dispatch(OrganizationRegisterActions.getRoles());
        })
        .catch(error => {
            console.log('Error updating role', error);
        });
};

OrganizationRegisterActions.getOrganizations = () => dispatch => {
    const url = `${window.config.organisationsBaseUrl}`;
    return axios
        .get(url, getConfig())
        .then(response => {
            dispatch(
                sendData(sortBy(response.data, 'name'), types.RECEIVED_ORGANIZATIONS)
            );
        })
        .catch(error => {
            console.log('Error receiving organizations', error);
        });
};

OrganizationRegisterActions.createOrganization = organization => dispatch => {
    const url = `${window.config.organisationsBaseUrl}`;
    const trimmedData = JSON.parse(JSON.stringify(organization).replace(/"\s+|\s+"/g, '"'));
    return axios
        .post(url, trimmedData, getConfig())
        .then(response => {
            dispatch(sendData(null, types.CREATED_ORGANIZATION));
            dispatch(OrganizationRegisterActions.getOrganizations());
        })
        .catch(error => {
            dispatch(sendData(types.FAILED_CREATING_ORGANIZATION, error));
        });
};

OrganizationRegisterActions.updateOrganization = organization => dispatch => {
    const trimmedData = JSON.parse(JSON.stringify(organization).replace(/"\s+|\s+"/g, '"'));
    const url = `${window.config
        .organisationsBaseUrl}${trimmedData.id}`;
    return axios
        .put(url, trimmedData, getConfig())
        .then(response => {
            dispatch(sendData(null, types.UPDATED_ORGANIZATION));
            dispatch(OrganizationRegisterActions.getOrganizations());
        })
        .catch(error => {
            console.log('Error updating organization', error);
        });
};

OrganizationRegisterActions.updateUser = user => dispatch => {
    const trimmedData = JSON.parse(JSON.stringify(user).replace(/"\s+|\s+"/g, '"'));
    const url = `${window.config.organisationsBaseUrl}users/${trimmedData.id}`;

    return axios
        .put(url, trimmedData, getConfig())
        .then(response => {
            dispatch(sendData(null, types.UPDATED_USER));
            dispatch(OrganizationRegisterActions.getUsers());
        })
        .catch(error => {
            console.log('Error updating user', error);
        });
};

OrganizationRegisterActions.getCodeSpaces = () => dispatch => {
    const url = `${window.config.organisationsBaseUrl}code_spaces`;
    return axios
        .get(url, getConfig())
        .then(response => {
            dispatch(sendData(response.data, types.RECEIVED_CODESPACES));
        })
        .catch(error => {
            console.log('Error receiving code spaces', error);
        });
};

OrganizationRegisterActions.getUsers = () => dispatch => {
    const url = `${window.config.organisationsBaseUrl}users?full=true`;
    return axios
        .get(url, getConfig())
        .then(response => {
            dispatch(
                sendData(sortBy(response.data, 'username'), types.RECEIVED_USERS)
            );
        })
        .catch(error => {
            console.log('Error receiving users', error);
        });
};

OrganizationRegisterActions.deleteUser = userId => dispatch => {
    const url = `${window.config.organisationsBaseUrl}users/${userId}`;
    return axios
        .delete(url, getConfig())
        .then(response => {
            dispatch(OrganizationRegisterActions.getUsers());
        })
        .catch(error => {
            console.log('Error deleting user with id ' + userId, error);
        });
};

OrganizationRegisterActions.deleteOrganization = organizationId => dispatch => {
    const url = `${window.config
        .organisationsBaseUrl}${organizationId}`;
    return axios
        .delete(url, getConfig())
        .then(response => {
            dispatch(
                SuppliersActions.addNotification(
                    'Deleted organization',
                    'success'
                )
            );
            dispatch(OrganizationRegisterActions.getOrganizations());
        })
        .catch(error => {
            dispatch(
                SuppliersActions.addNotification(
                    'Failed to delete organization',
                    'error'
                )
            );
            console.log(
                'Error deleting organization with id ' + organizationId,
                error
            );
        });
};

OrganizationRegisterActions.deleteEntityType = entityTypeId => dispatch => {
    const url = `${window.config.organisationsBaseUrl}entity_types/${entityTypeId}`;
    return axios
        .delete(url, getConfig())
        .then(response => {
            dispatch(
                SuppliersActions.addNotification(
                    'Deleted entity type',
                    'success'
                )
            );
            dispatch(OrganizationRegisterActions.getEntityTypes());
        })
        .catch(error => {
            dispatch(
                SuppliersActions.addNotification(
                    'Unable to delete entity type',
                    'error'
                )
            );
            console.log('Error deleting entity_type with id ' + entityTypeId, error);
        });
};

OrganizationRegisterActions.deleteResponsibilitySet = responsibilitySetId => dispatch => {
    const url = `${window.config
        .organisationsBaseUrl}responsibility_sets/${responsibilitySetId}`;
    return axios
        .delete(url, getConfig())
        .then(response => {
            dispatch(
                SuppliersActions.addNotification(
                    'Responsibility set deleted',
                    'success'
                )
            );
            dispatch(OrganizationRegisterActions.getResponbilitySets());
        })
        .catch(error => {
            dispatch(
                SuppliersActions.addNotification(
                    'Failed to delete responsibility set',
                    'error'
                )
            );
            console.log(
                'Error deleting responsibility_set with id ' + responsibilitySetId,
                error
            );
        });
};

OrganizationRegisterActions.deleteRole = roleId => dispatch => {
    const url = `${window.config.organisationsBaseUrl}roles/${roleId}`;
    return axios
        .delete(url, getConfig())
        .then(response => {
            dispatch(
                SuppliersActions.addNotification(
                    'Role deleted',
                    'success'
                )
            );
            dispatch(OrganizationRegisterActions.getRoles());
        })
        .catch(error => {
            dispatch(
                SuppliersActions.addNotification(
                    'Failed to delete role',
                    'error'
                )
            );
            console.log('Error deleting role with id ' + roleId, error);
        });
};

OrganizationRegisterActions.getResponbilitySets = () => dispatch => {
    const url = `${window.config.organisationsBaseUrl}responsibility_sets`;
    return axios
        .get(url, getConfig())
        .then(response => {
            dispatch(
                sendData(sortBy(response.data, 'name'), types.RECEIVED_RESPONSIBILITES)
            );
        })
        .catch(error => {
            console.log('Error responsibility_sets users', error);
        });
};

OrganizationRegisterActions.createResponsibilitySet = responsibilitySet => dispatch => {
    const url = `${window.config.organisationsBaseUrl}responsibility_sets`;
    const trimmedData = JSON.parse(JSON.stringify(responsibilitySet).replace(/"\s+|\s+"/g, '"'));

    return axios
        .post(url, trimmedData, getConfig())
        .then(response => {
            dispatch(sendData(null, types.CREATED_RESPONSIBILITY_SET));
            dispatch(OrganizationRegisterActions.getResponbilitySets());
        })
        .catch(error => {
            dispatch(sendData(types.FAILED_CREATING_ORGANIZATION, error));
        });
};

OrganizationRegisterActions.createUser = user => dispatch => {
    const url = `${window.config.organisationsBaseUrl}users`;
    const trimmedData = JSON.parse(JSON.stringify(user).replace(/"\s+|\s+"/g, '"'));

    return axios
        .post(url, trimmedData, getConfig())
        .then(response => {
            dispatch(sendData(null, types.CREATED_USER));
            dispatch(sendData({
                userId: 'N/A',
                error: false,
                username: user.username,
                isNewUser: true,
                password: response.data
            }, types.OPENED_NEW_PASSWORD_DIALOG));
            dispatch(OrganizationRegisterActions.getUsers());
        })
        .catch(error => {
            dispatch(sendData(types.FAILED_CREATING_USER, error));
        });
};

OrganizationRegisterActions.createEntityType = entityType => dispatch => {
    const url = `${window.config.organisationsBaseUrl}entity_types`;
    const trimmedData = JSON.parse(JSON.stringify(entityType).replace(/"\s+|\s+"/g, '"'));

    return axios
        .post(url, trimmedData, getConfig())
        .then(response => {
            dispatch(sendData(null, types.CREATED_ENTITY_TYPE));
            dispatch(OrganizationRegisterActions.getEntityTypes());
        })
        .catch(error => {
            dispatch(sendData(types.FAILED_CREATING_ENTITY_TYPE, error));
        });
};

OrganizationRegisterActions.updateEntityType = entityType => dispatch => {
    const trimmedData = JSON.parse(JSON.stringify(entityType).replace(/"\s+|\s+"/g, '"'));
    const url = `${window.config
        .organisationsBaseUrl}entity_types/${trimmedData.id}`;
    return axios
        .put(url, trimmedData, getConfig())
        .then(response => {
            dispatch(sendData(null, types.UPDATED_ENTITY_TYPE));
            dispatch(OrganizationRegisterActions.getEntityTypes());
        })
        .catch(error => {
            console.log('Error updating entity type set', error);
        });
};

OrganizationRegisterActions.updateResponsibilitySet = responsibilitySet => dispatch => {
    const trimmedData = JSON.parse(JSON.stringify(responsibilitySet).replace(/"\s+|\s+"/g, '"'));

    const url = `${window.config
        .organisationsBaseUrl}responsibility_sets/${trimmedData.id}`;
    return axios
        .put(url, trimmedData, getConfig())
        .then(response => {
            dispatch(sendData(null, types.UPDATED_RESPONSIBILITY_SET));
            dispatch(OrganizationRegisterActions.getResponbilitySets());
        })
        .catch(error => {
            console.log('Error updating responsibility set', error);
        });
};

OrganizationRegisterActions.getEntityTypes = () => dispatch => {
    const url = `${window.config.organisationsBaseUrl}entity_types`;
    return axios
        .get(url, getConfig())
        .then(response => {
            dispatch(
                sendData(sortBy(response.data, 'name'), types.RECEIVED_ENTITY_TYPES)
            );
        })
        .catch(error => {
            console.log('Error receiving entity_types', error);
        });
};

OrganizationRegisterActions.resetPassword = (userId, username) => dispatch => {
    const url = `${window.config.organisationsBaseUrl}users/${userId.trim()}/resetPassword`;
    return axios
        .post(url, null, getConfig())
        .then(response => {
            dispatch(sendData({
                userId,
                error: false,
                username: username,
                isNewUser: false,
                password: response.data
            }, types.OPENED_NEW_PASSWORD_DIALOG));
        })
        .catch(err => {
            dispatch(
                SuppliersActions.addNotification(
                    'Unable to reset password for user',
                    'error'
                )
            );
        });
};

OrganizationRegisterActions.closePasswordDialog = () => dispatch => {
    dispatch(sendData({
        userId: null,
        error: false,
        password: null
    }, types.CLOSED_NEW_PASSWORD_DIALOG));
};

OrganizationRegisterActions.addNewUserNotification = () => dispatch => {
    dispatch(sendData(null, types.ADDED_NEW_USER_NOTIFICATION));
};

OrganizationRegisterActions.getEntityByClassification = entityType => {
    const url = `${window.config
        .organisationsBaseUrl}entity_types/${entityType}/entity_classifications`;
    return axios.get(url, getConfig());
};

OrganizationRegisterActions.getUserNotifications = username => (
    dispatch,
    getState
) => {
    const url = `${window.config
        .organisationsBaseUrl}users/${username}/notification_configurations`;

    dispatch(sendData(null, types.REQUESTED_USER_NOTIFICATION));

    let state = getState();
    const {
        eventFilterTypes,
        jobDomains,
        eventFilterStates,
        organizations,
        administrativeZones,
        notificationTypes,
        entityTypes
    } = state.OrganizationReducer;

    if (!eventFilterTypes.length) {
        dispatch(OrganizationRegisterActions.getEventFilterTypes());
    }

    if (!jobDomains.length) {
        dispatch(OrganizationRegisterActions.getJobDomains());
    }

    if (!eventFilterStates.length) {
        dispatch(OrganizationRegisterActions.getEventFilterStates());
    }

    if (!organizations.length) {
        dispatch(OrganizationRegisterActions.getOrganizations());
    }

    if (!administrativeZones.length) {
        dispatch(OrganizationRegisterActions.getAdministrativeZones());
    }

    if (!notificationTypes.length) {
        dispatch(OrganizationRegisterActions.getNotificationTypes());
    }

    if (!entityTypes.length) {
        dispatch(OrganizationRegisterActions.getEntityTypes());
    }

    return axios
        .get(url, getConfig())
        .then(response => {
            dispatch(sendData(response.data, types.RECEIVED_USER_NOTIFICATIONS));
        })
        .catch(error => {
            console.log('Error receiving user notifications', error);
        });
};

OrganizationRegisterActions.setEnabledNotification = (
    index,
    enabled
) => dispatch => {
    dispatch(sendData({index, enabled}, types.ENABLED_USER_NOTIFICATION));
};

OrganizationRegisterActions.getEventFilterTypes = () => dispatch => {
    const url = `${window.config
        .eventsBaseUrl}notifications/event_filter_types`;
    return axios
        .get(url, getConfig())
        .then(response => {
            dispatch(sendData(response.data, types.RECEIVED_EVENT_FILTER_TYPES));
        })
        .catch(error => {
            console.log('Error receiving event filter types', error);
        });
};

OrganizationRegisterActions.getJobDomains = () => dispatch => {
    const url = `${window.config.eventsBaseUrl}notifications/job_domains`;
    return axios
        .get(url, getConfig())
        .then(response => {
            dispatch(sendData(response.data, types.RECEIVED_JOB_DOMAINS));
            response.data.forEach(domain => {
                dispatch(OrganizationRegisterActions.getJobActionsByDomain(domain));
            });
        })
        .catch(error => {
            console.log('Error receiving job domains', error);
        });
};

OrganizationRegisterActions.changeEventFilterType = (
    index,
    value
) => dispatch => {
    dispatch(
        sendData(
            {
                index,
                value
            },
            types.CHANGED_EVENT_FILTER_TYPE
        )
    );
};

OrganizationRegisterActions.changeEventFilterJobDomain = (
    index,
    value
) => dispatch => {
    dispatch(
        sendData(
            {
                index,
                value
            },
            types.CHANGED_EVENT_FILTER_JOB_DOMAIN
        )
    );
};

OrganizationRegisterActions.changeEventFilterOrganizationRef = (
    index,
    organisationRef
) => dispatch => {
    dispatch(
        sendData(
            {
                index,
                organisationRef
            },
            types.CHANGED_EVENT_FILTER_ORG_REF
        )
    );
};

OrganizationRegisterActions.getJobActionsByDomain = domain => dispatch => {
    const url = `${window.config
        .eventsBaseUrl}notifications/job_actions/${domain}`;
    return axios
        .get(url, getConfig())
        .then(response => {
            dispatch(
                sendData(
                    {
                        data: response.data,
                        domain
                    },
                    types.RECEIVED_JOB_ACTIONS_FOR_DOMAIN
                )
            );
        })
        .catch(error => {
            console.log(`Error receiving actions for domain ${domain}`, error);
        });
};

OrganizationRegisterActions.changeEventFilterAction = (
    index,
    action,
    isChecked
) => dispatch => {
    dispatch(
        sendData(
            {
                index,
                action,
                isChecked
            },
            types.CHANGE_EVENT_FILTER_ACTION
        )
    );
};

OrganizationRegisterActions.changeEventFilterState = (
    index,
    state,
    isChecked
) => dispatch => {
    dispatch(
        sendData(
            {
                index,
                state,
                isChecked
            },
            types.CHANGE_EVENT_FILTER_STATE
        )
    );
};

OrganizationRegisterActions.getEventFilterStates = () => dispatch => {
    const url = `${window.config.eventsBaseUrl}notifications/job_states`;
    return axios
        .get(url, getConfig())
        .then(response => {
            dispatch(sendData(response.data, types.RECEIVED_EVENT_FILTER_STATES));
        })
        .catch(error => {
            console.log('Error receiving event filter states', error);
        });
};

OrganizationRegisterActions.changeNotificationType = (
    index,
    type
) => dispatch => {
    dispatch(
        sendData(
            {
                index,
                type
            },
            types.CHANGED_NOTIFICATION_TYPE
        )
    );
};

OrganizationRegisterActions.getNotificationTypes = () => dispatch => {
    const url = `${window.config
        .eventsBaseUrl}notifications/notification_types`;
    return axios
        .get(url, getConfig())
        .then(response => {
            dispatch(sendData(response.data, types.RECEIVED_NOTIFICATION_TYPES));
        })
        .catch(error => {
            console.log('Error receiving notification types', error);
        });
};

OrganizationRegisterActions.getAdministrativeZones = () => dispatch => {
    const url = `${window.config.organisationsBaseUrl}administrative_zones`;
    return axios
        .get(url, getConfig())
        .then(response => {
            dispatch(sendData(response.data, types.RECEIVED_ADMINISTRATIVE_ZONES));
        })
        .catch(error => {
            console.log('Error receiving administrative zones', error);
        });
};

OrganizationRegisterActions.addAdminZoneRefToNotification = (
    index,
    id
) => dispatch => {
    dispatch(
        sendData(
            {
                index,
                id
            },
            types.ADDED_ADMIN_ZONE_REF
        )
    );
};

OrganizationRegisterActions.removeAdminZoneRefToNotification = (
    index,
    id
) => dispatch => {
    dispatch(
        sendData(
            {
                index,
                id
            },
            types.REMOVED_ADMIN_ZONE_REF
        )
    );
};

OrganizationRegisterActions.updateUserNotification = username => (
    dispatch,
    getState
) => {
    let state = getState();
    let jobDomainActions = state.OrganizationReducer.jobDomainActions;
    let notificationConfiguration = formatUserNotifications(
        state.OrganizationReducer.userNotifications,
        jobDomainActions
    );

    const url = `${window.config
        .organisationsBaseUrl}users/${username.trim()}/notification_configurations`;
    return axios
        .put(url, notificationConfiguration, getConfig())
        .then(response => {
            dispatch(sendData(null, types.UPDATED_NOTIFICATION_CONFIGURATION));
            dispatch(
                SuppliersActions.addNotification(
                    'Notification configuration updated',
                    'success'
                )
            );
        })
        .catch(error => {
            dispatch(
                SuppliersActions.addNotification(
                    'Unable to save notification configuration',
                    'error'
                )
            );
        });
};

export const sortBy = (list, key) => {
    return list.sort((a, b) => a[key].localeCompare(b[key]));
};

export default OrganizationRegisterActions;
