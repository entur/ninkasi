import axios from 'axios';
import * as types from './actionTypes';
import moment from 'moment';
import { getQueryVariable } from '../containers/utils';
import { formatLineStats } from 'bogu/utils';
import roleParser from '../roles/rolesParser';

var SuppliersActions = {};

const getConfig = () => {
  let config = {};
  let token = localStorage.getItem('NINKASI::jwt');

  config.headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Bearer ' + token
  };
  return config;
};

SuppliersActions.cleanStopPlacesInChouette = () => dispatch => {
  const url =
    window.config.mardukBaseUrl + 'admin/services/chouette/stop_places/clean';
  return axios
    .post(url, null, getConfig())
    .then(response => {
      dispatch(
        SuppliersActions.addNotification(
          'Deleted Stop Place Register in Chouette',
          'success'
        )
      );
      dispatch(
        SuppliersActions.logEvent({
          title: 'Deleted Stop Place Register in Chouette'
        })
      );
    })
    .catch(err => {
      SuppliersActions.addNotification(
        'Failed to delete Stop Place Register in Chouette',
        'error'
      );
    });
};

SuppliersActions.deleteAllJobs = () => dispatch => {
  const url = `${window.config.nabuBaseUrl}jersey/jobs/`;
  return axios.delete(url, getConfig()).then(response => {
    dispatch(
      SuppliersActions.addNotification('Deleted event history', 'success')
    );
    dispatch(SuppliersActions.logEvent({ title: 'Deleted event history' }));
  });
};

SuppliersActions.deleteJobsForProvider = id => dispatch => {
  const url = `${window.config.nabuBaseUrl}jersey/jobs/${id}`;
  return axios.delete(url, getConfig()).then(response => {
    dispatch(
      SuppliersActions.addNotification(
        'Deleted event history for provider ' + id,
        'success'
      )
    );
    dispatch(
      SuppliersActions.logEvent({
        title: 'Deleted event history for provider ' + id
      })
    );
  });
};

SuppliersActions.getProviderStatus = id => dispatch => {
  if (id < 0) return;

  const url = `${window.config.nabuBaseUrl}jersey/jobs/${id}`;

  dispatch(sendData(null, types.REQUESTED_SUPPLIER_STATUS));
  return axios({
    url: url,
    timeout: 20000,
    method: 'get',
    responseType: 'json',
    ...getConfig()
  })
    .then(function(response) {
      let providerStatus = SuppliersActions.formatProviderStatusDate(
        response.data.reverse(),
        null
      );
      dispatch(sendData(providerStatus, types.RECEIVED_SUPPLIER_STATUS));
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_SUPPLIER_STATUS));
    });
};

SuppliersActions.executePeliasTask = tasks => dispatch => {
  const queryParams = Object.keys(tasks)
    .filter(entry => tasks[entry])
    .join('&task=');
  const url =
    window.config.mardukBaseUrl + `admin/geocoder/start?task=${queryParams}`;

  return axios
    .post(url, null, getConfig())
    .then(response => {
      dispatch(
        SuppliersActions.addNotification('Pelias task execution', 'success')
      );
      dispatch(
        SuppliersActions.logEvent({
          title: 'Pelias tasks executed successfully'
        })
      );
    })
    .catch(err => {
      dispatch(
        SuppliersActions.addNotification(
          'Unable to execute pelias tasks',
          'error'
        )
      );
      dispatch(
        SuppliersActions.logEvent({ title: 'Running pelias tasks failed' })
      );
      console.log('err', err);
    });
};

SuppliersActions.uploadFiles = (files, providerId) => dispatch => {
  dispatch(sendData(0, types.UPDATED_FILE_UPLOAD_PROGRESS));

  const url = `${window.config.nabuBaseUrl}jersey/files/${providerId}`;

  var data = new FormData();

  files.forEach(file => {
    data.append('files', file);
  });

  var config = {
    onUploadProgress: function(progressEvent) {
      let percentCompleted = progressEvent.loaded / progressEvent.total * 100;
      dispatch(sendData(percentCompleted, types.UPDATED_FILE_UPLOAD_PROGRESS));
    },
    ...getConfig()
  };

  return axios
    .post(url, data, config)
    .then(function(response) {
      dispatch(SuppliersActions.addNotification('Uploaded file(s)', 'success'));
      dispatch(
        SuppliersActions.logEvent({
          title: 'Uploaded file(s): ' + files.join(',')
        })
      );
      dispatch(sendData(0, types.UPDATED_FILE_UPLOAD_PROGRESS));
    })
    .catch(function(response) {
      dispatch(
        SuppliersActions.addNotification('Unable to upload file(s)', 'error')
      );
      dispatch(sendData(0, types.UPDATED_FILE_UPLOAD_PROGRESS));
    });
};

