import axios from 'axios'
import * as types from './actionTypes'
import moment from 'moment'
import { getQueryVariable } from '../containers/utils'

var SuppliersActions = {}

SuppliersActions.getProviderStatus = (id) => {
  if (id < 0) return;

  const url = `${window.config.nabuBaseUrl}jersey/jobs/${id}`

  return function(dispatch) {
    dispatch(sendData(null, types.REQUESTED_SUPPLIER_STATUS) )
    return axios({
      url: url,
      timeout: 20000,
      method: 'get',
      responseType: 'json'
    })
    .then(function(response) {
      let providerStatus = SuppliersActions.formatProviderStatusDate(response.data.reverse(), null)
      dispatch( sendData(providerStatus,types.RECEIVED_SUPPLIER_STATUS) )
    })
    .catch(function(response){
      dispatch( sendData(response.data, types.ERROR_SUPPLIER_STATUS) )
    })
  }
}

SuppliersActions.uploadFiles = (files, providerId) => {

  return function (dispatch) {

    dispatch( sendData(0, types.UPDATED_FILE_UPLOAD_PROGRESS))

    const url = `${window.config.nabuBaseUrl}jersey/files/${providerId}`

    var data = new FormData()

    files.forEach( (file) => {
      data.append("files", file)
    })

    var config = {
      onUploadProgress: function(progressEvent) {
        let percentCompleted = (progressEvent.loaded / progressEvent.total) * 100
        dispatch( sendData(percentCompleted, types.UPDATED_FILE_UPLOAD_PROGRESS))
      }
    }

    return axios.post(url, data, config)
    .then(function(response) {
      dispatch(SuppliersActions.addNotification('Uploaded file' + (files.length > 1) ? 's' : '', 'success'))
      dispatch(SuppliersActions.logEvent({title: 'Uploaded files ' + files.join(',')}))
      dispatch( sendData(0, types.UPDATED_FILE_UPLOAD_PROGRESS))
    })
    .catch(function(response) {
      dispatch(SuppliersActions.addNotification('Unable to upload files', 'error'))
      dispatch( sendData(0, types.UPDATED_FILE_UPLOAD_PROGRESS))
    })
  }
}

SuppliersActions.getAllProviderStatus = () => {

  return function(dispatch, getState) {

    const providerList = getState().SuppliersReducer.data

    dispatch( sendData( null, types.REQUESTED_ALL_SUPPLIERS_STATUS) )

    providerList.forEach( (provider) => {

      const url = `${window.config.nabuBaseUrl}jersey/jobs/${provider.id}`

      return axios({
        url: url,
        timeout: 20000,
        method: 'get',
        responseType: 'json'
      })
      .then(function(response) {

        let providerStatus = SuppliersActions.formatProviderStatusDate(response.data.reverse(), provider)

        dispatch( sendData( providerStatus, types.RECEIVED_ALL_SUPPLIERS_STATUS) )
      })
      .catch(function(response){
        dispatch( sendData(response.data, types.ERROR_SUPPLIER_STATUS) )
      })
    })
  }
}

SuppliersActions.selectAllSuppliers = () => {

  let tabQueryParam = getQueryVariable('tab') ? `?tab=${getQueryVariable('tab')}` : ''

  window.history.pushState(window.config.endpointBase, 'Title', `${window.config.endpointBase}${tabQueryParam}`)

  return {
    type: types.SELECTED_ALL_SUPPLIERS
  }
}

