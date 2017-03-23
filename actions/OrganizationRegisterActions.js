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


export default OrganizationRegisterActions