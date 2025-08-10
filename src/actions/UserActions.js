import * as types from './actionTypes';

const UserActions = {};

UserActions.updateAuth = data => {
  return {
    type: types.UPDATE_AUTH,
    payLoad: data,
  };
};

export default UserActions;