SuppliersActions.unselectAllSuppliers = () => {
  return {
    type: types.UNSELECTED_ALL_SUPPLIERS
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
    dispatch( sendData(null,types.REQUESTED_SUPPLIERS) )
    return axios({
      url: url,
      timeout: 20000,
      method: 'get',
      responseType: 'json'
    })
    .then(function(response) {
      dispatch( sendData(response.data, types.RECEIVED_SUPPLIERS) )

      let queryTab = getQueryVariable('tab')
      let queryId = getQueryVariable('id')

      /* TODO: This is a hack to ensure that all providers are loaded before
       before getting their respective job status
       */
      if (!queryId && queryTab == 1) {
        dispatch(SuppliersActions.getAllProviderStatus())
      }

    })
    .catch(function(response){
      dispatch( sendData(response.data, types.ERROR_SUPPLIERS) )
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

SuppliersActions.createProvider = () => {
  const url = `${window.config.nabuBaseUrl}jersey/providers/create`

  return function(dispatch, getState) {

    const state = getState()

    let provider = state.UtilsReducer.supplierForm

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

SuppliersActions.updateProvider = (id) => {

  if (id < 0) return;

  const url = `${window.config.nabuBaseUrl}jersey/providers/update`

  return function(dispatch, getState) {

    const state = getState()
    let provider = state.UtilsReducer.supplierForm

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

  if (id < 0) return;

  const url = `${window.config.nabuBaseUrl}jersey/providers/${id}`

  return function(dispatch) {
    return axios.get(url)
    .then(function(response) {
      dispatch( sendData(response.data, types.SUCCESS_FETCH_PROVIDER ))

      let tabQueryParam = getQueryVariable('tab') ? `&tab=${getQueryVariable('tab')}` : ''

      if (getQueryVariable('tab') == 1) {
        dispatch(SuppliersActions.getProviderStatus(id))
      } else if (getQueryVariable('tab') == 1) {
        dispatch(SuppliersActions.getChouetteJobStatus())
      }

      window.history.pushState(window.config.endpointBase, 'Title', `${window.config.endpointBase}?id=${id}${tabQueryParam}`)

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
    dispatch(SuppliersActions.fetchProvider(id))
    dispatch(SuppliersActions.setActiveActionFilter(""))
    dispatch(SuppliersActions.unselectAllSuppliers())
  }
}

SuppliersActions.updateSupplierForm = (key, value) => {
  return {
    type: types.UPDATED_SUPPLIER_FORM,
    payLoad: {
      key: key,
      value: value
    }
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

  if (providerId < 0) return;

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

SuppliersActions.cancelAllChouetteJobsforAllProviders = () => {
  return function (dispatch) {
    return axios({
      url: window.config.mardukBaseUrl+`admin/services/chouette/jobs/`,
      timeout: 20000,
      method: 'delete'
    })
    .then(function (response) {
      dispatch(SuppliersActions.addNotification(`Cancelled all chouette jobs for all providers`, 'success'))
      dispatch(SuppliersActions.logEvent({title: `All chouette jobs for all providers successfully cancelled `}))
    })
    .catch(function (response) {
      dispatch(SuppliersActions.addNotification(`Failed deleting all chouttejobs for all providers`, 'error'))
      dispatch(SuppliersActions.logEvent({title: `Unable to cancel all chouette jobs for all providers`}))
    })
  }
}

SuppliersActions.cancelAllChouetteJobsforProvider = (providerId) => {

  if (providerId < 0) return;

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

SuppliersActions.getChouetteJobsForAllSuppliers = () => {

  return function(dispatch, getState) {

    const state = getState()
    const { chouetteJobAllFilter, actionAllFilter } = state.MardukReducer

    let queryString = ''

    for(let [key, value] of Object.entries(chouetteJobAllFilter)) {
      if (value)
        queryString += `&status=${key}`
    }

    if (actionAllFilter && actionAllFilter.length) {
      queryString += `&action=${actionAllFilter}`
    }

    const url = window.config.mardukBaseUrl+`admin/services/chouette/jobs?${queryString}`

    var CancelToken = axios.CancelToken

    return axios.get(url, {
      cancelToken: new CancelToken(function executor(cancel) {
        dispatch( sendData(cancel, types.REQUESTED_ALL_CHOUETTE_JOB_STATUS) )
      })
    })
    .then(function(response) {

      let jobs = response.data.reverse()
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

      dispatch( sendData(allJobs, types.SUCCESS_ALL_CHOUETTE_JOB_STATUS) )
    })
    .catch(function(response){
      dispatch( sendData(response.data, types.ERROR_ALL_CHOUETTE_JOB_STATUS) )
    })
  }
}

SuppliersActions.getChouetteJobStatus = () => {

  return function(dispatch, getState) {

    const state = getState()

    const { chouetteJobFilter, actionFilter } = state.MardukReducer

    const {activeId} = state.SuppliersReducer

    if (activeId < 0) return;

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

    var CancelToken = axios.CancelToken

    return axios.get(url, {
      cancelToken: new CancelToken(function executor(cancel) {
        dispatch( sendData(cancel, types.REQUESTED_CHOUETTE_JOBS_FOR_PROVIDER) )
      })
    })
    .then(function(response) {
      const jobs = SuppliersActions.formatChouetteJobsWithDate(response.data.reverse())
      dispatch( sendData(jobs, types.SUCCESS_CHOUETTE_JOB_STATUS) )
    })
    .catch(function(response){
      dispatch( sendData(response.data, types.ERROR_CHOUETTE_JOB_STATUS) )
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
      dispatch( sendData(response.data, types.SUCCESS_EXPORT_DATA) )
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

SuppliersActions.getGraphStatus = () => {

  return function(dispatch) {

    const url = window.config.mardukBaseUrl+`admin/services/graph/status`

    return axios.get(url)
    .then( (response) => {
      dispatch( sendData(response.data, types.RECEIVED_GRAPH_STATUS) )
    })
    .catch( (response) => {
      console.error('error receiving graph status', response)
    })
  }
}


SuppliersActions.transferData = (id) => {

  const url = window.config.mardukBaseUrl+`admin/services/chouette/${id}/transfer`

  return function(dispatch) {
    dispatch(requestTransfer())
    return axios({
      url: url,
      timeout: 20000,
      method: 'post'
    })
    .then(function(response) {
      dispatch( sendData(response.data, types.SUCCESS_TRANSFER_DATA) )
      dispatch(SuppliersActions.addNotification('Transfer started', 'success'))
      dispatch(SuppliersActions.logEvent({title: `Transfered data for provider ${id}`}))
    })
    .catch(function(response){
      dispatch( sendData(response.data, types.ERROR_TRANSFER_DATA) )
      dispatch(SuppliersActions.addNotification('Transfer failed', 'error'))
      dispatch(SuppliersActions.logEvent({title: `Transfer failed for provider ${id}`}))
    })
  }
}

SuppliersActions.getLineStats = () => {

  return function(dispatch, getState) {

    dispatch( sendData(null, types.REQUESTED_LINE_STATS) )

    const suppliers = getState().SuppliersReducer.data.filter( (supplier) => supplier.chouetteInfo.migrateDataToProvider)

    suppliers.forEach( (supplier) => {
      return axios({
        url: `${window.config.mardukBaseUrl}admin/services/chouette/${supplier.id}/lineStats`,
        timeout: 10000,
        method: 'get',
        responseType: 'json'
      })
      .then( (response) => {
        dispatch( sendData({id: supplier.id, data: formatLineStats(response.data)}, types.RECEIVED_LINE_STATS))
      })
      .catch( (response) => {
        console.error(response)
      })
    })
  }
}

const formatLineStats = (lineStats) => {

  try {

    const defaultObject = { lineNumbers: [] }

    let formattedLines = {
      invalid: lineStats.validityCategories
      .filter( (category) => category.numDaysAtLeastValid < 120)[0] || defaultObject,
      valid: lineStats.validityCategories
      .filter( (category) => category.numDaysAtLeastValid >= 127)[0] || defaultObject,
      soonInvalid: lineStats.validityCategories
      .filter( (category) => (category.numDaysAtLeastValid >= 120 && category.numDaysAtLeastValid < 127))[0] || defaultObject,
      all: defaultObject
    }

    formattedLines.all.lineNumbers = [].concat(
      formattedLines.invalid.lineNumbers,
      formattedLines.soonInvalid.lineNumbers,
      formattedLines.valid.lineNumbers
    )

    let linesMap = {}

    let startDate = moment(lineStats.startDate, 'YYYY-MM-DD')
    formattedLines.startDate = startDate.format('YYYY-MM-DD')
    formattedLines.days = lineStats.days
    formattedLines.endDate = startDate.add(formattedLines.days, 'days').format('YYYY-MM-DD')

    let minDays = {days: 365, valid: 'VALID'}

    lineStats.publicLines.forEach ( (publicLine) => {

      publicLine.effectivePeriods.forEach( (effectivePeriod) => {

        let fromDiff = moment(lineStats.startDate, 'YYYY-MM-DD').diff(moment(effectivePeriod.from, 'YYYY-MM-DD'), 'days', true)

        if (fromDiff > 0) {
          // now is after start date of effective period
          effectivePeriod.timelineStartPosition = 0
        } else {
          effectivePeriod.timelineStartPosition = ( Math.abs(fromDiff) / formattedLines.days ) * 100
        }

        let timelineEndPosition = 100

        let toDiff = moment(formattedLines.endDate, 'YYYY-MM-DD').diff(moment(effectivePeriod.to, 'YYYY-MM-DD'), 'days', true)

        if (toDiff > 0) {
          timelineEndPosition = 100 - (toDiff / (formattedLines.days/100))
        }

        effectivePeriod.timelineEndPosition = timelineEndPosition

        effectivePeriod.validationLevel = 'INVALID'
        let daysForward = (effectivePeriod.timelineEndPosition / 100) * formattedLines.days

        if (daysForward >= 120 && daysForward < 127) {
          effectivePeriod.validationLevel = 'SOON_INVALID'
        } else if (daysForward > 127) {
          effectivePeriod.validationLevel = 'VALID'
        }

        if (daysForward < minDays.days) {
          minDays = {days: daysForward, validity: effectivePeriod.validationLevel}
        }

      })

      publicLine.lines.forEach( (line) => {

        line.timetables.forEach( (timetable) => {
          timetable.periods.forEach( (period) => {

            let fromDiff = moment(lineStats.startDate, 'YYYY-MM-DD').diff(moment(period.from, 'YYYY-MM-DD'), 'days', true)

            if (fromDiff < 0) {
              period.timelineStartPosition = ( Math.abs(fromDiff) / formattedLines.days ) * 100
            } else {
              period.timelineStartPosition = 0
            }

            let timelineEndPosition = 100

            let toDiff = moment(formattedLines.endDate, 'YYYY-MM-DD').diff(moment(period.to, 'YYYY-MM-DD'), 'days', true)

            if (toDiff > 0) {
              timelineEndPosition = 100 - (toDiff / (formattedLines.days/100))
            }

            period.timelineEndPosition = timelineEndPosition
          })
        })
      })

      if (publicLine.effectivePeriods.length == 0) {
        minDays = {days: 0, validity: 'INVALID'}
      }
      linesMap[publicLine.lineNumber] = publicLine
    })

    formattedLines.linesMap = linesMap
    formattedLines.validDaysOffset = 33
    formattedLines.validFromDate = moment(lineStats.startDate, 'YYYY-MM-DD').add(120, 'days').format('YYYY-MM-DD')
    formattedLines.minDays = minDays

    return formattedLines

  } catch (e) {
    console.error("error in getLineStats", e)
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
      dispatch(SuppliersActions.logEvent({
        title: `Imported data for provider ${id}`,
        files: selectedFiles
      }))
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

SuppliersActions.cleanAllDataspaces = (filter) => {

  const url = window.config.mardukBaseUrl+`admin/services/chouette/clean/${filter}`

  return function(dispatch) {
    return axios({
      url: url,
      timeout: 20000,
      method: 'post'
    })
    .then(function(response) {
      dispatch(SuppliersActions.addNotification('Cleaning of all dataspaces started with filter ' + filter, 'success'))
      dispatch(SuppliersActions.logEvent({title: `Cleaned all dataspaces with filter ${filter}`}))
    })
    .catch(function(response){
      dispatch(SuppliersActions.addNotification('Cleaning of all dataspaces failed with filter ' + filter, 'error'))
      dispatch(SuppliersActions.logEvent({title: `Cleaning all dataspaces failed for filter ${filter}`}))
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
      console.log("ERROR BUILDING GRAPH", response)
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

function requestTransfer() {
  return {type: types.REQUEST_TRANSFER_DATA}
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

SuppliersActions.formatProviderStatusDate = (list, provider) => {
  return list.map( (listItem) => {

    listItem.duration = moment(moment(listItem.lastEvent).diff(moment(listItem.firstEvent))).locale("nb").utc().format("HH:mm:ss")
    listItem.firstEvent = moment(listItem.firstEvent).locale("nb").format("YYYY-MM-DD HH:mm:ss")
    listItem.lastEvent = moment(listItem.lastEvent).locale("nb").format("YYYY-MM-DD HH:mm:ss")
    listItem.started = moment(listItem.firstEvent).locale("en").fromNow()

    if (provider) {
      listItem.provider = provider
    }

    if (listItem.events) {
      listItem.events.forEach(function (event) {
        event.date = moment(event.date).locale("nb").format("YYYY-MM-DD HH:mm:ss")
      })
    }
    return listItem
  })

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

SuppliersActions.openEditModalDialog = () => {
  return {
    type: types.OPENED_EDIT_PROVIDER_DIALOG
  }
}

SuppliersActions.openEditProviderDialog = () => {
  return function(dispatch, getState) {
    const state = getState()
    dispatch(  SuppliersActions.fetchProvider(state.SuppliersReducer.activeId) )
    dispatch( SuppliersActions.openEditModalDialog() )
  }
}

SuppliersActions.openNewProviderDialog = () => {
  return {
    type: types.OPENED_NEW_PROVIDER_DIALOG
  }
}

SuppliersActions.dismissEditProviderDialog = () => {
  return {
    type: types.DISMISS_EDIT_PROVIDER_DIALOG
  }
}

SuppliersActions.logEvent = (event) => {
  return {
    type: types.LOG_EVENT,
    payLoad: event
  }
}

SuppliersActions.cleanFileFilter = () => {
  return function(dispatch) {
    return axios({
      url: window.config.mardukBaseUrl+'admin/application/filestores/clean',
      timeout: 20000,
      method: 'post'
    })
    .then(function(response) {
      dispatch(SuppliersActions.addNotification('File filter cleaned', 'success'))
      dispatch(SuppliersActions.logEvent({title: 'File filter cleaned'}))
    })
    .catch(function(response){
      dispatch(SuppliersActions.addNotification('Cleaning file filter failed', 'error'))
      dispatch(SuppliersActions.logEvent({title: 'Cleaning file filter failed'}))
    })
  }
}

export default SuppliersActions
