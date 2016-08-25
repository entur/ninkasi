import axios from 'axios'
import * as types from './actionTypes'
import debounce from 'debounce'

import moment from 'moment'

var SuppliersActions = {}


SuppliersActions.getProviderStatus = (id) => {

  const url = `${window.config.nabuBaseUrl}jersey/jobs/${id}`

  return function(dispatch) {
    dispatch(sendData(null, types.REQUEST_SUPPLIER_STATUS) )
    return axios({
      url: url,
      timeout: 20000,
      method: 'get',
      responseType: 'json'
    })
    .then(function(response) {
      SuppliersActions.formatProviderStatusDate(response.data.reverse())
      dispatch( sendData(response.data,types.RECEIVED_SUPPLIER_STATUS) )
    })
    .catch(function(response){
      dispatch( sendData(response.data, types.ERROR_SUPPLIER_STATUS) )
    })
  }
}

SuppliersActions.selectAllSuppliers = () => {
  return {
    type: types.SELECT_ALL_SUPPLIERS
  }
}

SuppliersActions.unselectAllSuppliers = () => {
  return {
    type: types.UNSELECT_ALL_SUPPLIERS
  }
}

function sendData(payLoad, type) {
  return {
    payLoad: payLoad,
    type: type
  }
}

SuppliersActions.fetchSuppliers = () => {

  const url = window.config.nabuBaseUrl+'jersey/providers/all'

  return function(dispatch) {
    dispatch( sendData(null,types.REQUEST_SUPPLIERS) )
    return axios({
      url: url,
      timeout: 20000,
      method: 'get',
      responseType: 'json'
    })
    .then(function(response) {
      dispatch( sendData(response.data, types.RECEIVED_SUPPLIERS) )
    })
    .catch(function(response){
      dispatch( sendData(response.data, types.ERROR_SUPPLIERS) )
    })
  }
}


SuppliersActions.deleteProvider = (id) => {

  const url = `${window.config.nabuBaseUrl}jersey/providers/${id}`

  return function(dispatch) {
    return axios({
      url: url,
      timeout: 20000,
      method: 'delete'
    })
    .then(function(response) {
      dispatch( sendData(response.data, types.SUCCESS_DELETE_PROVIDER ))
      dispatch(SuppliersActions.addNotification('Provider deleted', 'success'))
      dispatch(SuppliersActions.logEvent({title: `Deleted provider ${id} successfully`}))
      dispatch(SuppliersActions.selectActiveSupplier(0))
      dispatch(SuppliersActions.fetchSuppliers())
    })
    .catch(function(response) {
      dispatch( sendData(response.data, types.ERROR_DELETE_PROVIDER) )
      dispatch(SuppliersActions.addNotification('Unable to delete provider', 'error'))
      dispatch(SuppliersActions.logEvent({title: `Deleting provider ${id} failed`}))
    })
  }
}

SuppliersActions.refreshSupplierData = () => {
  return function(dispatch, getState) {
    const state = getState()
    const { activeId } = state.SuppliersReducer
    dispatch(SuppliersActions.selectActiveSupplier(activeId))
    dispatch(SuppliersActions.fetchFilenames(activeId))
    dispatch(SuppliersActions.getProviderStatus(activeId))
    dispatch(SuppliersActions.getChouetteJobStatus())
  }
}


SuppliersActions.createProvider = (provider) => {

  const url = `${window.config.nabuBaseUrl}jersey/providers/create`

  return function(dispatch) {
    return axios.post(url, provider)
    .then(function(response) {
      dispatch( sendData(response.data, types.SUCCESS_CREATE_PROVIDER))
      dispatch(SuppliersActions.addNotification('Provider created', 'success'))
      dispatch(SuppliersActions.logEvent({title: 'New provider created'}))
    })
    .catch(function(response) {
      dispatch( sendData(response.data, types.ERROR_CREATE_PROVIDER) )
      dispatch(SuppliersActions.addNotification('Unable to create provider', 'error'))
      dispatch(SuppliersActions.logEvent({title: 'Creating new provider failed'}))
    })
  }
}

