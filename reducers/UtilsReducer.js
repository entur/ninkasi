import * as types from './../actions/actionTypes'

import moment from 'moment'

const supplierFormDefault = {
  name: "",
  sftpAccount: "",
  chouetteInfo: {
    prefix: "",
    referential: "",
    organisation: "",
    user: "",
    regtoppVersion: "",
    regtoppCoordinateProjection: "",
    regtoppCalendarStrategy: "",
    dataFormat: "",
    enableValidation: false,
    migrateDataToProvider: null
  }
}

const intialState = {
  shouldUpdateProvider: false,
  editProviderModal: false,
  outboundFilelist: [],
  expandedEvents: [],
  isModalOpen: false,
  loggedEvents: [],
  loggedEventsFilter: '',
  filteredLoggedEvents: [],
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
  },
  supplierForm: {...supplierFormDefault}
}

const filterHelper = (loggedEvents, loggedEventsFilter) => {
  return loggedEvents.filter( item => {
    return item.title.toLowerCase().indexOf(loggedEventsFilter.toLowerCase()) > -1
  })
}

const eventHelper = (event, loggedEvents) => {
  event.id = loggedEvents.length+1
  const nowDate = moment().locale("nb").format("Do MMMM HH:mm:ss")
  event.date = nowDate
  event.title = `${nowDate}: ${event.title}`
  return event
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
      return Object.assign({}, state, {expandedEvents: toggleExpandedEvents(action.payLoad, state.expandedEvents)} )

    case types.OPEN_MODAL_DIALOG:
      return Object.assign({}, state, { isModalOpen: true, filteredLoggedEvents: state.loggedEvents })

    case types.DISMISS_MODAL_DIALOG:
      return Object.assign({}, state, {isModalOpen: false})

    case types.DISMISS_EDIT_PROVIDER_DIALOG:
      return Object.assign({}, state, {editProviderModal: false})

    case types.OPENED_EDIT_PROVIDER_DIALOG:
      return Object.assign({}, state, {shouldUpdateProvider: true, editProviderModal: true})

    case types.OPENED_NEW_PROVIDER_DIALOG:
      return Object.assign({}, state, {shouldUpdateProvider: false, supplierForm: supplierFormDefault, editProviderModal: true})

    case types.LOG_EVENT:
      const event = eventHelper(action.payLoad, state.loggedEvents)
      return Object.assign({}, state, {loggedEvents: state.loggedEvents.concat(event)})

    case types.LOG_EVENT_FILTER:
      return Object.assign({}, state, {logEventFilter: action.payLoad, filteredLoggedEvents: filterHelper(state.loggedEvents, action.payLoad)})

    case types.SET_ACTIVE_TAB:
      return Object.assign({}, state, {activeTab: action.payLoad})

    case types.SUCCESS_FETCH_PROVIDER:
      return Object.assign({}, state, {supplierForm: action.payLoad})

    case types.SORT_EVENTLIST_BY_COLUMN:
      let eventsSortOrder = 0

      if (state.eventListSortOrder.property == action.payLoad) {
        eventsSortOrder = state.eventListSortOrder.sortOrder == 1 ? 0 : 1
      }

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

    case types.UPDATED_SUPPLIER_FORM:
      return Object.assign({}, state, {supplierForm: createUpdatedSupplierFormObject(state.supplierForm, action.payLoad) } )


    default:
      return state
  }
}

const toggleExpandedEvents = (index, expanded) => {
  if (expanded.indexOf(index) === -1)
    return expanded.concat(index)

  return expanded.filter( (item) => item != index)
}

const createUpdatedSupplierFormObject = (original, change) => {
  let updatedObject = Object.assign({}, original)

  if (change.key === "name" || change.key === 'sftpAccount') {
    updatedObject[change.key] = change.value
  } else {
    updatedObject.chouetteInfo[change.key] = change.value
  }

   return updatedObject
}


export default UtilsReducer
