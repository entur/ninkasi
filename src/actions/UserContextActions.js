import axios from 'axios';
import getApiConfig from './getApiConfig';
import * as types from './actionTypes';
import SuppliersActions from './SuppliersActions';

var UserContextActions = {};

UserContextActions.fetchUserContext = () => async (dispatch, getState) => {
  const url = window.config.providersBaseUrl + 'usercontext';
  return axios
    .get(url, await getApiConfig(getState().UserReducer.auth))
    .then(response => {
      dispatch(SuppliersActions.receiveUserContext(response.data));
    })
    .catch(err => {
      SuppliersActions.addNotification('Failed to fetch user context', 'error');
    });
};

SuppliersActions.receiveUserContext = data => {
  return {
    type: types.RECEIVED_USER_CONTEXT,
    payLoad: data
  };
};

export default UserContextActions;