SuppliersActions.getAllProviderStatus = () => (dispatch, getState) => {
  const providerList = getState().SuppliersReducer.data;

  dispatch(sendData(null, types.REQUESTED_ALL_SUPPLIERS_STATUS));

  providerList.forEach(provider => {
    const url = `${window.config.nabuBaseUrl}jersey/jobs/${provider.id}`;

    return axios({
      url: url,
      timeout: 20000,
      method: 'get',
      responseType: 'json',
      ...getConfig()
    })
      .then(function(response) {
        let providerStatus = SuppliersActions.formatProviderStatusDate(
          response.data.reverse(),
          provider
        );

        dispatch(sendData(providerStatus, types.RECEIVED_ALL_SUPPLIERS_STATUS));
      })
      .catch(function(response) {
        dispatch(sendData(response.data, types.ERROR_SUPPLIER_STATUS));
      });
  });
};

SuppliersActions.selectAllSuppliers = () => {
  let tabQueryParam = getQueryVariable('tab')
    ? `?tab=${getQueryVariable('tab')}`
    : '';

  window.history.pushState(
    window.config.endpointBase,
    'Title',
    `${window.config.endpointBase}${tabQueryParam}`
  );

  return {
    type: types.SELECTED_ALL_SUPPLIERS
  };
};

SuppliersActions.unselectAllSuppliers = () => {
  return {
    type: types.UNSELECTED_ALL_SUPPLIERS
  };
};

function sendData(payLoad, type) {
  return {
    payLoad: payLoad,
    type: type
  };
}

SuppliersActions.getAllProviders = () => (dispatch, getState) => {
  const url = window.config.nabuBaseUrl + 'jersey/providers/all';
  dispatch(sendData(null, types.REQUESTED_SUPPLIERS));
  return axios({
    url: url,
    timeout: 20000,
    method: 'get',
    responseType: 'json',
    ...getConfig()
  })
    .then(function(response) {
      const tokenParsed = getState().UserReducer.kc.tokenParsed;
      const providers = roleParser.getUserProviders(tokenParsed, response.data);

      dispatch(sendData(providers, types.RECEIVED_SUPPLIERS));

      let queryTab = getQueryVariable('tab');
      let queryId = getQueryVariable('id');

      /* TODO: This is a hack to ensure that all providers are loaded before
       before getting their respective job status
       */
      if (!queryId && queryTab == 1) {
        dispatch(SuppliersActions.getAllProviderStatus());
      }
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_SUPPLIERS));
    });
};

SuppliersActions.refreshSupplierData = () => (dispatch, getState) => {
  const state = getState();
  const { activeId } = state.SuppliersReducer;
  dispatch(SuppliersActions.selectActiveSupplier(activeId));
  dispatch(SuppliersActions.fetchFilenames(activeId));
  dispatch(SuppliersActions.getProviderStatus(activeId));
  dispatch(SuppliersActions.getChouetteJobStatus());
};

SuppliersActions.createProvider = () => (dispatch, getState) => {
  const url = `${window.config.nabuBaseUrl}jersey/providers/create`;

  const state = getState();

  let provider = state.UtilsReducer.supplierForm;

  return axios
    .post(url, provider, getConfig())
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_CREATE_PROVIDER));
      dispatch(SuppliersActions.addNotification('Provider created', 'success'));
      dispatch(SuppliersActions.logEvent({ title: 'New provider created' }));
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_CREATE_PROVIDER));
      dispatch(
        SuppliersActions.addNotification('Unable to create provider', 'error')
      );
      dispatch(
        SuppliersActions.logEvent({ title: 'Creating new provider failed' })
      );
    });
};

