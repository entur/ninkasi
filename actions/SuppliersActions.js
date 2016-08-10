import axios from 'axios'
import * as types from './actionTypes'

const querystring = require('querystring')

var SuppliersActions = {}

/* nabu actions */

function requestData() {
	return {type: types.REQ_DATA}
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
		})
		.catch(function(response) {
			dispatch(receiveError(response.data, types.ERROR_DELETE_PROVIDER))
			dispatch(SuppliersActions.addNotification('Unable to delete provider', 'error'))
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
		})
		.catch(function(response) {
			dispatch(receiveError(response.data, types.ERROR_CREATE_PROVIDER))
			dispatch(SuppliersActions.addNotification('Unable to create provider', 'error'))
		})
	}
}

SuppliersActions.updateProvider = (provider) => {

	const url = `${window.config.nabuBaseUrl}jersey/providers/update`

	return function(dispatch) {
		return axios.put(url, provider)
		.then(function(response) {
			dispatch(receiveData(response.data, types.SUCCESS_UPDATE_PROVIDER))
			dispatch(SuppliersActions.addNotification('Provider update', 'success'))
		})
		.catch(function(response) {
			dispatch(receiveError(response.data, types.ERROR_UPDATE_PROVIDER))
			dispatch(SuppliersActions.addNotification('Unable to update provider', 'error'))
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
			dispatch(receiveData(response.data, types.REQUEST_EXPORT_DATA))
			dispatch(SuppliersActions.addNotification('Export started', 'success'))
		})
		.catch(function(response){
			dispatch(receiveError(response.data, types.ERROR_EXPORT_DATA))
			dispatch(SuppliersActions.addNotification('Export failed', 'error'))
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

	const url = window.config.mardukBaseUrl+`admin/services/chouette/${id}/import?fileHandle=${selectedFiles}`

	return function(dispatch) {
		dispatch(requestImport())
		return axios.post(url)
		.then(function(response) {
			dispatch(receiveData(response.data, types.SUCCESS_IMPORT_DATA))
			dispatch(SuppliersActions.addNotification('Import started', 'success'))
		})
		.catch(function(response){
			dispatch(receiveError(response.data, types.ERROR_IMPORT_DATA))
			dispatch(SuppliersActions.addNotification('Import failed', 'error'))
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
		})
		.catch(function(response){
			dispatch(receiveError(response.data, types.ERROR_DELETE_DATA))
			dispatch(SuppliersActions.addNotification('Cleaning of dataspace failed', 'error'))
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
		})
		.catch(function(response){
			dispatch(receiveError(response.data, types.ERROR_VALIDATE_PROVIDER))
			dispatch(SuppliersActions.addNotification('Validation failed', 'error'))
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
		})
		.catch(function(response){
			dispatch(receiveError(response.data, types.ERROR_BUILD_GRAPH))
			dispatch(SuppliersActions.addNotification('Graph build failed', 'error'))
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
		})
		.catch(function(response){
			dispatch(receiveError(response.data, types.ERROR_FETCH_OSM))
			dispatch(SuppliersActions.addNotification('OSM update failed', 'error'))
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

export default SuppliersActions