SuppliersActions.updateProvider = (provider) => {

  const url = `${window.config.nabuBaseUrl}jersey/providers/update`

  return function(dispatch) {
    return axios.put(url, provider)
    .then(function(response) {
      dispatch( sendData(response.data, types.SUCCESS_UPDATE_PROVIDER) )
      dispatch(SuppliersActions.addNotification('Updated provider successfully', 'success'))
      dispatch(SuppliersActions.logEvent({title: `Updated provider ${provider.id} successfully`}))
    })
    .catch(function(response) {
      dispatch( sendData(response.data, types.ERROR_UPDATE_PROVIDER ))
      dispatch(SuppliersActions.addNotification('Unable to update provider', 'error'))
      dispatch(SuppliersActions.logEvent({title: `Updating provider ${provider.id} failed`}))
    })
  }
}

SuppliersActions.fetchProvider = (id) => {

  const url = `${window.config.nabuBaseUrl}jersey/providers/${id}`

  return function(dispatch) {
    return axios.get(url)
    .then(function(response) {
      dispatch( sendData(response.data, types.SUCCESS_FETCH_PROVIDER ))
    })
    .catch(function(response) {
      dispatch( sendData(response.data, types.ERROR_FETCH_PROVIDER) )
      dispatch(SuppliersActions.addNotification('Unable to fetch provider', 'error'))
    })
  }
}


SuppliersActions.selectActiveSupplier = (id) => {

  return function(dispatch) {
    dispatch(SuppliersActions.changeActiveSupplierId(id))
    dispatch(SuppliersActions.restoreFilesToOutbound())
    dispatch(SuppliersActions.fetchFilenames(id))
    dispatch(SuppliersActions.setActiveActionFilter(""))
    dispatch(SuppliersActions.unselectAllSuppliers())
  }
}


SuppliersActions.changeActiveSupplierId = (id) => {
  return {
    type: types.SELECT_SUPPLIER,
    payLoad: id
  }
}

/* marduk actions */

SuppliersActions.cancelChouetteJobForProvider = (providerId, chouetteId) => {
  const url = window.config.mardukBaseUrl+`admin/services/chouette/${providerId}/jobs/${chouetteId}`

  return function (dispatch) {
    return axios({
      url: url,
      timeout: 20000,
      method: 'delete'
    })
    .then(function (response) {
      dispatch( sendData(response.data, types.SUCCESS_DELETE_PROVIDERS_CHOUETTE_JOB) )
      dispatch(SuppliersActions.addNotification(`Cancelled chouettejob with id ${chouetteId}`, 'success'))
      dispatch(SuppliersActions.logEvent({title: `Chouette job with ${chouetteId} successfully cancelled for provider ${providerId}`}))

    })
    .catch(function (response) {
      dispatch( sendData(response.data, types.ERROR_DELETE_PROVIDERS_CHOUETTE_JOB) )
      dispatch(SuppliersActions.addNotification(`Unable to cancel chouettejob with id ${chouetteId}`, 'error'))
      dispatch(SuppliersActions.logEvent({title: `Unable to cancel chouette job with id ${chouetteId} for provider ${providerId}`}))
    })
  }
}