SuppliersActions.updateProvider = id => (dispatch, getState) => {
  if (id < 0) return;

  const url = `${window.config.nabuBaseUrl}jersey/providers/update`;

  const state = getState();
  let provider = state.UtilsReducer.supplierForm;

  return axios
    .put(url, provider, getConfig())
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_UPDATE_PROVIDER));
      dispatch(
        SuppliersActions.addNotification(
          'Updated provider successfully',
          'success'
        )
      );
      dispatch(
        SuppliersActions.logEvent({
          title: `Updated provider ${provider.id} successfully`
        })
      );
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_UPDATE_PROVIDER));
      dispatch(
        SuppliersActions.addNotification('Unable to update provider', 'error')
      );
      dispatch(
        SuppliersActions.logEvent({
          title: `Updating provider ${provider.id} failed`
        })
      );
    });
};

SuppliersActions.fetchProvider = id => dispatch => {
  if (id < 0) return;

  const url = `${window.config.nabuBaseUrl}jersey/providers/${id}`;

  return axios
    .get(url, getConfig())
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_FETCH_PROVIDER));

      let tabQueryParam = getQueryVariable('tab')
        ? `&tab=${getQueryVariable('tab')}`
        : '';

      if (getQueryVariable('tab') == 1) {
        dispatch(SuppliersActions.getProviderStatus(id));
      } else if (getQueryVariable('tab') == 1) {
        dispatch(SuppliersActions.getChouetteJobStatus());
      }

      window.history.pushState(
        window.config.endpointBase,
        'Title',
        `${window.config.endpointBase}?id=${id}${tabQueryParam}`
      );
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_FETCH_PROVIDER));
      dispatch(
        SuppliersActions.addNotification('Unable to fetch provider', 'error')
      );
    });
};

SuppliersActions.selectActiveSupplier = id => dispatch => {
  dispatch(SuppliersActions.changeActiveSupplierId(id));
  dispatch(SuppliersActions.restoreFilesToOutbound());
  dispatch(SuppliersActions.fetchFilenames(id));
  dispatch(SuppliersActions.fetchProvider(id));
  dispatch(SuppliersActions.setActiveActionFilter(''));
  dispatch(SuppliersActions.unselectAllSuppliers());
};

SuppliersActions.updateSupplierForm = (key, value) => {
  return {
    type: types.UPDATED_SUPPLIER_FORM,
    payLoad: {
      key: key,
      value: value
    }
  };
};

SuppliersActions.changeActiveSupplierId = id => {
  return {
    type: types.SELECT_SUPPLIER,
    payLoad: id
  };
};

/* marduk actions */

SuppliersActions.cancelChouetteJobForProvider = (
  providerId,
  chouetteId
) => dispatch => {
  if (providerId < 0) return;

  const url =
    window.config.mardukBaseUrl +
    `admin/services/chouette/${providerId}/jobs/${chouetteId}`;

  return axios({
    url: url,
    timeout: 20000,
    method: 'delete',
    ...getConfig()
  })
    .then(function(response) {
      dispatch(
        sendData(response.data, types.SUCCESS_DELETE_PROVIDERS_CHOUETTE_JOB)
      );
      dispatch(
        SuppliersActions.addNotification(
          `Cancelled chouettejob with id ${chouetteId}`,
          'success'
        )
      );
      dispatch(
        SuppliersActions.logEvent({
          title: `Chouette job with ${chouetteId} successfully cancelled for provider ${providerId}`
        })
      );
    })
    .catch(function(response) {
      dispatch(
        sendData(response.data, types.ERROR_DELETE_PROVIDERS_CHOUETTE_JOB)
      );
      dispatch(
        SuppliersActions.addNotification(
          `Unable to cancel chouettejob with id ${chouetteId}`,
          'error'
        )
      );
      dispatch(
        SuppliersActions.logEvent({
          title: `Unable to cancel chouette job with id ${chouetteId} for provider ${providerId}`
        })
      );
    });
};

