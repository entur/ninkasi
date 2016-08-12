import * as types from './../actions/actionTypes'
import {reducer as formReducer} from 'redux-form'

const intialState = {
  outboundFilelist: [],
  visible_event_wrapper_id: -1
}

const UtilsReducer = (state = intialState, action) => {

  switch (action.type) {

    case types.ADD_NOTIFICATION:
      return Object.assign({}, state, {notification: {
        message: action.message,
        level: action.level
      }})

    case types.APPEND_FILES_TO_OUTBOUND:
      return Object.assign({}, state, {outboundFilelist: [...state.outboundFilelist, ...action.payLoad.filter(x => state.outboundFilelist.indexOf(x) == -1)]})

    case types.REMOVE_FILES_FROM_OUTBOUND:
      return Object.assign({}, state, {outboundFilelist: state.outboundFilelist.filter(x => action.payLoad.indexOf(x) == -1)})

    case types.RESET_OUTBOUND_FILES:
      return Object.assign({}, state, {outboundFilelist: []})

    case types.UPDATE_FILES_TO_OUTBOUND:
      return Object.assign({}, state, {outboundFilelist: action.payLoad})

    case types.TOGGLE_EXPANDABLE_FOR_EVENT_WRAPPER:
      return Object.assign({}, state, {visible_event_wrapper_id: (state.visible_event_wrapper_id == action.payLoad) ? -1 : action.payLoad})

    default:
      return state
  }
}

export default UtilsReducer