SuppliersActions.cancelAllChouetteJobsforProvider = (providerId) => {
  const url = window.config.mardukBaseUrl+`admin/services/chouette/${providerId}/jobs`

  return function (dispatch) {
    return axios({
      url: url,
      timeout: 20000,
      method: 'delete'
    })
    .then(function (response) {
      dispatch( sendData(response.data, types.SUCCESS_DELETE_ALL_PROVIDERS_CHOUETTE_JOB))
      dispatch(SuppliersActions.addNotification(`Deleted all chouttejobs for provider ${providerId}`, 'success'))
      dispatch(SuppliersActions.logEvent({title: `All chouette jobs for provider ${providerId} successfully  cancelled `}))
    })
    .catch(function (response) {
      dispatch( sendData(response.data, types.ERROR_DELETE_ALL_PROVIDERS_CHOUETTE_JOB) )
      dispatch(SuppliersActions.addNotification(`Failed deleting all chouttejobs for provider ${providerId}`, 'error'))
      dispatch(SuppliersActions.logEvent({title: `Unable to cancel chouette jobs for provider ${providerId}`}))
    })
  }
}


SuppliersActions.setActiveActionFilter = (value) => {
  return function(dispatch) {
    dispatch( sendData(value, types.SET_ACTIVE_ACTION_FILTER) )
    dispatch(SuppliersActions.getChouetteJobStatus())
  }

}

SuppliersActions.setActiveActionAllFilter = (value) => {
  return function(dispatch) {
    dispatch( sendData(value, types.SET_ACTIVE_ACTION_ALL_FILTER) )
    dispatch(SuppliersActions.getChouetteJobsForAllSuppliers())
  }
}


SuppliersActions.formatChouetteJobsWithDate = (jobs) => {

  return jobs.map( (job) => {

    job.created = moment(job.created).locale("nb").format("YYYY-MM-DD HH:mm:ss")
    job.started = moment(job.started).locale("nb").format("YYYY-MM-DD HH:mm:ss")
    job.updated = moment(job.updated).locale("nb").format("YYYY-MM-DD HH:mm:ss")

    return job

  })

  return jobs

}

SuppliersActions.setActiveChouettePageIndex = (index) => {
  return {
    type: types.SET_ACTIVE_CHOUTTE_PAGE_INDEX,
    payLoad: index
  }
}

SuppliersActions.getChouetteJobsForAllSuppliers = () => {

  return debounce(function(dispatch, getState) {

    const state = getState()
    const {chouetteJobAllFilter, actionAllFilter} = state.MardukReducer

    let queryString = ''

    for(let [key, value] of Object.entries(chouetteJobAllFilter)) {
      if (value)
      queryString += `&status=${key}`
    }

    if (actionAllFilter && actionAllFilter.length) {
      queryString += `&action=${actionAllFilter}`
    }

    const url = window.config.mardukBaseUrl+`admin/services/chouette/jobs?${queryString}`

    dispatch( sendData(null, types.REQUEST_CHOUETTE_JOBS_FOR_ALL_PROVIDERS) )

    return axios({
      url: url,
      timeout: 20000,
      method: 'get'
    })
    .then(function(response) {

      let jobs = response.data
      var allJobs = []

      if (jobs.length) {
        jobs.forEach( (job) => {
          if (job.pendingJobs) {
            job.pendingJobs.forEach ( (pendingJob) => {
              pendingJob.providerId = job.providerId
              pendingJob.created = moment(pendingJob.created).locale("nb").format("Do MMMM YYYY, HH:mm:ss")
              pendingJob.started = moment(pendingJob.started).locale("nb").format("Do MMMM YYYY, HH:mm:ss")
              pendingJob.updated = moment(pendingJob.updated).locale("nb").format("Do MMMM YYYY, HH:mm:ss")
              allJobs.push(pendingJob)
            })
          }
        })
      }

      allJobs = allJobs.reverse()
      dispatch( sendData(allJobs, types.SUCCESS_ALL_CHOUETTE_JOB_STATUS) )
    })
    .catch(function(response){
      dispatch( sendData(response.data, types.ERROR_ALL_CHOUETTE_JOB_STATUS) )
    })
  }, 300, false)
}