SuppliersActions.cancelAllChouetteJobsforAllProviders = () => dispatch => {
  return axios({
    url: window.config.mardukBaseUrl + `admin/services/chouette/jobs/`,
    timeout: 20000,
    method: 'delete',
    ...getConfig()
  })
    .then(function(response) {
      dispatch(
        SuppliersActions.addNotification(
          `Cancelled all chouette jobs for all providers`,
          'success'
        )
      );
      dispatch(
        SuppliersActions.logEvent({
          title: `All chouette jobs for all providers successfully cancelled `
        })
      );
    })
    .catch(function(response) {
      dispatch(
        SuppliersActions.addNotification(
          `Failed deleting all chouttejobs for all providers`,
          'error'
        )
      );
      dispatch(
        SuppliersActions.logEvent({
          title: `Unable to cancel all chouette jobs for all providers`
        })
      );
    });
};

SuppliersActions.cancelAllChouetteJobsforProvider = providerId => dispatch => {
  if (providerId < 0) return;

  const url =
    window.config.mardukBaseUrl + `admin/services/chouette/${providerId}/jobs`;

  return axios({
    url: url,
    timeout: 20000,
    method: 'delete',
    ...getConfig()
  })
    .then(function(response) {
      dispatch(
        sendData(response.data, types.SUCCESS_DELETE_ALL_PROVIDERS_CHOUETTE_JOB)
      );
      dispatch(
        SuppliersActions.addNotification(
          `Deleted all chouttejobs for provider ${providerId}`,
          'success'
        )
      );
      dispatch(
        SuppliersActions.logEvent({
          title: `All chouette jobs for provider ${providerId} successfully  cancelled `
        })
      );
    })
    .catch(function(response) {
      dispatch(
        sendData(response.data, types.ERROR_DELETE_ALL_PROVIDERS_CHOUETTE_JOB)
      );
      dispatch(
        SuppliersActions.addNotification(
          `Failed deleting all chouttejobs for provider ${providerId}`,
          'error'
        )
      );
      dispatch(
        SuppliersActions.logEvent({
          title: `Unable to cancel chouette jobs for provider ${providerId}`
        })
      );
    });
};

SuppliersActions.setActiveActionFilter = value => dispatch => {
  dispatch(sendData(value, types.SET_ACTIVE_ACTION_FILTER));
  dispatch(SuppliersActions.getChouetteJobStatus());
};

SuppliersActions.setActiveActionAllFilter = value => dispatch => {
  dispatch(sendData(value, types.SET_ACTIVE_ACTION_ALL_FILTER));
  dispatch(SuppliersActions.getChouetteJobsForAllSuppliers());
};

SuppliersActions.formatChouetteJobsWithDate = jobs => {
  return jobs.map(job => {
    job.created = moment(job.created)
      .locale('nb')
      .format('YYYY-MM-DD HH:mm:ss');
    job.started = moment(job.started)
      .locale('nb')
      .format('YYYY-MM-DD HH:mm:ss');
    job.updated = moment(job.updated)
      .locale('nb')
      .format('YYYY-MM-DD HH:mm:ss');
    return job;
  });
  return jobs;
};

SuppliersActions.getChouetteJobsForAllSuppliers = () => (
  dispatch,
  getState
) => {
  const state = getState();
  const { chouetteJobAllFilter, actionAllFilter } = state.MardukReducer;

  let queryString = '';

  for (let [key, value] of Object.entries(chouetteJobAllFilter)) {
    if (value) queryString += `&status=${key}`;
  }

  if (actionAllFilter && actionAllFilter.length) {
    queryString += `&action=${actionAllFilter}`;
  }

  const url =
    window.config.mardukBaseUrl + `admin/services/chouette/jobs?${queryString}`;

  var CancelToken = axios.CancelToken;

  return axios
    .get(url, {
      cancelToken: new CancelToken(function executor(cancel) {
        dispatch(sendData(cancel, types.REQUESTED_ALL_CHOUETTE_JOB_STATUS));
      }),
      ...getConfig()
    })
    .then(function(response) {
      let jobs = response.data.reverse();
      var allJobs = [];

      if (jobs.length) {
        jobs.forEach(job => {
          if (job.pendingJobs) {
            job.pendingJobs.forEach(pendingJob => {
              pendingJob.providerId = job.providerId;
              pendingJob.created = moment(pendingJob.created)
                .locale('nb')
                .format('Do MMMM YYYY, HH:mm:ss');
              pendingJob.started = moment(pendingJob.started)
                .locale('nb')
                .format('Do MMMM YYYY, HH:mm:ss');
              pendingJob.updated = moment(pendingJob.updated)
                .locale('nb')
                .format('Do MMMM YYYY, HH:mm:ss');
              allJobs.push(pendingJob);
            });
          }
        });
      }

      dispatch(sendData(allJobs, types.SUCCESS_ALL_CHOUETTE_JOB_STATUS));
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_ALL_CHOUETTE_JOB_STATUS));
    });
};

