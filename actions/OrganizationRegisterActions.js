import axios from 'axios'
import * as types from './actionTypes'

function sendData(payLoad, type) {
  return {
    payLoad: payLoad,
    type: type
  }
}

var OrganizationRegisterActions = {}

OrganizationRegisterActions.getRoles = () => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/roles`
    return axios.get(url)
    .then(response => {
      dispatch(sendData(response.data, types.RECEIVED_ROLES))
    }).catch( error => {
      console.log("Error receiving roles", error)
    })
  }
}

OrganizationRegisterActions.createRole = role => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/roles`
    return axios.post(url, role, {
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      dispatch(sendData(null, types.CREATED_ROLE))
      dispatch(OrganizationRegisterActions.getRoles())
    }).catch( error => {
      dispatch(sendData(types.ERROR_CREATE_PROVIDER, error))
    })
  }
}

OrganizationRegisterActions.updateRole = role => {
  return function (dispatch) {

    const payLoad = {name: role.name}

    const url = `${window.config.nabuBaseUrl}jersey/roles/${role.id}`
    return axios.put(url, payLoad, {
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      dispatch(OrganizationRegisterActions.getRoles())
    }).catch( error => {
      console.log("Error updating role", error)
    })
  }
}

OrganizationRegisterActions.getOrganizations = () => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/organisations`
    return axios.get(url)
    .then(response => {
      dispatch(sendData(response.data, types.RECEIVED_ORGANIZATIONS))
    }).catch( error => {
      console.log("Error receiving organizations", error)
    })
  }
}

OrganizationRegisterActions.createOrganization = organization => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/organisations`
    return axios.post(url, organization, {
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      dispatch(sendData(null, types.CREATED_ORGANIZATION))
      dispatch(OrganizationRegisterActions.getOrganizations())
    }).catch( error => {
      dispatch(sendData(types.FAILED_CREATING_ORGANIZATION, error))
    })
  }
}

OrganizationRegisterActions.updateOrganization = organization => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/organisations/${organization.id}`
    return axios.put(url, organization, {
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      dispatch(sendData(null, types.UPDATED_ORGANIZATION))
      dispatch(OrganizationRegisterActions.getOrganizations())
    }).catch( error => {
      console.log("Error updating organization", error)
    })
  }
}

OrganizationRegisterActions.updateUser = user => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/users/${user.id}`
    return axios.put(url, user, {
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      dispatch(sendData(null, types.UPDATED_USER))
      dispatch(OrganizationRegisterActions.getUsers())
    }).catch( error => {
      console.log("Error updating user", error)
    })
  }
}

OrganizationRegisterActions.getCodeSpaces = () => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/code_spaces`
    return axios.get(url)
    .then(response => {
      dispatch(sendData(response.data, types.RECEIVED_CODESPACES))
    }).catch( error => {
      console.log("Error receiving code spaces", error)
    })
  }
}

OrganizationRegisterActions.getUsers = () => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/users`
    return axios.get(url)
    .then(response => {
      dispatch(sendData(response.data, types.RECEIVED_USERS))
    }).catch( error => {
      console.log("Error receiving users", error)
    })
  }
}

OrganizationRegisterActions.deleteUser = userId => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/users/${userId}`
    return axios.delete(url)
    .then(response => {
      dispatch(OrganizationRegisterActions.getUsers())
    }).catch( error => {
      console.log("Error deleting user with id " + userId, error)
    })
  }
}

OrganizationRegisterActions.deleteOrganization = organizationId => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/organisations/${organizationId}`
    return axios.delete(url)
    .then(response => {
      dispatch(OrganizationRegisterActions.getOrganizations())
    }).catch( error => {
      console.log("Error deleting organization with id " + organizationId, error)
    })
  }
}

OrganizationRegisterActions.deleteEntityType = entityTypeId => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/entity_types/${entityTypeId}`
    return axios.delete(url)
    .then(response => {
      dispatch(OrganizationRegisterActions.getEntityTypes())
    }).catch( error => {
      console.log("Error deleting entity_type with id " + entityTypeId, error)
    })
  }
}

OrganizationRegisterActions.deleteResponsibilitySet = responsibilitySetId => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/responsibility_sets/${responsibilitySetId}`
    return axios.delete(url)
    .then(response => {
      dispatch(OrganizationRegisterActions.getResponsibilities())
    }).catch( error => {
      console.log("Error deleting responsibility_set with id " + responsibilitySetId, error)
    })
  }
}

OrganizationRegisterActions.deleteRole = roleId => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/roles/${roleId}`
    return axios.delete(url)
    .then(response => {
      dispatch(OrganizationRegisterActions.getRoles())
    }).catch( error => {
      console.log("Error deleting role with id " + roleId, error)
    })
  }
}

OrganizationRegisterActions.getResponsibilities = () => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/responsibility_sets`
    return axios.get(url)
    .then(response => {
      dispatch(sendData(response.data, types.RECEIVED_RESPONSIBILITES))
    }).catch( error => {
      console.log("Error responsibility_sets users", error)
    })
  }
}

OrganizationRegisterActions.createResponsibilitySet = responsibilitySet => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/responsibility_sets`
    return axios.post(url, responsibilitySet, {
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      dispatch(sendData(null, types.CREATED_RESPONSIBILITY_SET))
      dispatch(OrganizationRegisterActions.getResponsibilities())
    }).catch( error => {
      dispatch(sendData(types.FAILED_CREATING_ORGANIZATION, error))
    })
  }
}

OrganizationRegisterActions.createUser = user => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/users`
    return axios.post(url, user, {
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      dispatch(sendData(null, types.CREATED_USER))
      dispatch(OrganizationRegisterActions.getUsers())
    }).catch( error => {
      dispatch(sendData(types.FAILED_CREATING_USER, error))
    })
  }
}

OrganizationRegisterActions.createEntityType = entityType => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/entity_types`
    return axios.post(url, entityType, {
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      dispatch(sendData(null, types.CREATED_ENTITY_TYPE))
      dispatch(OrganizationRegisterActions.getEntityTypes())
    }).catch( error => {
      dispatch(sendData(types.FAILED_CREATING_ENTITY_TYPE, error))
    })
  }
}

OrganizationRegisterActions.updateEntityType = entityType => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/entity_types/${entityType.id}`
    return axios.put(url, entityType, {
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      dispatch(sendData(null, types.UPDATED_ENTITY_TYPE))
      dispatch(OrganizationRegisterActions.getEntityTypes())
    }).catch( error => {
      console.log("Error updating entity type set", error)
    })
  }
}

OrganizationRegisterActions.updateResponsibilitySet = responsibilitySet => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/responsibility_sets/${responsibilitySet.id}`
    return axios.put(url, responsibilitySet, {
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      dispatch(sendData(null, types.UPDATED_RESPONSIBILITY_SET))
      dispatch(OrganizationRegisterActions.getResponsibilities())
    }).catch( error => {
      console.log("Error updating responsibility set", error)
    })
  }
}

OrganizationRegisterActions.getEntityTypes = () => {
  return function (dispatch) {
    const url = `${window.config.nabuBaseUrl}jersey/entity_types`
    return axios.get(url)
    .then(response => {
      dispatch(sendData(response.data, types.RECEIVED_ENTITY_TYPES))
    }).catch( error => {
      console.log("Error receiving entity_types", error)
    })
  }
}

OrganizationRegisterActions.getEntityByClassification = entityType => {
  const url = `${window.config.nabuBaseUrl}jersey/entity_types/${entityType}/entity_classifications`
  return axios.get(url)
}


export default OrganizationRegisterActions