SuppliersActions.getChouetteJobStatus = () => {

  return debounce(function(dispatch, getState) {

    const state = getState()

    const {chouetteJobFilter, actionFilter} = state.MardukReducer

    const {activeId} = state.SuppliersReducer

    let queryString = ''

    for(let [key, value] of Object.entries(chouetteJobFilter)) {
      if (value)
      queryString += `&status=${key}`
    }

    if (actionFilter && actionFilter.length) {
      queryString += `&action=${actionFilter}`
    }

    if (queryString.length) {
      queryString = queryString.substring(1)
    }

    const url = window.config.mardukBaseUrl+`admin/services/chouette/${activeId}/jobs?${queryString}`

    dispatch( sendData(null, types.REQUEST_CHOUETTE_JOBS_FOR_PROVIDER) )

    return axios({
      url: url,
      timeout: 20000,
      method: 'get'
    })
    .then(function(response) {
      const jobs = SuppliersActions.formatChouetteJobsWithDate(response.data.reverse())
      dispatch( sendData(jobs, types.SUCCESS_CHOUETTE_JOB_STATUS) )
    })
    .catch(function(response){
      dispatch( sendData(response.data, types.ERROR_CHOUETTE_JOB_STATUS) )
    })
  }, 300, false)

}


SuppliersActions.exportData = (id) => {

  const url = window.config.mardukBaseUrl+`admin/services/chouette/${id}/export`

  return function(dispatch) {
    dispatch(requestExport())
    return axios({
      url: url,
      timeout: 20000,
      method: 'post'
    })
    .then(function(response) {
      dispatch( sendData(response.data, types.SUCESS_EXPORT_DATA) )
      dispatch(SuppliersActions.addNotification('Export started', 'success'))
      dispatch(SuppliersActions.logEvent({title: `Exported data for provider ${id}`}))
    })
    .catch(function(response){
      dispatch( sendData(response.data, types.ERROR_EXPORT_DATA) )
      dispatch(SuppliersActions.addNotification('Export failed', 'error'))
      dispatch(SuppliersActions.logEvent({title: `Export failed for provider ${id}`}))
    })
  }
}

SuppliersActions.fetchFilenames = (id) => {

  const url = window.config.mardukBaseUrl+`admin/services/chouette/${id}/files`

  return function(dispatch) {
    dispatch(requestFilenames())
    return axios({
      url: url,
      timeout: 20000,
      method: 'get'
    })
    .then(function(response) {
      dispatch( sendData(response.data,types.SUCCESS_FILENAMES) )
    })
    .catch(function(response) {
      dispatch( sendData(response.data, types.ERROR_FILENAMES) )
    })
  }
}


SuppliersActions.importData = (id, selectedFiles) => {

  const url = window.config.mardukBaseUrl+`admin/services/chouette/${id}/import`

  const bodySelectedFiles = selectedFiles.map(file => { return {"name": file }})

  return function(dispatch) {
    dispatch(requestImport())
    return axios.post(url, {files: bodySelectedFiles})
    .then(function(response) {
      dispatch( sendData(response.data, types.SUCCESS_IMPORT_DATA) )
      dispatch(SuppliersActions.addNotification('Import started', 'success'))
      dispatch(SuppliersActions.logEvent({title: `Imported data for provider ${id}`}))
    })
    .catch(function(response){
      dispatch( sendData(response.data, types.ERROR_IMPORT_DATA) )
      dispatch(SuppliersActions.addNotification('Import failed', 'error'))
      dispatch(SuppliersActions.logEvent({title: `Import failed for provider ${id}`}))
    })
  }
}

SuppliersActions.cleanDataspace = (id) => {

  const url = window.config.mardukBaseUrl+`admin/services/chouette/${id}/clean`

  return function(dispatch) {
    dispatch(requestCleanDataspace())
    return axios({
      url: url,
      timeout: 20000,
      method: 'post'
    })
    .then(function(response) {
      dispatch( sendData(response.data, types.SUCCESS_DELETE_DATA) )
      dispatch(SuppliersActions.addNotification('Cleaning of dataspace started', 'success'))
      dispatch(SuppliersActions.logEvent({title: `Cleaned data space for provider ${id}`}))
    })
    .catch(function(response){
      dispatch( sendData(response.data, types.ERROR_DELETE_DATA) )
      dispatch(SuppliersActions.addNotification('Cleaning of dataspace failed', 'error'))
      dispatch(SuppliersActions.logEvent({title: `Cleaning data space failed for provider ${id}`}))
    })
  }
}


