import axios from 'axios'
import * as types from './actionTypes'

import moment from 'moment'

var SuppliersActions = {}

/* nabu actions */

function requestData() {
	return {type: types.REQ_DATA}
}

SuppliersActions.formatProviderStatusDate = (list) => {

	return list.map( (listItem) => {

		listItem.duration = listItem.duration || "Not implemented"
		listItem.firstEvent = moment(listItem.firstEvent).locale("nb").format("Do MMMM YYYY, HH:mm:ss")
		listItem.lastEvent = moment(listItem.lastEvent).locale("nb").format("Do MMMM YYYY, HH:mm:ss")

		listItem.events.forEach(function (event) {
			event.date = moment(event.date).locale("nb").format("Do MMMM YYYY, HH:mm:ss")
		})

			return listItem
	})

}

SuppliersActions.getProviderStatus = (id) => {

  const url = `${window.config.nabuBaseUrl}jersey/jobs/${id}`

  return function(dispatch) {
    dispatch(requestData(types.GET_PROVIDER_STATUS))
    return axios({
      url: url,
      timeout: 20000,
      method: 'get',
      responseType: 'json'
    })
    .then(function(response) {
			SuppliersActions.formatProviderStatusDate(response.data.reverse())
      dispatch(receiveData(response.data, types.RECEIVED_PROVIDER_STATUS))
    })
    .catch(function(response){
      dispatch(receiveError(response.data, types.ERROR_PROVIDER_STATUS))
    })
  }
}

SuppliersActions.fetchSuppliers = () => {

	const url = window.config.nabuBaseUrl+'jersey/providers/all'

	return function(dispatch) {
		dispatch(requestData())
		return axios({
			url: url,
			timeout: 20000,
			method: 'get',
			responseType: 'json'
		})
		.then(function(response) {
			dispatch(receiveData(response.data, types.RECV_DATA))
		})
		.catch(function(response){
			dispatch(receiveError(response.data, types.RECV_ERROR))
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
			dispatch(receiveData(response.data, types.SUCCESS_DELETE_PROVIDER))
			dispatch(SuppliersActions.addNotification('Provider deleted', 'success'))
			dispatch(SuppliersActions.logEvent({title: `Deleted provider ${id} successfully`}))
		})
		.catch(function(response) {
			dispatch(receiveError(response.data, types.ERROR_DELETE_PROVIDER))
			dispatch(SuppliersActions.addNotification('Unable to delete provider', 'error'))
			dispatch(SuppliersActions.logEvent({title: `Deleting provider ${id} failed`}))
		})
	}
}

SuppliersActions.createProvider = (provider) => {

	const url = `${window.config.nabuBaseUrl}jersey/providers/create`

	return function(dispatch) {
		return axios.post(url, provider)
		.then(function(response) {
			dispatch(receiveData(response.data, types.SUCCESS_CREATE_PROVIDER))
			dispatch(SuppliersActions.addNotification('Provider created', 'success'))
			dispatch(SuppliersActions.logEvent({title: 'New provider created'}))
		})
		.catch(function(response) {
			dispatch(receiveError(response.data, types.ERROR_CREATE_PROVIDER))
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
			dispatch(receiveData(response.data, types.SUCCESS_UPDATE_PROVIDER))
			dispatch(SuppliersActions.addNotification('Updated provider successfully', 'success'))
			dispatch(SuppliersActions.logEvent({title: `Updated provider ${provider.id} successfully`}))
		})
		.catch(function(response) {
			dispatch(receiveError(response.data, types.ERROR_UPDATE_PROVIDER))
			dispatch(SuppliersActions.addNotification('Unable to update provider', 'error'))
			dispatch(SuppliersActions.logEvent({title: `Updating provider ${provider.id} failed`}))
		})
	}
}

SuppliersActions.resetProvider = (dispatch) => {
	const providerDummy = {
			name:"",
			sftpAccount:"",
			chouetteInfo: {
				prefix: "",
				referential: "",
				organisation: "",
				user: "",
				regtoppVersion: "",
				regtoppCoordinateProjection: "",
				data_format: "",
				regtoppCalendarStrategy: "",
				enable_validation: false
			}
	}
	dispatch(receiveData(providerDummy, types.SUCCESS_FETCH_PROVIDER))
}

SuppliersActions.fetchProvider = (id) => {

	const url = `${window.config.nabuBaseUrl}jersey/providers/${id}`

	return function(dispatch) {
		return axios.get(url)
		.then(function(response) {
			dispatch(receiveData(response.data, types.SUCCESS_FETCH_PROVIDER))
		})
		.catch(function(response) {
			dispatch(receiveError(response.data, types.ERROR_FETCH_PROVIDER))
			dispatch(SuppliersActions.addNotification('Unable to fetch provider', 'error'))
		})
	}
}


SuppliersActions.selectActiveSupplier = (id) => {
	return {
		type: types.SELECT_SUPPLIER,
		payLoad: id
	}
}

/* marduk actions */

SuppliersActions.deleteChouetteJobForProvider = (providerId, chouetteId) => {
	const url = window.config.mardukBaseUrl+`admin/services/chouette/${providerId}/jobs/${chouetteId}`

	return function (dispatch) {
		return axios({
			url: url,
			timeout: 20000,
			method: 'delete'
		})
		.then(function (response) {
			dispatch(receiveData(response.data, types.SUCCESS_DELETE_PROVIDERS_CHOUETTE_JOB))
			dispatch(SuppliersActions.addNotification(`Deleted chouettejob with id ${chouetteId}`, 'success'))
		})
		.catch(function (response) {
			dispatch(receiveData(response.data, types.ERROR_DELETE_PROVIDERS_CHOUETTE_JOB))
			dispatch(SuppliersActions.addNotification(`Unable to delete chouettejob with id ${chouetteId}`, 'error'))
		})
	}
}

