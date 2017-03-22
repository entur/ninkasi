import * as types from './actionTypes'

var UtilsActions = {}

function sendData(payLoad, type) {
  return {
    payLoad: payLoad,
    type: type
  }
}

UtilsActions.notifyConfigIsLoaded = () => {
  return function(dispatch) {
    dispatch(sendData(null, types.CONFIG_LOADED))
  }
}

export default UtilsActions