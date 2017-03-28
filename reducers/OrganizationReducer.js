import * as types from './../actions/actionTypes'

const initialState = {
  roles: [],
  organizations: [],
  codeSpaces: [],
  users: [],
  responsibilities: [],
  entityTypes: [],
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

    case types.CREATED_RESPONSIBILITY_SET:
      return Object.assign({}, state, { responsibilitySetStatus: {
        error: null,
        code: 'RESPONSIBILITY_SET_CREATED'
      }})

    case types.CREATED_USER:
      return Object.assign({}, state, { userStatus: {
        error: null,
        code: 'USER_CREATED'
      }})

    case types.UPDATED_USER:
      return Object.assign({}, state, { userStatus: {
        error: null,
        code: 'USER_UPDATED'
      }})

    case types.CREATED_ENTITY_TYPE:
      return Object.assign({}, state, { entityTypeStatus: {
        error: null,
        code: 'ENTITY_TYPE_CREATED'
      }})

    case types.FAILED_CREATING_ENTITY_TYPE:
      return Object.assign({}, state, { entityTypeStatus: {
        error: action.payLoad,
        code: 'ENTITY_TYPE_CREATED_FAILED'
      }})

    case types.UPDATED_RESPONSIBILITY_SET:
      return Object.assign({}, state, { responsibilitySetStatus: {
        error: null,
        code: 'RESPONSIBILITY_SET_UPDATED'
      }})

    case types.UPDATED_ENTITY_TYPE:
      return Object.assign({}, state, { entityTypeStatus: {
        error: null,
        code: 'ENTITY_TYPE_UPDATED'
      }})

    case types.RECEIVED_CODESPACES:
      return Object.assign({}, state, { codeSpaces: action.payLoad })

    case types.RECEIVED_USERS:
      return Object.assign({}, state, { users: action.payLoad })

    case types.RECEIVED_RESPONSIBILITES:
      return Object.assign({}, state, { responsibilities: action.payLoad })

    case types.RECEIVED_ENTITY_TYPES:
      return Object.assign({}, state, { entityTypes: action.payLoad })

    default:
      return state
  }
}

export default OrganizationReducer
