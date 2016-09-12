import * as types from './../actions/actionTypes'

const initialState = {
  data: [],
  statusList: [],
  all_suppliers_selected: true,
  activeId: 0
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

    default:
      return state
  }
}

export default SuppliersReducer
