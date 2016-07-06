import axios from 'axios'
import * as types from './actionTypes'

// Todo : refactor -  make a wrapper for axios

var SuppliersActions = {}

/* nabu actions */

function requestData() {
	return {type: types.REQ_DATA}
}

SuppliersActions.fetchSuppliers = () => {
  //alert( JSON.stringify( window.config ))

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

SuppliersActions.selectActiveSupplier = (id) => {
	return {
		type: types.SELECT_SUPPLIER,
		payLoad: id
	}
}

/* marduk actions */

var mardukConfig = {
  headers: {
		'Access-Control-Allow-Origin:': '*',
		'Accept' : 'application/xml',
		'Content-Type' : 'application/xml',
	}
}

SuppliersActions.exportData = (id) => {

	const url = window.config.mardukBaseUrl+`admin/services/chouette/${id}/export`

	return function(dispatch) {
		dispatch(requestExport())
		return axios({
			url: url,
			timeout: 20000,
			method: 'get',
			responseType: 'xml'
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

SuppliersActions.importData = (id) => {
  const url = window.config.mardukBaseUrl+`admin/services/chouette/${id}/import`

		return function(dispatch) {
			dispatch(requestImport())
			return axios({
				url: url,
				timeout: 20000,
				method: 'get',
			})
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


SuppliersActions.deleteData = (id) => {

		const url = window.config.mardukBaseUrl+`admin/services/chouette/${id}/clean`

		return function(dispatch) {
			dispatch(requestDeleteData())
			return axios({
				url: url,
				timeout: 20000,
				method: 'get',
				headers: {
					'Access-Control-Allow-Origin:': '*',
					'Accept' : 'application/xml',
					'Content-Type' : 'application/xml'
				}
			})
				.then(function(response) {
					dispatch(receiveData(response.data, types.SUCCESS_DELETE_DATA))
					dispatch(SuppliersActions.addNotification('Delete started', 'success'))
				})
				.catch(function(response){
					dispatch(receiveError(response.data, types.ERROR_DELETE_DATA))
					dispatch(SuppliersActions.addNotification('Delete failed', 'error'))
				})
		}
}

SuppliersActions.buildGraph = () => {
		const url = window.config.mardukBaseUrl+'admin/services/graph/build'

		return function(dispatch) {
			dispatch(reuquestBuildGraph())
			return axios({
				url: url,
				timeout: 20000,
				method: 'get',
				headers: {
					'Access-Control-Allow-Origin:': '*',
					'Accept' : 'application/xml',
					'Content-Type' : 'application/xml'
				}
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

function reuquestBuildGraph() {
	return {type: types.REQUEST_BUILD_GRAPH}
}

function requestDeleteData() {
	return {type: types.REQUEST_DELETE_DATA}
}

function requestImport() {
	return {type: types.REQUEST_IMPORT_DATA}
}

function requestExport() {
	return {type: types.REQUEST_EXPORT_DATA}
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

SuppliersActions.addNotification = (message, level) => {
	return {
    type: types.ADD_NOTIFICATION,
    message,
    level
  }
}


export default SuppliersActions