SuppliersActions.validateProvider = (id) => {

  const url = window.config.mardukBaseUrl+`admin/services/chouette/${id}/validate`

  return function(dispatch) {
    dispatch(requestCleanDataspace())
    return axios({
      url: url,
      timeout: 20000,
      method: 'post'
    })
    .then(function(response) {
      dispatch( sendData(response.data, types.SUCCESS_VALIDATE_PROVIDER))
      dispatch(SuppliersActions.addNotification('Validation started', 'success'))
      dispatch(SuppliersActions.logEvent({title: `Validated, imported and exported data for provider ${id} successfully`}))
    })
    .catch(function(response){
      dispatch( sendData(response.data, types.ERROR_VALIDATE_PROVIDER) )
      dispatch(SuppliersActions.addNotification('Validation failed', 'error'))
      dispatch(SuppliersActions.logEvent({title: `Validating, importing and exporting data for provider ${id} failed`}))
    })
  }
}


SuppliersActions.buildGraph = () => {
  const url = window.config.mardukBaseUrl+'admin/services/graph/build'

  return function(dispatch) {
    dispatch(requestBuildGraph())
    return axios({
      url: url,
      timeout: 20000,
      method: 'post'
    })
    .then(function(response) {
      dispatch( sendData(response.data, types.SUCCESS_BUILD_GRAPH))
      dispatch(SuppliersActions.addNotification('Graph build started', 'success'))
      dispatch(SuppliersActions.logEvent({title: 'Graph build started'}))
    })
    .catch(function(response){
      dispatch( sendData(response.data, types.ERROR_BUILD_GRAPH) )
      dispatch(SuppliersActions.addNotification('Graph build failed', 'error'))
      dispatch(SuppliersActions.logEvent({title: 'Graph build failed'}))
    })
  }
}

SuppliersActions.fetchOSM = () => {
  const url = window.config.mardukBaseUrl+'admin/services/fetch/osm'

  return function(dispatch) {
    dispatch(requestFetchOSM())
    return axios({
      url: url,
      timeout: 20000,
      method: 'post'
    })
    .then(function(response) {
      dispatch( sendData(response.data, types.SUCCESS_FETCH_OSM) )
      dispatch(SuppliersActions.addNotification('OSM update started', 'success'))
      dispatch(SuppliersActions.logEvent({title: 'OSM update started'}))
    })
    .catch(function(response){
      dispatch( sendData(response.data, types.ERROR_FETCH_OSM) )
      dispatch(SuppliersActions.addNotification('OSM update failed', 'error'))
      dispatch(SuppliersActions.logEvent({title: 'OSM update failed'}))
    })
  }
}

SuppliersActions.sortListByColumn = (listName, columnName) => {
  return function(dispatch) {
    switch (listName) {
      case "events":
        dispatch(SuppliersActions.sortEventlistByColumn(columnName))
      break
      case "chouetteAll":
        dispatch(SuppliersActions.sortChouetteAllByColumn(columnName))
        break
      case "chouette":
        dispatch(SuppliersActions.sortChouetteByColumn(columnName))
        break
      default:
    }
  }
}

SuppliersActions.sortEventlistByColumn = (columnName) => {
  return {
    type: types.SORT_EVENTLIST_BY_COLUMN,
    payLoad: columnName
  }
}

SuppliersActions.sortChouetteAllByColumn = (columnName) => {
  return {
    type: types.SORT_CHOUETTE_ALL_BY_COLUMN,
    payLoad: columnName
  }
}

