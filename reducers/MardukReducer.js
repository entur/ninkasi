import * as types from './../actions/actionTypes'

const cleanSlate = {
  filenames: {
    isLoading: false
  },
  isLoading: false,
  data: [],
  chouetteJobStatus: [],
  chouetteAllJobStatus: [],
  chouetteJobFilter: {
    SCHEDULED: true,
    RESCHEDULED: true,
    STARTED: true,
    TERMINATED: false,
    ABORTED: false,
    CANCELED: false
  },
  chouetteJobAllFilter: {
    SCHEDULED: true,
    RESCHEDULED: true,
    STARTED: true,
    TERMINATED: false,
    ABORTED: false,
    CANCELED: false
  },
  actionFilter: "",
  actionAllFilter: "",
  requesting_chouette_job: false,
  requesting_chouette_all_job: false,
}


const MardukReducer = (state = cleanSlate, action) => {

  switch(action.type) {

    case types.ERROR_IMPORT_DATA:
      return Object.assign({}, state, {isLoading: false, import_data: action.payLoad, error: true})

    case types.SUCCESS_IMPORT_DATA:
      return Object.assign({}, state, {isLoading: false, import_data: action.payLoad, error: false })

    case types.REQUEST_IMPORT_DATA:
      return Object.assign({}, state, {isLoading: true, error: false })

    case types.ERROR_EXPORT_DATA:
      return Object.assign({}, state, {isLoading: false, export_data: action.payLoad, error: true})

    case types.SUCCESS_EXPORT_DATA:
      return Object.assign({}, state, {isLoading: false, export_data: action.payLoad, error: false })

    case types.REQUEST_EXPORT_DATA:
      return Object.assign({}, state, {isLoading: true, error: false })

    case types.ERROR_TRANSFER_DATA:
      return Object.assign({}, state, {isLoading: false, transfer_data: action.payLoad, error: true})

    case types.SUCCESS_TRANSFER_DATA:
      return Object.assign({}, state, {isLoading: false, transfer_data: action.payLoad, error: false })

    case types.REQUEST_TRANSFER_DATA:
      return Object.assign({}, state, {isLoading: true, error: false })

    case types.ERROR_DELETE_DATA:
      return Object.assign({}, state, {isLoading: false, delete_data: action.payLoad, error: true})

    case types.SUCCESS_DELETE_DATA:
      return Object.assign({}, state, {isLoading: false, delete_data: action.payLoad, error: false})

    case types.REQUEST_DELETE_DATA:
      return Object.assign({}, state, {isLoading: true, error: false})

    case types.ERROR_BUILD_GRAPH:
      return Object.assign({}, state, {isLoading: false, build_graph: action.payLoad, error: true})

    case types.SUCCESS_BUILD_GRAPH:
      return Object.assign({}, state, {isLoading: false, build_graph: action.payLoad, error: false})

    case types.REQUEST_BUILD_GRAPH:
      return Object.assign({}, state, {isLoading: true, error: false})

    case types.ERROR_FETCH_OSM:
      return Object.assign({}, state, {isLoading: false, fetch_osm: action.payLoad, error: true})

    case types.SUCCESS_FETCH_OSM:
      return Object.assign({}, state, {isLoading: false, fetch_osm: action.payLoad, error: false})

    case types.REQUEST_FETCH_OSM:
      return Object.assign({}, state, {isLoading: true, error: false})

    case types.ERROR_UPLOAD_GOOGLE_PRODUCTION:
      return Object.assign({}, state, {isLoading: false, upload_google_production: action.payLoad, error: true})

    case types.SUCCESS_UPLOAD_GOOGLE_PRODUCTION:
      return Object.assign({}, state, {isLoading: false, upload_google_production: action.payLoad, error: false})

    case types.REQUEST_UPLOAD_GOOGLE_PRODUCTION:
      return Object.assign({}, state, {isLoading: true, error: false})

    case types.ERROR_UPLOAD_GOOGLE_QA:
      return Object.assign({}, state, {isLoading: false, upload_google_qa: action.payLoad, error: true})

    case types.SUCCESS_UPLOAD_GOOGLE_QA:
      return Object.assign({}, state, {isLoading: false, upload_google_qa: action.payLoad, error: false})

    case types.REQUEST_UPLOAD_GOOGLE_QA:
      return Object.assign({}, state, {isLoading: true, error: false})

    case types.ERROR_VALIDATE_PROVIDER:
      return Object.assign({}, state, {isLoading: false, validate_provider: action.payLoad, error: true})

    case types.SUCCESS_VALIDATE_PROVIDER:
      return Object.assign({}, state, {isLoading: false, validate_provider: action.payLoad, error: false})

    case types.REQUEST_FILENAMES:
      return Object.assign({}, state, {filenames: { isLoading: true, error: false}} )

    case types.SUCCESS_FILENAMES:
      return Object.assign({}, state, {filenames: {isLoading: false, data: action.payLoad, error: false}})

    case types.ERROR_FILENAMES:
      return Object.assign({}, state, {filesnames: {isLoading: false, error: action.payLoad}})

    case types.SUCCESS_CHOUETTE_JOB_STATUS:
      return Object.assign({}, state, {requesting_chouette_job: false, chouetteJobStatus: action.payLoad})

    case types.SUCCESS_ALL_CHOUETTE_JOB_STATUS:
      return Object.assign({}, state, {requesting_chouette_all_job: false, chouetteAllJobStatus: action.payLoad})

    case types.TOGGLE_CHOUETTE_INFO_CHECKBOX_FILTER:
      let chouetteJobFilter = {...state.chouetteJobFilter}
      chouetteJobFilter[action.payLoad.option] = action.payLoad.value
      return Object.assign({}, state, {chouetteJobFilter: chouetteJobFilter})

    case types.TOGGLE_CHOUETTE_INFO_CHECKBOX_ALL_FILTER:
      let chouetteJobAllFilter = {...state.chouetteJobAllFilter}
      chouetteJobAllFilter[action.payLoad.option] = action.payLoad.value
      return Object.assign({}, state, {chouetteJobAllFilter: chouetteJobAllFilter})

    case types.SET_ACTIVE_ACTION_FILTER:
      return Object.assign({}, state, {actionFilter: action.payLoad})

    case types.SET_ACTIVE_ACTION_ALL_FILTER:
      return Object.assign({}, state, {actionAllFilter: action.payLoad})

    case types.REQUESTED_CHOUETTE_JOBS_FOR_PROVIDER:

      if (state.chouette_cancel_token) {
        let cancelToken = state.chouette_cancel_token
        cancelToken('Operation canceled by new request.')
      }

      return Object.assign({}, state, {requesting_chouette_job: true, chouette_cancel_token: action.payLoad})

    case types.REQUESTED_ALL_CHOUETTE_JOB_STATUS:

      if (state.chouette_cancel_all_token) {
        let cancelAllToken = state.chouette_cancel_all_token
        cancelAllToken('Operation canceled by new request')
      }

      return Object.assign({}, state, {requesting_chouette_all_job: true, chouette_cancel_all_token: action.payLoad})


    case types.SELECTED_ALL_SUPPLIERS:
      return Object.assign({}, state, {chouette_cancel_all_token: null, chouette_cancel_token: null})

    default:
      return state
  }
}

export default MardukReducer