SuppliersActions.getChouetteJobStatus = () => (dispatch, getState) => {
  const state = getState();

  const { chouetteJobFilter, actionFilter } = state.MardukReducer;

  const { activeId } = state.SuppliersReducer;

  if (activeId < 0) return;

  let queryString = '';

  for (let [key, value] of Object.entries(chouetteJobFilter)) {
    if (value) queryString += `&status=${key}`;
  }

  if (actionFilter && actionFilter.length) {
    queryString += `&action=${actionFilter}`;
  }

  if (queryString.length) {
    queryString = queryString.substring(1);
  }

  const url =
    window.config.mardukBaseUrl +
    `admin/services/chouette/${activeId}/jobs?${queryString}`;

  var CancelToken = axios.CancelToken;

  return axios
    .get(url, getConfig(), {
      cancelToken: new CancelToken(function executor(cancel) {
        dispatch(sendData(cancel, types.REQUESTED_CHOUETTE_JOBS_FOR_PROVIDER));
      })
    })
    .then(function(response) {
      const jobs = SuppliersActions.formatChouetteJobsWithDate(
        response.data.reverse()
      );
      dispatch(sendData(jobs, types.SUCCESS_CHOUETTE_JOB_STATUS));
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_CHOUETTE_JOB_STATUS));
    });
};

SuppliersActions.exportData = id => dispatch => {
  const url =
    window.config.mardukBaseUrl + `admin/services/chouette/${id}/export`;

  dispatch(requestExport());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...getConfig()
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_EXPORT_DATA));
      dispatch(SuppliersActions.addNotification('Export started', 'success'));
      dispatch(
        SuppliersActions.logEvent({
          title: `Exported data for provider ${id}`
        })
      );
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_EXPORT_DATA));
      dispatch(SuppliersActions.addNotification('Export failed', 'error'));
      dispatch(
        SuppliersActions.logEvent({
          title: `Export failed for provider ${id}`
        })
      );
    });
};

SuppliersActions.getGraphStatus = () => dispatch => {
  const url =
    window.config.nabuBaseUrl + `jersey/systemJobs/status/aggregation`;

  return axios
    .get(url, getConfig())
    .then(response => {
      let status = {
        otherStatus: []
      };
      response.data
        .forEach(type => {
          if (type.jobType === 'BUILD_GRAPH') {
            status.graphStatus = {
              status: type.currentState,
              started: type.currentStateDate
            };
          } else if (type.jobDomain === 'GEOCODER'){
            status.otherStatus.push({
              type: type.jobType,
              status: type.currentState,
              started: type.currentStateDate
            });
          }
        });

      dispatch(sendData(status, types.RECEIVED_GRAPH_STATUS));
    })
    .catch(response => {
      console.error('error receiving graph status', response);
    });
};

SuppliersActions.transferData = id => dispatch => {
  const url =
    window.config.mardukBaseUrl + `admin/services/chouette/${id}/transfer`;

  dispatch(requestTransfer());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...getConfig()
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_TRANSFER_DATA));
      dispatch(SuppliersActions.addNotification('Transfer started', 'success'));
      dispatch(
        SuppliersActions.logEvent({
          title: `Transfered data for provider ${id}`
        })
      );
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_TRANSFER_DATA));
      dispatch(SuppliersActions.addNotification('Transfer failed', 'error'));
      dispatch(
        SuppliersActions.logEvent({
          title: `Transfer failed for provider ${id}`
        })
      );
    });
};

