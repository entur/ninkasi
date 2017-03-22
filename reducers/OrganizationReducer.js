import * as types from './../actions/actionTypes'

const initialState = {
  roles: [],
}

const OrganizationReducer = (state = initialState, action) => {

  switch (action.type) {

    case types.RECEIVED_ROLES:
      return Object.assign({}, state, { roles: action.payLoad })

    case types.CREATED_ROLE:
      return Object.assign({}, state, { roleStatus: {
        error: null,
        code: 'ROLE_CREATED'
      }})

    case types.FAILED_CREATING_ROLE:
      return Object.assign({}, state, { roleStatus: {
        error: action.payLoad,
        code: 'ROLE_CREATED_FAILED'
      }})

    default:
      return state
  }
}

export default OrganizationReducer
