/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import axios from 'axios';
import * as types from './actionTypes';
import moment from 'moment';
import { getQueryVariable } from 'utils';
import {
  addExportedFileMetadata,
  addExportedNorwayMetadata,
  formatProviderData
} from './formatUtils';
import getApiConfig from './getApiConfig';

var SuppliersActions = {};

SuppliersActions.cleanStopPlacesInChouette = getToken => async (
  dispatch,
  getState
) => {
  const url = window.config.timetableAdminBaseUrl + 'stop_places/clean';
  return axios
    .post(url, null, await getApiConfig(getToken))
    .then(response => {
      dispatch(
        SuppliersActions.addNotification(
          'Deleted Stop Place Register in Chouette',
          'success'
        )
      );
    })
    .catch(err => {
      SuppliersActions.addNotification(
        'Failed to delete Stop Place Register in Chouette',
        'error'
      );
    });
};

SuppliersActions.deleteAllJobs = getToken => async (dispatch, getState) => {
  const url = `${window.config.eventsBaseUrl}timetable/`;
  return axios.delete(url, await getApiConfig(getToken)).then(response => {
    dispatch(
      SuppliersActions.addNotification('Deleted event history', 'success')
    );
  });
};

SuppliersActions.deleteJobsForProvider = (id, getToken) => async (
  dispatch,
  getState
) => {
  const url = `${window.config.eventsBaseUrl}timetable/${id}`;
  return axios.delete(url, await getApiConfig(getToken)).then(response => {
    dispatch(
      SuppliersActions.addNotification(
        'Deleted event history for provider ' + id,
        'success'
      )
    );
  });
};

SuppliersActions.getProviderStatus = (id, getToken) => async (
  dispatch,
  getState
) => {
  if (id < 0) return;

  const url = `${window.config.eventsBaseUrl}timetable/${id}`;

  dispatch(sendData(null, types.REQUESTED_SUPPLIER_STATUS));
  return axios({
    url: url,
    timeout: 20000,
    method: 'get',
    responseType: 'json',
    ...(await getApiConfig(getToken))
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

SuppliersActions.executePeliasTask = (tasks, getToken) => async (
  dispatch,
  getState
) => {
  const queryParams = Object.keys(tasks)
    .filter(entry => tasks[entry])
    .join('&task=');
  const url =
    window.config.geocoderAdminBaseUrl + `build_pipeline?task=${queryParams}`;

  return axios
    .post(url, null, await getApiConfig(getToken))
    .then(response => {
      dispatch(
        SuppliersActions.addNotification('Pelias task execution', 'success')
      );
    })
    .catch(err => {
      dispatch(
        SuppliersActions.addNotification(
          'Unable to execute pelias tasks',
          'error'
        )
      );
      console.log('err', err);
    });
};

SuppliersActions.uploadTariffZonesFiles = (files, provider) => async (
  dispatch,
  getState
) => {
  dispatch(sendData(0, types.UPDATED_TARIFF_ZONE_FILE_UPLOAD_PROGRESS));

  const url = `${window.config.tariffZonesUrl}${provider.chouetteInfo.xmlns}/files`;

  var data = new FormData();

  files.forEach(file => {
    data.append('files', file);
  });

  var config = {
    onUploadProgress: function(progressEvent) {
      let percentCompleted = (progressEvent.loaded / progressEvent.total) * 100;
      dispatch(
        sendData(
          percentCompleted,
          types.UPDATED_TARIFF_ZONE_FILE_UPLOAD_PROGRESS
        )
      );
    },
    ...(await getApiConfig(getToken))
  };

  return axios
    .post(url, data, config)
    .then(function(response) {
      dispatch(
        SuppliersActions.addNotification(
          'Uploaded tariff zone file(s)',
          'success'
        )
      );
      dispatch(sendData(0, types.UPDATED_TARIFF_ZONE_FILE_UPLOAD_PROGRESS));
    })
    .catch(function(response) {
      dispatch(
        SuppliersActions.addNotification(
          'Unable to upload tariff zone file(s)',
          'error'
        )
      );
      dispatch(sendData(0, types.UPDATED_TARIFF_ZONE_FILE_UPLOAD_PROGRESS));
    });
};

SuppliersActions.getAllProviderStatus = getToken => async (
  dispatch,
  getState
) => {
  dispatch(sendData(null, types.REQUESTED_ALL_SUPPLIERS_STATUS));
  const state = getState();
  const providers = state.SuppliersReducer.data;

  const url = `${window.config.eventsBaseUrl}timetable`;
  return axios({
    url: url,
    timeout: 20000,
    method: 'get',
    responseType: 'json',
    ...(await getApiConfig(getToken))
  })
    .then(response => {
      const providerStatus = response.data.map(status => {
        let provider = null;
        for (let i = 0; i < providers.length; i++) {
          if (providers[i].id === status.providerId) {
            provider = providers[i];
            break;
          }
        }
        return SuppliersActions.formatProviderStatusDate([status], provider);
      });
      const eventList = [].concat.apply([], providerStatus);
      dispatch(
        sendData(
          sortEventlistByNewestFirst(eventList),
          types.RECEIVED_ALL_SUPPLIERS_STATUS
        )
      );
    })
    .catch(response => {
      dispatch(sendData(response.data, types.ERROR_SUPPLIER_STATUS));
    });
};

SuppliersActions.selectAllSuppliers = () => {
  const tabQueryParam = getQueryVariable('tab')
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

SuppliersActions.getAllProviders = getToken => async (dispatch, getState) => {
  const url = window.config.providersBaseUrl;
  dispatch(sendData(null, types.REQUESTED_SUPPLIERS));
  return axios({
    url: url,
    timeout: 20000,
    method: 'get',
    responseType: 'json',
    ...(await getApiConfig(getToken))
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.RECEIVED_SUPPLIERS));

      let queryTab = getQueryVariable('tab');
      let queryId = getQueryVariable('id');

      /* TODO: This is a hack to ensure that all providers are loaded before
             before getting their respective job status
             */
      if (!queryId && queryTab === 1) {
        dispatch(SuppliersActions.getAllProviderStatus(getToken));
      }
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_SUPPLIERS));
    });
};