SuppliersActions.getAllLineStats = () => (dispatch, getState) => {
  dispatch(sendData(null, types.REQUESTED_LINE_STATS));

  const suppliers = getState().SuppliersReducer.data.filter(
    supplier => supplier.chouetteInfo.migrateDataToProvider
  );

  suppliers.forEach(supplier => {
    return axios({
      url: `${window.config
        .mardukBaseUrl}admin/services/chouette/${supplier.id}/lineStats`,
      timeout: 10000,
      method: 'get',
      responseType: 'json',
      ...getConfig()
    })
      .then(response => {
        dispatch(
          sendData(
            { id: supplier.id, data: formatLineStats(response.data) },
            types.RECEIVED_LINE_STATS
          )
        );
      })
      .catch(response => {
        console.error(response);
      });
  });
};

SuppliersActions.getLineStatsForProvider = providerId => dispatch => {
  dispatch(sendData(null, types.REQUESTED_LINE_STATS));

  return axios
    .get(
      `${window.config
        .mardukBaseUrl}admin/services/chouette/${providerId}/lineStats`,
      getConfig()
    )
    .then(response => {
      dispatch(
        sendData(
          { id: providerId, data: formatLineStats(response.data) },
          types.RECEIVED_LINE_STATS
        )
      );
    })
    .catch(response => {
      console.error(response);
    });
};

SuppliersActions.fetchFilenames = id => dispatch => {
  const url =
    window.config.mardukBaseUrl + `admin/services/chouette/${id}/files`;

  dispatch(requestFilenames());
  return axios({
    url: url,
    timeout: 20000,
    method: 'get',
    ...getConfig()
  })
    .then(function(response) {
      const files = addFileExtensions(response.data.files);

      dispatch(sendData(files, types.SUCCESS_FILENAMES));
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_FILENAMES));
    });
};

export const addFileExtensions = (files = []) => {
  return files.map(file => {
    if (file.name) {
      file.ext = file.name
        .substring(file.name.lastIndexOf('.') + 1)
        .toLowerCase();
    }
    return file;
  });
};

SuppliersActions.importData = (id, selectedFiles) => dispatch => {
  dispatch(requestImport());

  const url =
    window.config.mardukBaseUrl + `admin/services/chouette/${id}/import`;

  const bodySelectedFiles = selectedFiles.map(file => {
    return {
      name: file.name
    };
  });

  return axios
    .post(url, { files: bodySelectedFiles }, getConfig())
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_IMPORT_DATA));
      dispatch(SuppliersActions.addNotification('Import started', 'success'));
      dispatch(
        SuppliersActions.logEvent({
          title: `Imported data for provider ${id}`,
          files: selectedFiles
        })
      );
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_IMPORT_DATA));
      dispatch(SuppliersActions.addNotification('Import failed', 'error'));
      dispatch(
        SuppliersActions.logEvent({
          title: `Import failed for provider ${id}`
        })
      );
    });
};

SuppliersActions.cleanDataspace = id => dispatch => {
  const url =
    window.config.mardukBaseUrl + `admin/services/chouette/${id}/clean`;

  dispatch(requestCleanDataspace());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...getConfig()
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_DELETE_DATA));
      dispatch(
        SuppliersActions.addNotification(
          'Cleaning of dataspace started',
          'success'
        )
      );
      dispatch(
        SuppliersActions.logEvent({
          title: `Cleaned data space for provider ${id}`
        })
      );
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_DELETE_DATA));
      dispatch(
        SuppliersActions.addNotification(
          'Cleaning of dataspace failed',
          'error'
        )
      );
      dispatch(
        SuppliersActions.logEvent({
          title: `Cleaning data space failed for provider ${id}`
        })
      );
    });
};

SuppliersActions.cleanAllDataspaces = filter => dispatch => {
  const url =
    window.config.mardukBaseUrl + `admin/services/chouette/clean/${filter}`;

  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...getConfig()
  })
    .then(function(response) {
      dispatch(
        SuppliersActions.addNotification(
          'Cleaning of all dataspaces started with filter ' + filter,
          'success'
        )
      );
      dispatch(
        SuppliersActions.logEvent({
          title: `Cleaned all dataspaces with filter ${filter}`
        })
      );
    })
    .catch(function(response) {
      dispatch(
        SuppliersActions.addNotification(
          'Cleaning of all dataspaces failed with filter ' + filter,
          'error'
        )
      );
      dispatch(
        SuppliersActions.logEvent({
          title: `Cleaning all dataspaces failed for filter ${filter}`
        })
      );
    });
};

