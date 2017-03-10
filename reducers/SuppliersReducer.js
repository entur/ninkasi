import * as types from './../actions/actionTypes'

const initialState = {
  data: [],
  statusList: [],
  statusListAllProviders: [],
  all_suppliers_selected: true,
  activeId: 0,
  fileUploadProgress: 0,
  lineStats: {}
}

const SuppliersReducer = (state = initialState, action) => {

  switch (action.type) {

    case types.ERRORS_SUPPLIERS:
      return Object.assign({}, state, {isLoading: false, data: action.payLoad, error: true})
    case types.RECEIVED_SUPPLIERS:
      return Object.assign({}, state, {isLoading: false, data: action.payLoad, error: false })
    case types.REQUESTED_SUPPLIERS:
      return Object.assign({}, state, {isLoading: true, error: false })
    case types.SELECT_SUPPLIER:
      return Object.assign({}, state, {activeId: action.payLoad})
    case types.RECEIVED_SUPPLIER_STATUS:
      return Object.assign({}, state, {SupplierStatusIsLoading: true, statusList: action.payLoad})

    case types.REQUESTED_SUPPLIER_STATUS:
      return Object.assign({}, state, {SupplierStatusIsLoading: false, statusList: action.payLoad})

    case types.SELECTED_ALL_SUPPLIERS:
      return Object.assign({}, state, {activeId: -1, all_suppliers_selected: true})

    case types.UNSELECTED_ALL_SUPPLIERS:
      return Object.assign({}, state, {all_suppliers_selected: false})

    case types.REQUESTED_ALL_SUPPLIERS_STATUS:
      return Object.assign({}, state, { statusListAllProviders: [] })

    case types.RECEIVED_ALL_SUPPLIERS_STATUS:
      return Object.assign({}, state, { statusListAllProviders: state.statusListAllProviders.concat(action.payLoad) })

    case types.UPDATED_FILE_UPLOAD_PROGRESS:
      return Object.assign({}, state, { fileUploadProgress: action.payLoad })

    case types.REQUESTED_LINE_STATS:
      return Object.assign({}, state, { lineStats: {} })

    case types.RECEIVED_LINE_STATS:
      let data = {}
      data[action.payLoad.id] = action.payLoad.data
      return Object.assign({}, state, { lineStats: Object.assign(state.lineStats, data) })

    case types.RECEIVED_GRAPH_STATUS:
      return Object.assign({}, state, { ... action.payLoad })

    default:
      return state
  }
}

export default SuppliersReducer