SuppliersActions.refreshSupplierData = getToken => async (
  dispatch,
  getState
) => {
  const state = getState();
  const { activeId } = state.SuppliersReducer;
  dispatch(SuppliersActions.selectActiveSupplier(activeId, getToken));
  dispatch(SuppliersActions.fetchFilenames(activeId, getToken));
  dispatch(SuppliersActions.getProviderStatus(activeId, getToken));
  dispatch(SuppliersActions.getChouetteJobStatus(getToken));
};

SuppliersActions.createProvider = (data, getToken) => async (
  dispatch,
  getState
) => {
  const url = `${window.config.providersBaseUrl}`;
  const provider = getProviderPayload(data);
  return axios
    .post(url, provider, await getApiConfig(getToken))
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_CREATE_PROVIDER));

      const id = response.data.id;
      window.history.pushState(
        window.config.endpointBase,
        'Title',
        `${window.config.endpointBase}?id=${id}`
      );
      dispatch(SuppliersActions.getAllProviders(getToken)).then(() => {
        dispatch(SuppliersActions.selectActiveSupplier(id, getToken));
      });

      dispatch(SuppliersActions.addNotification('Provider created', 'success'));
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_CREATE_PROVIDER));
      dispatch(
        SuppliersActions.addNotification('Unable to create provider', 'error')
      );
      dispatch(SuppliersActions.getAllProviders(getToken));
    });
};

const getProviderPayload = data => {
  const trimmedData = JSON.parse(
    JSON.stringify(data).replace(/"\s+|\s+"/g, '"')
  );
  let payload = {
    name: trimmedData._name,
    chouetteInfo: {
      xmlns: trimmedData._xmlns,
      xmlnsurl: trimmedData._xmlnsurl,
      referential: trimmedData._referential,
      organisation: trimmedData._organisation,
      user: trimmedData._user,
      allowCreateMissingStopPlace: trimmedData._allowCreateMissingStopPlace,
      generateDatedServiceJourneyIds:
        trimmedData._generateDatedServiceJourneyIds,
      generateMissingServiceLinksForModes:
        trimmedData._generateMissingServiceLinksForModes,
      migrateDataToProvider: trimmedData._migrateDataToProvider,
      enableAutoImport: trimmedData._enableAutoImport,
      enableAutoValidation: trimmedData._enableAutoValidation,
      enableBlocksExport: trimmedData._enableBlocksExport
    }
  };

  if (trimmedData._providerId) {
    payload.id = trimmedData._providerId;
  }

  if (trimmedData._chouetteInfoId) {
    payload.chouetteInfo.id = trimmedData._chouetteInfoId;
  }

  return payload;
};