SuppliersActions.validateProvider = id => dispatch => {
  const url =
    window.config.mardukBaseUrl + `admin/services/chouette/${id}/validate`;

  dispatch(requestCleanDataspace());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...getConfig()
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_VALIDATE_PROVIDER));
      dispatch(
        SuppliersActions.addNotification('Validation started', 'success')
      );
      dispatch(
        SuppliersActions.logEvent({
          title: `Validated, imported and exported data for provider ${id} successfully`
        })
      );
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_VALIDATE_PROVIDER));
      dispatch(SuppliersActions.addNotification('Validation failed', 'error'));
      dispatch(
        SuppliersActions.logEvent({
          title: `Validating, importing and exporting data for provider ${id} failed`
        })
      );
    });
};

SuppliersActions.buildGraph = () => dispatch => {
  const url = window.config.mardukBaseUrl + 'admin/services/graph/build';

  dispatch(requestBuildGraph());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...getConfig()
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_BUILD_GRAPH));
      dispatch(
        SuppliersActions.addNotification('Graph build started', 'success')
      );
      dispatch(SuppliersActions.logEvent({ title: 'Graph build started' }));
    })
    .catch(function(response) {
      console.log('ERROR BUILDING GRAPH', response);
      dispatch(sendData(response.data, types.ERROR_BUILD_GRAPH));
      dispatch(SuppliersActions.addNotification('Graph build failed', 'error'));
      dispatch(SuppliersActions.logEvent({ title: 'Graph build failed' }));
    });
};

SuppliersActions.fetchOSM = () => dispach => {
  const url = window.config.mardukBaseUrl + 'admin/services/fetch/osm';

  dispatch(requestFetchOSM());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...getConfig()
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_FETCH_OSM));
      dispatch(
        SuppliersActions.addNotification('OSM update started', 'success')
      );
      dispatch(SuppliersActions.logEvent({ title: 'OSM update started' }));
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_FETCH_OSM));
      dispatch(SuppliersActions.addNotification('OSM update failed', 'error'));
      dispatch(SuppliersActions.logEvent({ title: 'OSM update failed' }));
    });
};

SuppliersActions.sortListByColumn = (listName, columnName) => dispatch => {
  switch (listName) {
    case 'events':
      dispatch(SuppliersActions.sortEventlistByColumn(columnName));
      break;
    case 'chouetteAll':
      dispatch(SuppliersActions.sortChouetteAllByColumn(columnName));
      break;
    case 'chouette':
      dispatch(SuppliersActions.sortChouetteByColumn(columnName));
      break;
    default:
  }
};

SuppliersActions.sortEventlistByColumn = columnName => {
  return {
    type: types.SORT_EVENTLIST_BY_COLUMN,
    payLoad: columnName
  };
};

SuppliersActions.sortChouetteAllByColumn = columnName => {
  return {
    type: types.SORT_CHOUETTE_ALL_BY_COLUMN,
    payLoad: columnName
  };
};

SuppliersActions.sortChouetteByColumn = columnName => {
  return {
    type: types.SORT_CHOUETTE_BY_COLUMN,
    payLoad: columnName
  };
};

function requestBuildGraph() {
  return { type: types.REQUEST_BUILD_GRAPH };
}

function requestFetchOSM() {
  return { type: types.REQUEST_FETCH_OSM };
}

function requestCleanDataspace() {
  return { type: types.REQUEST_DELETE_DATA };
}

function requestImport() {
  return { type: types.REQUEST_IMPORT_DATA };
}

function requestExport() {
  return { type: types.REQUEST_EXPORT_DATA };
}

function requestTransfer() {
  return { type: types.REQUEST_TRANSFER_DATA };
}

function requestFilenames() {
  return { type: types.REQUEST_FILENAMES };
}

SuppliersActions.toggleChouetteInfoCheckboxFilter = (
  option,
  value
) => dispatch => {
  dispatch(
    sendData(
      { option: option, value: value },
      types.TOGGLE_CHOUETTE_INFO_CHECKBOX_FILTER
    )
  );
  dispatch(SuppliersActions.getChouetteJobStatus());
};

