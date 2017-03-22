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
      console.log("Error creating role", error)
    })
  }
}



export default OrganizationRegisterActions