SuppliersActions.updateProvider = (data, getToken) => async (
  dispatch,
  getState
) => {
  const provider = getProviderPayload(data);
  const url = `${window.config.providersBaseUrl}${provider.id}`;
  return axios
    .put(url, provider, await getApiConfig(getToken))
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_UPDATE_PROVIDER));
      dispatch(
        SuppliersActions.addNotification(
          'Updated provider successfully',
          'success'
        )
      );
      dispatch(SuppliersActions.getAllProviders(getToken));
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_UPDATE_PROVIDER));
      dispatch(
        SuppliersActions.addNotification('Unable to update provider', 'error')
      );
    });
};

SuppliersActions.fetchProvider = (id, getToken) => async (
  dispatch,
  getState
) => {
  if (id < 0) return;

  const url = `${window.config.providersBaseUrl}${id}`;

  return axios
    .get(url, await getApiConfig(getToken))
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_FETCH_PROVIDER));

      let tabQueryParam = getQueryVariable('tab')
        ? `&tab=${getQueryVariable('tab')}`
        : '';

      if (getQueryVariable('tab') === 'events') {
        dispatch(SuppliersActions.getProviderStatus(id, getToken));
      } else if (getQueryVariable('tab') === 'chouetteJobs') {
        dispatch(SuppliersActions.getChouetteJobStatus(getToken));
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

SuppliersActions.deleteProvider = (providerId, getToken) => async (
  dispatch,
  getState
) => {
  const url = `${window.config.providersBaseUrl}${providerId}`;

  return axios
    .delete(url, await getApiConfig(getToken))
    .then(response => {
      dispatch(SuppliersActions.selectActiveSupplier(-1, getToken));
      dispatch(sendData(response.data, types.SUCCESS_DELETE_PROVIDER));

      dispatch(SuppliersActions.addNotification('Provider deleted', 'success'));

      dispatch(SuppliersActions.getAllProviders(getToken)).then(() => {
        window.history.pushState(
          window.config.endpointBase,
          'Title',
          `${window.config.endpointBase}`
        );
        dispatch(SuppliersActions.selectAllSuppliers());
      });
    })
    .catch(error => {
      dispatch(sendData(error.data, types.ERROR_DELETE_PROVIDER));
      dispatch(
        SuppliersActions.addNotification('Unable to delete provider', 'error')
      );
    });
};

SuppliersActions.selectActiveSupplier = (id, getToken) => dispatch => {
  dispatch(SuppliersActions.changeActiveSupplierId(id));
  dispatch(SuppliersActions.restoreFilesToOutbound());
  dispatch(SuppliersActions.fetchFilenames(id, getToken));
  dispatch(SuppliersActions.fetchProvider(id, getToken));
  dispatch(SuppliersActions.setActiveActionFilter('', getToken));
  dispatch(SuppliersActions.unselectAllSuppliers());
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
  chouetteId,
  getToken
) => async (dispatch, getState) => {
  if (providerId < 0) return;

  const url =
    window.config.timetableAdminBaseUrl + `${providerId}/jobs/${chouetteId}`;

  return axios({
    url: url,
    timeout: 20000,
    method: 'delete',
    ...(await getApiConfig(getToken))
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
    });
};

SuppliersActions.cancelAllChouetteJobsforAllProviders = getToken => async (
  dispatch,
  getState
) => {
  return axios({
    url: window.config.timetableAdminBaseUrl + `jobs/`,
    timeout: 20000,
    method: 'delete',
    ...(await getApiConfig(getToken))
  })
    .then(function(response) {
      dispatch(
        SuppliersActions.addNotification(
          `Cancelled all chouette jobs for all providers`,
          'success'
        )
      );
    })
    .catch(function(response) {
      dispatch(
        SuppliersActions.addNotification(
          `Failed deleting all chouttejobs for all providers`,
          'error'
        )
      );
    });
};

SuppliersActions.cancelAllChouetteJobsforProvider = (
  providerId,
  getToken
) => async (dispatch, getState) => {
  if (providerId < 0) return;

  const url = window.config.timetableAdminBaseUrl + `${providerId}/jobs`;

  return axios({
    url: url,
    timeout: 20000,
    method: 'delete',
    ...(await getApiConfig(getToken))
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
    });
};

SuppliersActions.setActiveActionFilter = (value, getToken) => dispatch => {
  dispatch(sendData(value, types.SET_ACTIVE_ACTION_FILTER));
  dispatch(SuppliersActions.getChouetteJobStatus(getToken));
};

SuppliersActions.setActiveActionAllFilter = (value, getToken) => dispatch => {
  dispatch(sendData(value, types.SET_ACTIVE_ACTION_ALL_FILTER));
  dispatch(SuppliersActions.getChouetteJobsForAllSuppliers(getToken));
};

SuppliersActions.getChouetteJobsForAllSuppliers = getToken => async (
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

  const url = window.config.timetableAdminBaseUrl + `jobs?${queryString}`;

  var CancelToken = axios.CancelToken;

  return axios
    .get(url, {
      cancelToken: new CancelToken(function executor(cancel) {
        dispatch(sendData(cancel, types.REQUESTED_ALL_CHOUETTE_JOB_STATUS));
      }),
      ...(await getApiConfig(getToken))
    })
    .then(function(response) {
      let jobs = response.data.reverse();
      var allJobs = [];

      if (jobs.length) {
        jobs.forEach(job => {
          if (job.pendingJobs) {
            job.pendingJobs.forEach(pendingJob => {
              pendingJob.providerId = job.providerId;
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

SuppliersActions.getChouetteJobStatus = getToken => async (
  dispatch,
  getState
) => {
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
    window.config.timetableAdminBaseUrl + `${activeId}/jobs?${queryString}`;

  var CancelToken = axios.CancelToken;

  return axios
    .get(url, await getApiConfig(getToken), {
      cancelToken: new CancelToken(function executor(cancel) {
        dispatch(sendData(cancel, types.REQUESTED_CHOUETTE_JOBS_FOR_PROVIDER));
      })
    })
    .then(function(response) {
      dispatch(
        sendData(response.data.reverse(), types.SUCCESS_CHOUETTE_JOB_STATUS)
      );
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_CHOUETTE_JOB_STATUS));
    });
};

SuppliersActions.exportData = id => async (dispatch, getState) => {
  const url = window.config.timetableAdminBaseUrl + `${id}/export`;

  dispatch(requestExport());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getToken))
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_EXPORT_DATA));
      dispatch(SuppliersActions.addNotification('Export started', 'success'));
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_EXPORT_DATA));
      dispatch(SuppliersActions.addNotification('Export failed', 'error'));
    });
};

