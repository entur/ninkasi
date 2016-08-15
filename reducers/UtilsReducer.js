import * as types from './../actions/actionTypes'
import {reducer as formReducer} from 'redux-form'

import moment from 'moment'


const eventHelper = (event, loggedEvents) => {

  event.id = loggedEvents.length+1

  const nowDate = moment().locale("nb").format("Do MMMM HH:mm:ss")

  event.date = nowDate
  event.title = `${nowDate}: ${event.title}`

  return event

}

const intialState = {
  outboundFilelist: [],
  visible_event_wrapper_id: -1,
  isModalOpen: false,
  loggedEvents: [],
  loggedEventsFilter: '',
  filteredLoggedEvents: []
}

const filterHelper = (loggedEvents, loggedEventsFilter) => {
  return loggedEvents.filter( item => {
    return item.title.toLowerCase().indexOf(loggedEventsFilter.toLowerCase()) > -1
  })
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

    case types.OPEN_MODAL_DIALOG:
      return Object.assign({}, state, {isModalOpen: true, filteredLoggedEvents: state.loggedEvents})

    case types.DISMISS_MODAL_DIALOG:
      return Object.assign({}, state, {isModalOpen: false})

    case types.LOG_EVENT:
      const event = eventHelper(action.payLoad, state.loggedEvents)
      return Object.assign({}, state, {loggedEvents: state.loggedEvents.concat(event)})

    case types.LOG_EVENT_FILTER:
      return Object.assign({}, state, {logEventFilter: action.payLoad, filteredLoggedEvents: filterHelper(state.loggedEvents, action.payLoad)})

    default:
      return state
  }
}

export default UtilsReducer