SuppliersActions.deleteAllChouetteJobsforProvider = (providerId) => {
	const url = window.config.mardukBaseUrl+`admin/services/chouette/${providerId}/jobs`

	return function (dispatch) {
		return axios({
			url: url,
			timeout: 20000,
			method: 'delete'
		})
		.then(function (response) {
			dispatch(receiveData(response.data, types.SUCCESS_DELETE_ALL_PROVIDERS_CHOUETTE_JOB))
			dispatch(SuppliersActions.addNotification(`Deleted all chouttejobs for provider ${providerId}`, 'success'))
		})
		.catch(function (response) {
			dispatch(receiveData(response.data, types.ERROR_DELETE_ALL_PROVIDERS_CHOUETTE_JOB))
			dispatch(SuppliersActions.addNotification(`Failed deleting all chouttejobs for provider ${providerId}`, 'error'))
		})
	}
}

SuppliersActions.formatChouetteJobsWithDate = (jobs) => {

	return jobs.map( (job) => {

		job.created = moment(job.created).locale("nb").format("Do MMMM YYYY, HH:mm:ss")
		job.started = moment(job.started).locale("nb").format("Do MMMM YYYY, HH:mm:ss")
		job.updated = moment(job.updated).locale("nb").format("Do MMMM YYYY, HH:mm:ss")

		return job

	})

	return jobs

}

SuppliersActions.getChouetteJobStatus = (id) => {

	const url = window.config.mardukBaseUrl+`admin/services/chouette/${id}/jobs?status=SCHEDULED&status=STARTED`

	return function(dispatch) {
		return axios({
			url: url,
			timeout: 20000,
			method: 'get'
		})
		.then(function(response) {
			const jobs = SuppliersActions.formatChouetteJobsWithDate(response.data)
			dispatch(receiveData(jobs, types.SUCCESS_CHOUETTE_JOB_STATUS))
		})
		.catch(function(response){
			dispatch(receiveError(response.data, types.ERROR_CHOUETTE_JOB_STATUS))
		})
	}
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
			dispatch(receiveData(response.data, types.SUCESS_EXPORT_DATA))
			dispatch(SuppliersActions.addNotification('Export started', 'success'))
			dispatch(SuppliersActions.logEvent({title: `Exported data for provider ${id}`}))
		})
		.catch(function(response){
			dispatch(receiveError(response.data, types.ERROR_EXPORT_DATA))
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
			dispatch(receiveData(response.data, types.SUCCESS_FILENAMES))
		})
		.catch(function(response) {
			dispatch(receiveError(response.data, types.ERROR_FILENAMES))
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
			dispatch(receiveData(response.data, types.SUCCESS_IMPORT_DATA))
			dispatch(SuppliersActions.addNotification('Import started', 'success'))
			dispatch(SuppliersActions.logEvent({title: `Imported data for provider ${id}`}))
		})
		.catch(function(response){
			dispatch(receiveError(response.data, types.ERROR_IMPORT_DATA))
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
			dispatch(receiveData(response.data, types.SUCCESS_DELETE_DATA))
			dispatch(SuppliersActions.addNotification('Cleaning of dataspace started', 'success'))
			dispatch(SuppliersActions.logEvent({title: `Cleaned data space for provider ${id}`}))
		})
		.catch(function(response){
			dispatch(receiveError(response.data, types.ERROR_DELETE_DATA))
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
			dispatch(receiveData(response.data, types.SUCCESS_VALIDATE_PROVIDER))
			dispatch(SuppliersActions.addNotification('Validation started', 'success'))
			dispatch(SuppliersActions.logEvent({title: `Validated, imported and exported data for provider ${id} successfully`}))
		})
		.catch(function(response){
			dispatch(receiveError(response.data, types.ERROR_VALIDATE_PROVIDER))
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
			dispatch(receiveData(response.data, types.SUCCESS_BUILD_GRAPH))
			dispatch(SuppliersActions.addNotification('Graph build started', 'success'))
			dispatch(SuppliersActions.logEvent({title: 'Graph build started'}))
		})
		.catch(function(response){
			dispatch(receiveError(response.data, types.ERROR_BUILD_GRAPH))
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
			dispatch(receiveData(response.data, types.SUCCESS_FETCH_OSM))
			dispatch(SuppliersActions.addNotification('OSM update started', 'success'))
			dispatch(SuppliersActions.logEvent({title: 'OSM update started'}))
		})
		.catch(function(response){
			dispatch(receiveError(response.data, types.ERROR_FETCH_OSM))
			dispatch(SuppliersActions.addNotification('OSM update failed', 'error'))
			dispatch(SuppliersActions.logEvent({title: 'OSM update failed'}))
		})
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


/* utils */

function receiveData(json, type) {
	return{
		type: type,
		payLoad: json
	}
}

function receiveError(json, type) {
	return {
		type: type,
		payLoad: json
	}
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

SuppliersActions.setActivePageIndex = (index) => {
	return {
		type: types.SET_ACTIVE_PAGE_INDEX,
		payLoad: index
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
