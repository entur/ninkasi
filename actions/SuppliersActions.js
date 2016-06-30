import axios from 'axios'
import * as types from './actionTypes'

var SuppliersActions = {}

function requestData() {
	return {type: types.REQ_DATA}
}

function receiveData(json) {
	return{
		type: types.RECV_DATA,
		payLoad: json
	}
}

function receiveError(json) {
	return {
		type: types.RECV_ERROR,
		payLoad: json
	}
}

SuppliersActions.fetchSuppliers = () => {

  const url = 'http://localhost:18081/jersey/providers/all'

	return function(dispatch) {
		dispatch(requestData());
		return axios({
			url: url,
			timeout: 20000,
			method: 'get',
			responseType: 'json'
		})
			.then(function(response) {
				dispatch(receiveData(response.data));
			})
			.catch(function(response){
				dispatch(receiveError(response.data));
			})
	}
}

SuppliersActions.selectActiveSupplier = (id) => {
	return {
		type: types.SELECT_SUPPLIER,
		payLoad: id
	}
}

export default SuppliersActions