SuppliersActions.sortChouetteByColumn = (columnName) => {
  return {
    type: types.SORT_CHOUETTE_BY_COLUMN,
    payLoad: columnName
  }
}

function requestBuildGraph() {
  return {type: types.REQUEST_BUILD_GRAPH}
}

function requestFetchOSM() {
  return {type: types.REQUEST_FETCH_OSM}
}

function requestCleanDataspace() {
  return {type: types.REQUEST_DELETE_DATA}
}

function requestImport() {
  return {type: types.REQUEST_IMPORT_DATA}
}

function requestExport() {
  return {type: types.REQUEST_EXPORT_DATA}
}

function requestFilenames() {
  return {type: types.REQUEST_FILENAMES}
}


SuppliersActions.toggleChouetteInfoCheckboxFilter = (option, value) => {
  return function(dispatch) {
    dispatch( sendData({option: option,	value: value }, types.TOGGLE_CHOUETTE_INFO_CHECKBOX_FILTER) )
    dispatch(SuppliersActions.getChouetteJobStatus())
  }
}

SuppliersActions.toggleChouetteInfoCheckboxAllFilter = (option, value) => {
  return function (dispatch) {
    dispatch( sendData({option: option, value: value}, types.TOGGLE_CHOUETTE_INFO_CHECKBOX_ALL_FILTER) )
    dispatch(SuppliersActions.getChouetteJobsForAllSuppliers())
  }
}

SuppliersActions.formatProviderStatusDate = (list) => {

  return list.map( (listItem) => {

    listItem.duration = moment(moment(listItem.lastEvent).diff(moment(listItem.firstEvent))).locale("nb").utc().format("HH:mm:ss")
    listItem.firstEvent = moment(listItem.firstEvent).locale("nb").format("YYYY-MM-DD HH:mm:ss")
    listItem.lastEvent = moment(listItem.lastEvent).locale("nb").format("YYYY-MM-DD HH:mm:ss")

    listItem.events.forEach(function (event) {
      event.date = moment(event.date).locale("nb").format("YYYY-MM-DD HH:mm:ss")
    })

    return listItem
  })

}

SuppliersActions.setActiveTab = (value) => {
  return {type: types.SET_ACTIVE_TAB, payLoad: value}
}

SuppliersActions.restoreFilesToOutbound = () => {
  return {
    type: types.RESET_OUTBOUND_FILES
  }
}

SuppliersActions.logEventFilter = (filter) => {
  return {
    type: types.LOG_EVENT_FILTER,
    payLoad: filter
  }
}

SuppliersActions.updateOutboundFilelist = (files) => {
  return {
    type: types.UPDATE_FILES_TO_OUTBOUND,
    payLoad: files
  }
}

SuppliersActions.appendFilesToOutbound = (files) => {
  return {
    type: types.APPEND_FILES_TO_OUTBOUND,
    payLoad: files
  }
}

SuppliersActions.removeFilesToOutbound = (files) => {
  return {
    type: types.REMOVE_FILES_FROM_OUTBOUND,
    payLoad: files
  }
}

SuppliersActions.addNotification = (message, level) => {
  return {
    type: types.ADD_NOTIFICATION,
    message,
    level
  }
}

SuppliersActions.toggleExpandableEventsContent = (id) => {
  return {
    type: types.TOGGLE_EXPANDABLE_FOR_EVENT_WRAPPER,
    payLoad: id
  }
}

SuppliersActions.openModalDialog = () => {
  return {
    type: types.OPEN_MODAL_DIALOG
  }
}

SuppliersActions.dismissModalDialog = () => {
  return {
    type: types.DISMISS_MODAL_DIALOG
  }
}

SuppliersActions.logEvent = (event) => {
  return {
    type: types.LOG_EVENT,
    payLoad: event
  }
}

export default SuppliersActions
