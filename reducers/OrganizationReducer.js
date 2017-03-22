import * as types from './../actions/actionTypes'

const initialState = {
  roles: [],
  organizations: [],
  codeSpaces: []
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

    case types.RECEIVED_ORGANIZATIONS:
      return Object.assign({}, state, { organizations: action.payLoad })

    case types.CREATED_ORGANIZATION:
      return Object.assign({}, state, { organizationStatus: {
        error: null,
        code: 'ORGANIZATION_CREATED'
      }})

    case types.UPDATED_ORGANIZATION:
      return Object.assign({}, state, { organizationStatus: {
        error: null,
        code: 'ORGANIZATION_UPDATED'
      }})

    case types.FAILED_CREATING_ORGANIZATION:
      return Object.assign({}, state, { organizationStatus: {
        error: action.payLoad,
        code: 'ORGANIZATION_CREATED_FAILED'
      }})

    case types.RECEIVED_CODESPACES:
      return Object.assign({}, state, { codeSpaces: action.payLoad })

    default:
      return state
  }
}

export default OrganizationReducer
