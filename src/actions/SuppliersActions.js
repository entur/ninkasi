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

SuppliersActions.cleanStopPlacesInChouette = () => async (
  dispatch,
  getState
) => {
  const url = window.config.timetableAdminBaseUrl + 'stop_places/clean';
  return axios
    .post(url, null, await getApiConfig(getState().UserReducer.auth))
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

SuppliersActions.deleteAllJobs = () => async (dispatch, getState) => {
  const url = `${window.config.eventsBaseUrl}timetable/`;
  return axios
    .delete(url, await getApiConfig(getState().UserReducer.auth))
    .then(response => {
      dispatch(
        SuppliersActions.addNotification('Deleted event history', 'success')
      );
      dispatch(SuppliersActions.logEvent({ title: 'Deleted event history' }));
    });
};

SuppliersActions.deleteJobsForProvider = id => async (dispatch, getState) => {
  const url = `${window.config.eventsBaseUrl}timetable/${id}`;
  return axios
    .delete(url, await getApiConfig(getState().UserReducer.auth))
    .then(response => {
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

SuppliersActions.getProviderStatus = id => async (dispatch, getState) => {
  if (id < 0) return;

  const url = `${window.config.eventsBaseUrl}timetable/${id}`;

  dispatch(sendData(null, types.REQUESTED_SUPPLIER_STATUS));
  return axios({
    url: url,
    timeout: 20000,
    method: 'get',
    responseType: 'json',
    ...(await getApiConfig(getState().UserReducer.auth))
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

SuppliersActions.executePeliasTask = tasks => async (dispatch, getState) => {
  const queryParams = Object.keys(tasks)
    .filter(entry => tasks[entry])
    .join('&task=');
  const url =
    window.config.geocoderAdminBaseUrl + `build_pipeline?task=${queryParams}`;

  return axios
    .post(url, null, await getApiConfig(getState().UserReducer.auth))
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
    ...(await getApiConfig(getState().UserReducer.auth))
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
      dispatch(
        SuppliersActions.logEvent({
          title: 'Uploaded tariff zone file(s): ' + files.join(',')
        })
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

SuppliersActions.getAllProviderStatus = () => async (dispatch, getState) => {
  dispatch(sendData(null, types.REQUESTED_ALL_SUPPLIERS_STATUS));
  const state = getState();
  const providers = state.SuppliersReducer.data;

  const url = `${window.config.eventsBaseUrl}timetable`;
  return axios({
    url: url,
    timeout: 20000,
    method: 'get',
    responseType: 'json',
    ...(await getApiConfig(getState().UserReducer.auth))
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

SuppliersActions.getAllProviders = () => async (dispatch, getState) => {
  const url = window.config.providersBaseUrl;
  dispatch(sendData(null, types.REQUESTED_SUPPLIERS));
  return axios({
    url: url,
    timeout: 20000,
    method: 'get',
    responseType: 'json',
    ...(await getApiConfig(getState().UserReducer.auth))
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.RECEIVED_SUPPLIERS));

      let queryTab = getQueryVariable('tab');
      let queryId = getQueryVariable('id');

      /* TODO: This is a hack to ensure that all providers are loaded before
             before getting their respective job status
             */
      if (!queryId && queryTab === 1) {
        dispatch(SuppliersActions.getAllProviderStatus());
      }
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_SUPPLIERS));
    });
};

SuppliersActions.refreshSupplierData = () => async (dispatch, getState) => {
  const state = getState();
  const { activeId } = state.SuppliersReducer;
  dispatch(SuppliersActions.selectActiveSupplier(activeId));
  dispatch(SuppliersActions.fetchFilenames(activeId));
  dispatch(SuppliersActions.getProviderStatus(activeId));
  dispatch(SuppliersActions.getChouetteJobStatus());
};

SuppliersActions.createProvider = data => async (dispatch, getState) => {
  const url = `${window.config.providersBaseUrl}`;
  const provider = getProviderPayload(data);
  return axios
    .post(url, provider, await getApiConfig(getState().UserReducer.auth))
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_CREATE_PROVIDER));

      const id = response.data.id;
      window.history.pushState(
        window.config.endpointBase,
        'Title',
        `${window.config.endpointBase}?id=${id}`
      );
      dispatch(SuppliersActions.getAllProviders()).then(() => {
        dispatch(SuppliersActions.selectActiveSupplier(id));
      });

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
      dispatch(SuppliersActions.getAllProviders());
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

SuppliersActions.updateProvider = data => async (dispatch, getState) => {
  const provider = getProviderPayload(data);
  const url = `${window.config.providersBaseUrl}${provider.id}`;
  return axios
    .put(url, provider, await getApiConfig(getState().UserReducer.auth))
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_UPDATE_PROVIDER));
      dispatch(
        SuppliersActions.addNotification(
          'Updated provider successfully',
          'success'
        )
      );
      dispatch(SuppliersActions.getAllProviders());
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

SuppliersActions.fetchProvider = id => async (dispatch, getState) => {
  if (id < 0) return;

  const url = `${window.config.providersBaseUrl}${id}`;

  return axios
    .get(url, await getApiConfig(getState().UserReducer.auth))
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_FETCH_PROVIDER));

      let tabQueryParam = getQueryVariable('tab')
        ? `&tab=${getQueryVariable('tab')}`
        : '';

      if (getQueryVariable('tab') === 'events') {
        dispatch(SuppliersActions.getProviderStatus(id));
      } else if (getQueryVariable('tab') === 'chouetteJobs') {
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

SuppliersActions.deleteProvider = providerId => async (dispatch, getState) => {
  const url = `${window.config.providersBaseUrl}${providerId}`;

  return axios
    .delete(url, await getApiConfig(getState().UserReducer.auth))
    .then(response => {
      SuppliersActions.selectActiveSupplier(-1);
      dispatch(sendData(response.data, types.SUCCESS_DELETE_PROVIDER));

      dispatch(SuppliersActions.addNotification('Provider deleted', 'success'));
      dispatch(SuppliersActions.logEvent({ title: 'Provider deleted' }));

      dispatch(SuppliersActions.getAllProviders()).then(() => {
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

SuppliersActions.selectActiveSupplier = id => dispatch => {
  dispatch(SuppliersActions.changeActiveSupplierId(id));
  dispatch(SuppliersActions.restoreFilesToOutbound());
  dispatch(SuppliersActions.fetchFilenames(id));
  dispatch(SuppliersActions.fetchProvider(id));
  dispatch(SuppliersActions.setActiveActionFilter(''));
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
  chouetteId
) => async (dispatch, getState) => {
  if (providerId < 0) return;

  const url =
    window.config.timetableAdminBaseUrl + `${providerId}/jobs/${chouetteId}`;

  return axios({
    url: url,
    timeout: 20000,
    method: 'delete',
    ...(await getApiConfig(getState().UserReducer.auth))
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

SuppliersActions.cancelAllChouetteJobsforAllProviders = () => async (
  dispatch,
  getState
) => {
  return axios({
    url: window.config.timetableAdminBaseUrl + `jobs/`,
    timeout: 20000,
    method: 'delete',
    ...(await getApiConfig(getState().UserReducer.auth))
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

SuppliersActions.cancelAllChouetteJobsforProvider = providerId => async (
  dispatch,
  getState
) => {
  if (providerId < 0) return;

  const url = window.config.timetableAdminBaseUrl + `${providerId}/jobs`;

  return axios({
    url: url,
    timeout: 20000,
    method: 'delete',
    ...(await getApiConfig(getState().UserReducer.auth))
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

SuppliersActions.getChouetteJobsForAllSuppliers = () => async (
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
      ...(await getApiConfig(state.UserReducer.auth))
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

SuppliersActions.getChouetteJobStatus = () => async (dispatch, getState) => {
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
    .get(url, await getApiConfig(state.UserReducer.auth), {
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
    ...(await getApiConfig(getState().UserReducer.auth))
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

SuppliersActions.getGraphStatus = () => async (dispatch, getState) => {
  const url = window.config.eventsBaseUrl + `admin_summary/status/aggregation`;

  return axios
    .get(url, await getApiConfig(getState().UserReducer.auth))
    .then(response => {
      let status = {
        graphStatus: {},
        baseGraphStatus: {},
        otherStatus: []
      };
      response.data.forEach(type => {
        if (type.jobType === 'OTP_BUILD_GRAPH') {
          status.graphStatus.otp2 = {
            status: type.currentState,
            started: type.currentStateDate
          };
        } else if (type.jobType === 'OTP_BUILD_BASE') {
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

SuppliersActions.getOTPGraphVersions = () => async (dispatch, getState) => {
  const url = window.config.timetableAdminBaseUrl + `routing_graph/graphs`;

  return axios
    .get(url, await getApiConfig(getState().UserReducer.auth))
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
    ...(await getApiConfig(getState().UserReducer.auth))
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

SuppliersActions.fetchFilenames = id => async (dispatch, getState) => {
  const url = window.config.timetableAdminBaseUrl + `${id}/files`;

  dispatch(requestFilenames());
  return axios({
    url: url,
    timeout: 20000,
    method: 'get',
    ...(await getApiConfig(getState().UserReducer.auth))
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

SuppliersActions.importData = (id, selectedFiles, isFlex = false) => async (
  dispatch,
  getState
) => {
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
    .post(
      url,
      { files: bodySelectedFiles },
      await getApiConfig(getState().UserReducer.auth)
    )
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

SuppliersActions.cleanDataspace = id => async (dispatch, getState) => {
  const url = window.config.timetableAdminBaseUrl + `${id}/clean`;

  dispatch(requestCleanDataspace());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getState().UserReducer.auth))
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

SuppliersActions.cleanAllDataspaces = filter => async (dispatch, getState) => {
  const url = window.config.timetableAdminBaseUrl + `clean/${filter}`;

  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getState().UserReducer.auth))
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

SuppliersActions.validateProvider = id => async (dispatch, getState) => {
  const url = window.config.timetableAdminBaseUrl + `${id}/validate`;

  dispatch(requestCleanDataspace());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getState().UserReducer.auth))
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

SuppliersActions.buildGraph = () => async (dispatch, getState) => {
  const url = window.config.timetableAdminBaseUrl + 'routing_graph/build';

  dispatch(requestBuildGraph());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getState().UserReducer.auth))
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

SuppliersActions.buildBaseGraph = () => async (dispatch, getState) => {
  const url = window.config.timetableAdminBaseUrl + 'routing_graph/build_base';

  dispatch(requestBuildBaseGraph());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getState().UserReducer.auth))
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_BUILD_BASE_GRAPH));
      dispatch(
        SuppliersActions.addNotification('Base graph build started', 'success')
      );
      dispatch(
        SuppliersActions.logEvent({ title: 'Base graph build started' })
      );
    })
    .catch(function(response) {
      console.log('ERROR BUILDING BASE GRAPH', response);
      dispatch(sendData(response.data, types.ERROR_BUILD_BASE_GRAPH));
      dispatch(
        SuppliersActions.addNotification('Base graph build failed', 'error')
      );
      dispatch(SuppliersActions.logEvent({ title: 'Base graph build failed' }));
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
    ...(await getApiConfig(getState().UserReducer.auth))
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
      dispatch(
        SuppliersActions.logEvent({
          title: 'Candidate graph build (OTP) started'
        })
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
      dispatch(
        SuppliersActions.logEvent({
          title: 'Candidate graph build (OTP) failed'
        })
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
    ...(await getApiConfig(getState().UserReducer.auth))
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
      dispatch(
        SuppliersActions.logEvent({
          title: 'Candidate base graph build (OTP) started'
        })
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
      dispatch(
        SuppliersActions.logEvent({
          title: 'Candidate base graph build (OTP) failed'
        })
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
    ...(await getApiConfig(getState().UserReducer.auth))
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

SuppliersActions.uploadGoogleProduction = () => async (dispatch, getState) => {
  const url = window.config.timetableAdminBaseUrl + 'export/google/publish';
  dispatch(requestUploadGoogleProduction());
  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getState().UserReducer.auth))
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_UPLOAD_GOOGLE_PRODUCTION));
      dispatch(
        SuppliersActions.addNotification(
          'Google upload started (production)',
          'success'
        )
      );
      dispatch(
        SuppliersActions.logEvent({
          title: 'Google upload started (production)'
        })
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
      dispatch(
        SuppliersActions.logEvent({
          title: 'Google upload failed (production)'
        })
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
    ...(await getApiConfig(getState().UserReducer.auth))
  })
    .then(function(response) {
      dispatch(sendData(response.data, types.SUCCESS_UPLOAD_GOOGLE_QA));
      dispatch(
        SuppliersActions.addNotification(
          'Google upload started (QA)',
          'success'
        )
      );
      dispatch(
        SuppliersActions.logEvent({ title: 'Google upload started (QA)' })
      );
    })
    .catch(function(response) {
      dispatch(sendData(response.data, types.ERROR_UPLOAD_GOOGLE_QA));
      dispatch(
        SuppliersActions.addNotification('Google upload failed (QA)', 'error')
      );
      dispatch(
        SuppliersActions.logEvent({ title: 'Google upload failed (QA)' })
      );
    });
};

SuppliersActions.updateMapbox = () => async (dispatch, getState) => {
  const url = window.config.mapboxAdminBaseUrl + 'update';

  return axios({
    url: url,
    timeout: 20000,
    method: 'post',
    ...(await getApiConfig(getState().UserReducer.auth))
  })
    .then(function(response) {
      dispatch(
        SuppliersActions.addNotification('Mapbox update started', 'success')
      );
      dispatch(SuppliersActions.logEvent({ title: 'Mapbox update started' }));
    })
    .catch(function(response) {
      const errorMessage = 'Mapbox update failed';
      dispatch(SuppliersActions.addNotification(errorMessage, 'error'));
      dispatch(SuppliersActions.logEvent({ title: errorMessage }));
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

SuppliersActions.openHistoryModal = () => {
  return {
    type: types.OPENED_HISTORY_MODAL
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

SuppliersActions.openEditProviderDialog = () => async (dispatch, getState) => {
  const state = getState();
  dispatch(SuppliersActions.fetchProvider(state.SuppliersReducer.activeId));
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

SuppliersActions.logEvent = event => {
  return {
    type: types.LOG_EVENT,
    payLoad: event
  };
};

SuppliersActions.getExportedFiles = () => async (dispatch, getState) => {
  dispatch(sendData(types.REQUESTED_EXPORTED_FILES, null));
  const url = window.config.timetableAdminBaseUrl + 'export/files';
  return axios({
    url: url,
    timeout: 20000,
    method: 'get',
    responseType: 'json',
    ...(await getApiConfig(getState().UserReducer.auth))
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
    ...(await getApiConfig(getState().UserReducer.auth))
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

SuppliersActions.getTransportModes = () => async (dispatch, getState) => {
  const url = `${window.config.providersBaseUrl}transport_modes`;
  return axios
    .get(url, await getApiConfig(getState().UserReducer.auth))
    .then(response => {
      dispatch(sendData(response.data, types.RECEIVED_TRANSPORT_MODES));
    })
    .catch(error => {
      console.log('Error receiving transport modes', error);
    });
};

export default SuppliersActions;