SuppliersActions.getGraphStatus = getToken => async (dispatch, getState) => {
  const url = window.config.eventsBaseUrl + `admin_summary/status/aggregation`;

  return axios
    .get(url, await getApiConfig(getToken))
    .then(response => {
      let status = {
        graphStatus: {},
        baseGraphStatus: {},
        otherStatus: []
      };
      response.data.forEach(type => {
        if (type.jobType === 'OTP2_BUILD_GRAPH') {
          status.graphStatus.otp2 = {
            status: type.currentState,
            started: type.currentStateDate
          };
        } else if (type.jobType === 'OTP2_BUILD_BASE') {
          status.baseGraphStatus.otp2 = {
            status: type.currentState,
            started: type.currentStateDate
          };
        } else if (type.jobDomain === 'GEOCODER') {
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

SuppliersActions.getOTPGraphVersions = getToken => async (
  dispatch,
  getState
) => {
  const url = window.config.timetableAdminBaseUrl + `routing_graph/graphs`;

  return axios
    .get(url, await getApiConfig(getToken))
    .then(response => {
      const graphVersions = {
        streetGraphs: [],
        transitGraphs: []
      };

      graphVersions.streetGraphs = response.data.streetGraphs;
      graphVersions.transitGraphs = response.data.transitGraphs;

      dispatch(sendData(graphVersions, types.RECEIVED_GRAPH_VERSIONS));
    })
    .catch(response => {
      console.error('error receiving graph status', response);
    });
};

SuppliersActions.transferData = id => async (dispatch, getState) => {
  const url = window.config.timetableAdminBaseUrl + `${id}/transfer`;

  dispatch(requestTransfer());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getToken))
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_TRANSFER_DATA));
      dispatch(SuppliersActions.addNotification('Transfer started', 'success'));
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_TRANSFER_DATA));
      dispatch(SuppliersActions.addNotification('Transfer failed', 'error'));
    });
};