SuppliersActions.toggleChouetteInfoCheckboxAllFilter = (
  option,
  value
) => dispatch => {
  dispatch(
    sendData(
      { option: option, value: value },
      types.TOGGLE_CHOUETTE_INFO_CHECKBOX_ALL_FILTER
    )
  );
  dispatch(SuppliersActions.getChouetteJobsForAllSuppliers());
};

SuppliersActions.formatProviderStatusDate = (list, provider) => {
  return list.map(listItem => {
    listItem.duration = moment(
      moment(listItem.lastEvent).diff(moment(listItem.firstEvent))
    )
      .locale('nb')
      .utc()
      .format('HH:mm:ss');
    listItem.firstEvent = moment(listItem.firstEvent)
      .locale('nb')
      .format('YYYY-MM-DD HH:mm:ss');
    listItem.lastEvent = moment(listItem.lastEvent)
      .locale('nb')
      .format('YYYY-MM-DD HH:mm:ss');
    listItem.started = moment(listItem.firstEvent).locale('en').fromNow();

    if (provider) {
      listItem.provider = provider;
    }

    if (listItem.events) {
      listItem.events.forEach(function(event) {
        event.date = moment(event.date)
          .locale('nb')
          .format('YYYY-MM-DD HH:mm:ss');
      });
    }
    return listItem;
  });
};

SuppliersActions.restoreFilesToOutbound = () => {
  return {
    type: types.RESET_OUTBOUND_FILES
  };
};

SuppliersActions.logEventFilter = filter => {
  return {
    type: types.LOG_EVENT_FILTER,
    payLoad: filter
  };
};

SuppliersActions.updateOutboundFilelist = files => {
  return {
    type: types.UPDATE_FILES_TO_OUTBOUND,
    payLoad: files
  };
};

SuppliersActions.appendFilesToOutbound = files => {
  return {
    type: types.APPEND_FILES_TO_OUTBOUND,
    payLoad: files
  };
};

SuppliersActions.removeFilesToOutbound = files => {
  return {
    type: types.REMOVE_FILES_FROM_OUTBOUND,
    payLoad: files
  };
};

SuppliersActions.addNotification = (message, level) => {
  return {
    type: types.ADD_NOTIFICATION,
    message,
    level
  };
};

SuppliersActions.toggleExpandableEventsContent = id => {
  return {
    type: types.TOGGLE_EXPANDABLE_FOR_EVENT_WRAPPER,
    payLoad: id
  };
};

SuppliersActions.openModalDialog = () => {
  return {
    type: types.OPEN_MODAL_DIALOG
  };
};

SuppliersActions.dismissModalDialog = () => {
  return {
    type: types.DISMISS_MODAL_DIALOG
  };
};

SuppliersActions.openEditModalDialog = () => {
  return {
    type: types.OPENED_EDIT_PROVIDER_DIALOG
  };
};

SuppliersActions.openEditProviderDialog = () => (dispatch, getState) => {
  const state = getState();
  dispatch(SuppliersActions.fetchProvider(state.SuppliersReducer.activeId));
  dispatch(SuppliersActions.openEditModalDialog());
};

SuppliersActions.openNewProviderDialog = () => {
  return {
    type: types.OPENED_NEW_PROVIDER_DIALOG
  };
};

SuppliersActions.dismissEditProviderDialog = () => {
  return {
    type: types.DISMISS_EDIT_PROVIDER_DIALOG
  };
};

SuppliersActions.logEvent = event => {
  return {
    type: types.LOG_EVENT,
    payLoad: event
  };
};

SuppliersActions.cleanFileFilter = () => dispatch => {
  return axios({
    url: window.config.mardukBaseUrl + 'admin/application/filestores/clean',
    timeout: 20000,
    method: 'post',
    ...getConfig()
  })
    .then(function(response) {
      dispatch(
        SuppliersActions.addNotification('File filter cleaned', 'success')
      );
      dispatch(SuppliersActions.logEvent({ title: 'File filter cleaned' }));
    })
    .catch(function(response) {
      dispatch(
        SuppliersActions.addNotification('Cleaning file filter failed', 'error')
      );
      dispatch(
        SuppliersActions.logEvent({ title: 'Cleaning file filter failed' })
      );
    });
};

export default SuppliersActions;
