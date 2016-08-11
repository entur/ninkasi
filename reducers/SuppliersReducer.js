import * as types from './../actions/actionTypes'
import {reducer as formReducer} from 'redux-form'

const initialState = {
  data: [],
  statusList: []
}

const SuppliersReducer = (state = initialState, action) => {

  switch (action.type) {

    case types.RECV_ERROR:
      return Object.assign({}, state, {isLoading: false, data: action.payLoad, error: true})
    case types.RECV_DATA:
      return Object.assign({}, state, {isLoading: false, data: action.payLoad, error: false })
    case types.REQ_DATA:
      return Object.assign({}, state, {isLoading: true, error: false })
    case types.SELECT_SUPPLIER:
      return Object.assign({}, state, {activeId: action.payLoad})
    case types.SUCCESS_FETCH_PROVIDER:
      return Object.assign({}, state, {provider: action.payLoad})
    case types.RECEIVED_PROVIDER_STATUS:
      return Object.assign({}, state, {statusList: action.payLoad})

    default:
      return state
  }
}

export default SuppliersReducer