SuppliersActions.fetchFilenames = (id, getToken) => async (
  dispatch,
  getState
) => {
  const url = window.config.timetableAdminBaseUrl + `${id}/files`;

  dispatch(requestFilenames());
  return axios({
    url: url,
    timeout: 20000,
    method: 'get',
    ...(await getApiConfig(getToken))
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

SuppliersActions.importData = (
  id,
  selectedFiles,
  isFlex = false,
  getToken
) => async (dispatch, getState) => {
  dispatch(requestImport());

  const url =
    window.config.timetableAdminBaseUrl +
    `${id}${isFlex ? '/flex' : ''}/import`;

  const bodySelectedFiles = selectedFiles.map(file => {
    return {
      name: file.name
    };
  });

  return axios
    .post(url, { files: bodySelectedFiles }, await getApiConfig(getToken))
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_IMPORT_DATA));
      dispatch(SuppliersActions.addNotification('Import started', 'success'));
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_IMPORT_DATA));
      dispatch(SuppliersActions.addNotification('Import failed', 'error'));
    });
};

SuppliersActions.cleanDataspace = id => async (dispatch, getState) => {
  const url = window.config.timetableAdminBaseUrl + `${id}/clean`;

  dispatch(requestCleanDataspace());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getToken))
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_DELETE_DATA));
      dispatch(
        SuppliersActions.addNotification(
          'Cleaning of dataspace started',
          'success'
        )
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
    });
};

SuppliersActions.cleanAllDataspaces = filter => async (dispatch, getState) => {
  const url = window.config.timetableAdminBaseUrl + `clean/${filter}`;

  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getToken))
  })
    .then(function(response) {
      dispatch(
        SuppliersActions.addNotification(
          'Cleaning of all dataspaces started with filter ' + filter,
          'success'
        )
      );
    })
    .catch(function(response) {
      dispatch(
        SuppliersActions.addNotification(
          'Cleaning of all dataspaces failed with filter ' + filter,
          'error'
        )
      );
    });
};

SuppliersActions.validateProvider = id => async (dispatch, getState) => {
  const url = window.config.timetableAdminBaseUrl + `${id}/validate`;

  dispatch(requestCleanDataspace());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getToken))
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_VALIDATE_PROVIDER));
      dispatch(
        SuppliersActions.addNotification('Validation started', 'success')
      );
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_VALIDATE_PROVIDER));
      dispatch(SuppliersActions.addNotification('Validation failed', 'error'));
    });
};

SuppliersActions.buildGraph = () => async (dispatch, getState) => {
  const url = window.config.timetableAdminBaseUrl + 'routing_graph/build';

  dispatch(requestBuildGraph());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getToken))
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_BUILD_GRAPH));
      dispatch(
        SuppliersActions.addNotification('Graph build started', 'success')
      );
    })
    .catch(function(response) {
      console.log('ERROR BUILDING GRAPH', response);
      dispatch(sendData(response.data, types.ERROR_BUILD_GRAPH));
      dispatch(SuppliersActions.addNotification('Graph build failed', 'error'));
    });
};

SuppliersActions.buildBaseGraph = () => async (dispatch, getState) => {
  const url = window.config.timetableAdminBaseUrl + 'routing_graph/build_base';

  dispatch(requestBuildBaseGraph());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getToken))
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_BUILD_BASE_GRAPH));
      dispatch(
        SuppliersActions.addNotification('Base graph build started', 'success')
      );
    })
    .catch(function(response) {
      console.log('ERROR BUILDING BASE GRAPH', response);
      dispatch(sendData(response.data, types.ERROR_BUILD_BASE_GRAPH));
      dispatch(
        SuppliersActions.addNotification('Base graph build failed', 'error')
      );
    });
};

