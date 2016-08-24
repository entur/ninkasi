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
  filteredLoggedEvents: [],
  activePageIndex: 0,
  activeChouettePageIndex: 0,
  activeTab: 'migrateData',
  eventListSortOrder: {
    property: "firstEvent",
    sortOrder: 0 // 0 = asc, 1 = desc
  },
  chouetteListAllSortOrder: {
    property: "id",
    sortOrder: 0
  },
  chouetteListSortOrder: {
    property: "id",
    sortOrder: 0
  }
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

    case types.SET_ACTIVE_PAGE_INDEX:
      return Object.assign({}, state, {activePageIndex: action.payLoad})

    case types.SET_ACTIVE_CHOUTTE_PAGE_INDEX:
      return Object.assign({}, state, {activeChouettePageIndex: action.payLoad})

    case types.SET_ACTIVE_TAB:
      return Object.assign({}, state, {activeTab: action.payLoad})

    case types.SORT_EVENTLIST_BY_COLUMN:
      let eventsSortOrder = 0

      if (state.eventListSortOrder.property == action.payLoad) {
        eventsSortOrder = state.eventListSortOrder.sortOrder == 1 ? 0 : 1
      }

      console.log("eventsSortOrder", eventsSortOrder)

      return Object.assign({}, state, {eventListSortOrder: {property: action.payLoad, sortOrder: eventsSortOrder} })

    case types.SORT_CHOUETTE_ALL_BY_COLUMN:
      let chouetteAllSortOrder = 0

      if (state.chouetteListAllSortOrder.property == action.payLoad) {
        chouetteAllSortOrder = state.chouetteListAllSortOrder.sortOrder >= 1 ? 0 : 1
      }

      return Object.assign({}, state, {chouetteListAllSortOrder: {property: action.payLoad, sortOrder: chouetteAllSortOrder} })

    case types.SORT_CHOUETTE_BY_COLUMN:
      let chouetteSortOrder = 0

      if (state.chouetteListSortOrder.property == action.payLoad) {
        chouetteSortOrder = state.chouetteListSortOrder.sortOrder >= 1 ? 0 : 1
      }

      return Object.assign({}, state, {chouetteListSortOrder: {property: action.payLoad, sortOrder: chouetteSortOrder} })


    default:
      return state
  }
}

export default UtilsReducer
