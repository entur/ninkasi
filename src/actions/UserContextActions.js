import axios from 'axios';
import getApiConfig from './getApiConfig';
import * as types from './actionTypes';
import SuppliersActions from './SuppliersActions';

const UserContextActions = {};

UserContextActions.fetchUserContext = getToken => async (dispatch, getState) => {
  if (window.config?.defaultAuthMethod === 'local') {
    dispatch(
      SuppliersActions.receiveUserContext({
        preferredName: 'Local Dev',
        isRouteDataAdmin: true,
        isOrganisationAdmin: true,
      })
    );
    return;
  }
  const url = window.config.providersBaseUrl + 'usercontext';
  return axios
    .get(url, await getApiConfig(getToken))
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
    payLoad: data,
  };
};

export default UserContextActions;