SuppliersActions.buildCandidateGraphOTP = () => async (dispatch, getState) => {
  const url =
    window.config.timetableAdminBaseUrl +
    'routing_graph/build_candidate/otp2_netex';

  dispatch(requestBuildGraph());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getToken))
  })
    .then(function(response) {
      dispatch(
        sendData(response.data, types.SUCCESS_BUILD_CANDIDATE_GRAPH_OTP)
      );
      dispatch(
        SuppliersActions.addNotification(
          'Candidate graph build (OTP) started',
          'success'
        )
      );
    })
    .catch(function(response) {
      console.log('ERROR BUILDING CANDIDATE GRAPH (OTP)', response);
      dispatch(sendData(response.data, types.ERROR_BUILD_CANDIDATE_GRAPH_OTP));
      dispatch(
        SuppliersActions.addNotification(
          'Candidate graph build (OTP) failed',
          'error'
        )
      );
    });
};

SuppliersActions.buildCandidateBaseGraphOTP = () => async (
  dispatch,
  getState
) => {
  const url =
    window.config.timetableAdminBaseUrl +
    'routing_graph/build_candidate/otp2_base';

  dispatch(requestBuildBaseGraph());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getToken))
  })
    .then(function(response) {
      dispatch(
        sendData(response.data, types.SUCCESS_BUILD_CANDIDATE_BASE_GRAPH_OTP)
      );
      dispatch(
        SuppliersActions.addNotification(
          'Candidate base graph build (OTP) started',
          'success'
        )
      );
    })
    .catch(function(response) {
      console.log('ERROR BUILDING CANDIDATE BASE GRAPH (OTP)', response);
      dispatch(
        sendData(response.data, types.ERROR_BUILD_CANDIDATE_BASE_GRAPH_OTP)
      );
      dispatch(
        SuppliersActions.addNotification(
          'Candidate base graph build (OTP) failed',
          'error'
        )
      );
    });
};

SuppliersActions.fetchOSM = () => async (dispatch, getState) => {
  const url = window.config.mapAdminBaseUrl + 'download';
  dispatch(requestFetchOSM());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getToken))
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_FETCH_OSM));
      dispatch(
        SuppliersActions.addNotification('OSM update started', 'success')
      );
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_FETCH_OSM));
      dispatch(SuppliersActions.addNotification('OSM update failed', 'error'));
    });
};

SuppliersActions.uploadGoogleProduction = () => async (dispatch, getState) => {
  const url = window.config.timetableAdminBaseUrl + 'export/google/publish';
  dispatch(requestUploadGoogleProduction());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getToken))
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_UPLOAD_GOOGLE_PRODUCTION));
      dispatch(
        SuppliersActions.addNotification(
          'Google upload started (production)',
          'success'
        )
      );
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_UPLOAD_GOOGLE_PRODUCTION));
      dispatch(
        SuppliersActions.addNotification(
          'Google upload failed (production)',
          'error'
        )
      );
    });
};

SuppliersActions.uploadGoogleQA = () => async (dispatch, getState) => {
  const url = window.config.timetableAdminBaseUrl + 'export/google-qa/publish';
  dispatch(requestUploadGoogleQA());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getToken))
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_UPLOAD_GOOGLE_QA));
      dispatch(
        SuppliersActions.addNotification(
          'Google upload started (QA)',
          'success'
        )
      );
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_UPLOAD_GOOGLE_QA));
      dispatch(
        SuppliersActions.addNotification('Google upload failed (QA)', 'error')
      );
    });
};

