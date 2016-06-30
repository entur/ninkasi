import { combineReducers } from 'redux'
import * as types from './../actions/actionTypes'

const suppliersReducer = (state = {}, action) => {

  switch (action.type) {

    case types.RECV_ERROR:
      return Object.assign({}, state, {isLoading: false, data: action.payLoad, error: true})
    case types.RECV_DATA:
      return Object.assign({}, state, {isLoading: false, data: action.payLoad, error: false })
    case types.REQ_DATA:
      return Object.assign({}, state, {isLoading: true, error: false })
    case types.SELECT_SUPPLIER:
      console.log(action.payLoad)
      return Object.assign({}, state, {activeId: action.payLoad})
    default:
      return state
  }
}

const reducer = combineReducers({
  suppliersReducer
})

export default reducer