SuppliersActions.updateMapbox = () => async (dispatch, getState) => {
  const url = window.config.mapboxAdminBaseUrl + 'update';

  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getToken))
  })
    .then(function(response) {
      dispatch(
        SuppliersActions.addNotification('Mapbox update started', 'success')
      );
    })
    .catch(function(response) {
      const errorMessage = 'Mapbox update failed';
      dispatch(SuppliersActions.addNotification(errorMessage, 'error'));
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

function sortEventlistByNewestFirst(list) {
  return list.sort((a, b) => new Date(b.firstEvent) - new Date(a.firstEvent));
}

function requestBuildGraph() {
  return { type: types.REQUEST_BUILD_GRAPH };
}

function requestBuildBaseGraph() {
  return { type: types.REQUEST_BUILD_BASE_GRAPH };
}

function requestFetchOSM() {
  return { type: types.REQUEST_FETCH_OSM };
}

function requestUploadGoogleProduction() {
  return { type: types.REQUEST_UPLOAD_GOOGLE_PRODUCTION };
}

function requestUploadGoogleQA() {
  return { type: types.REQUEST_UPLOAD_GOOGLE_QA };
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
  value,
  getToken
) => dispatch => {
  dispatch(
    sendData(
      { option: option, value: value },
      types.TOGGLE_CHOUETTE_INFO_CHECKBOX_FILTER
    )
  );
  dispatch(SuppliersActions.getChouetteJobStatus(getToken));
};

SuppliersActions.toggleChouetteInfoCheckboxAllFilter = (
  option,
  value,
  getToken
) => dispatch => {
  dispatch(
    sendData(
      { option: option, value: value },
      types.TOGGLE_CHOUETTE_INFO_CHECKBOX_ALL_FILTER
    )
  );
  dispatch(SuppliersActions.getChouetteJobsForAllSuppliers(getToken));
};

SuppliersActions.formatProviderStatusDate = (list, provider) => {
  try {
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
      listItem.started = moment(listItem.firstEvent)
        .locale('en')
        .fromNow();

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
  } catch (err) {
    console.log(err);
  }
};

SuppliersActions.restoreFilesToOutbound = () => {
  return {
    type: types.RESET_OUTBOUND_FILES
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

SuppliersActions.openEditProviderDialog = getToken => async (
  dispatch,
  getState
) => {
  const state = getState();
  dispatch(
    SuppliersActions.fetchProvider(state.SuppliersReducer.activeId, getToken)
  );
  dispatch(SuppliersActions.openEditModalDialog());
};

SuppliersActions.openPoiFilterDialog = () => {
  return {
    type: types.OPENED_POI_FILTER_DIALOG
  };
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

SuppliersActions.getExportedFiles = getToken => async (dispatch, getState) => {
  dispatch(sendData(types.REQUESTED_EXPORTED_FILES, null));
  const url = window.config.timetableAdminBaseUrl + 'export/files';
  return axios({
    url: url,
    timeout: 20000,
    method: 'get',
    responseType: 'json',
    ...(await getApiConfig(getToken))
  }).then(response => {
    if (response.data && response.data.files) {
      let providerData = {};
      let norwayGTFS = [];
      let norwayNetex = [];

      response.data.files.forEach(file => {
        addExportedFileMetadata(
          file.providerId,
          file.referential,
          file.format,
          file,
          norwayNetex,
          norwayGTFS,
          providerData
        );
      });

      addExportedNorwayMetadata(norwayNetex, norwayGTFS, providerData);

      const formattedProviderData = formatProviderData(providerData);

      dispatch(
        sendData(
          { providerData: formattedProviderData },
          types.RECEIVED_EXPORTED_FILES
        )
      );
    }
  });
};

SuppliersActions.cleanFileFilter = () => async (dispatch, getState) => {
  return axios({
    url: window.config.timetableAdminBaseUrl + 'idempotentfilter/clean',
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getToken))
  })
    .then(function(response) {
      dispatch(
        SuppliersActions.addNotification('File filter cleaned', 'success')
      );
    })
    .catch(function(response) {
      dispatch(
        SuppliersActions.addNotification('Cleaning file filter failed', 'error')
      );
    });
};

SuppliersActions.getTransportModes = getToken => async (dispatch, getState) => {
  const url = `${window.config.providersBaseUrl}transport_modes`;
  return axios
    .get(url, await getApiConfig(getToken))
    .then(response => {
      dispatch(sendData(response.data, types.RECEIVED_TRANSPORT_MODES));
    })
    .catch(error => {
      console.log('Error receiving transport modes', error);
    });
};

export default SuppliersActions;
