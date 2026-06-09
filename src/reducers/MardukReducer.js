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

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import getApiConfig from 'actions/getApiConfig';
import { addNotification } from 'reducers/UtilsReducer';

// NOTE: SuppliersReducer and MardukReducer have a runtime-only cyclic
// dependency.  We can't statically import the `selectedAllSuppliers` action
// creator here because at the moment this slice is constructed, the
// SuppliersReducer module hasn't finished evaluating yet and the binding
// would be `undefined`.  We instead reference the auto-generated action
// `type` string directly in the cross-slice `addCase` below.
const SUPPLIERS_SELECTED_ALL_TYPE = 'suppliers/selectedAllSuppliers';

const addFileExtensions = (files = []) =>
  files.map(file => {
    if (file.name) {
      file.ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
    }
    return file;
  });

const initialState = {
  filenames: {
    isLoading: false,
  },
  isLoading: false,
  data: [],
  chouetteJobStatus: [],
  chouetteAllJobStatus: [],
  chouetteJobFilter: {
    SCHEDULED: true,
    RESCHEDULED: true,
    STARTED: true,
    TERMINATED: false,
    ABORTED: false,
    CANCELED: false,
  },
  chouetteJobAllFilter: {
    SCHEDULED: true,
    RESCHEDULED: true,
    STARTED: true,
    TERMINATED: false,
    ABORTED: false,
    CANCELED: false,
  },
  actionFilter: '',
  actionAllFilter: '',
  requesting_chouette_job: false,
  requesting_chouette_all_job: false,
};

// ---------------------------------------------------------------------------
// Pipeline-op thunks
// ---------------------------------------------------------------------------

const makePipelineOpThunk = (typePrefix, { url, successMessage, failureMessage }) =>
  createAsyncThunk(typePrefix, async (getToken, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        url: typeof url === 'function' ? url() : url,
        timeout: 20000,
        method: 'post',
        ...(await getApiConfig(getToken)),
      });
      dispatch(addNotification({ message: successMessage, level: 'success' }));
      return response.data;
    } catch (err) {
      dispatch(addNotification({ message: failureMessage, level: 'error' }));
      return rejectWithValue(err?.response?.data ?? null);
    }
  });

export const exportData = createAsyncThunk(
  'marduk/exportData',
  async ({ id, getToken }, { dispatch, rejectWithValue }) => {
    const url = window.config.timetableAdminBaseUrl + `${id}/export`;
    try {
      const response = await axios({
        url,
        timeout: 20000,
        method: 'post',
        ...(await getApiConfig(getToken)),
      });
      dispatch(addNotification({ message: 'Export started', level: 'success' }));
      return response.data;
    } catch (err) {
      dispatch(addNotification({ message: 'Export failed', level: 'error' }));
      return rejectWithValue(err?.response?.data ?? null);
    }
  }
);

export const transferData = createAsyncThunk(
  'marduk/transferData',
  async ({ id, getToken }, { dispatch, rejectWithValue }) => {
    const url = window.config.timetableAdminBaseUrl + `${id}/transfer`;
    try {
      const response = await axios({
        url,
        timeout: 20000,
        method: 'post',
        ...(await getApiConfig(getToken)),
      });
      dispatch(addNotification({ message: 'Transfer started', level: 'success' }));
      return response.data;
    } catch (err) {
      dispatch(addNotification({ message: 'Transfer failed', level: 'error' }));
      return rejectWithValue(err?.response?.data ?? null);
    }
  }
);

export const importData = createAsyncThunk(
  'marduk/importData',
  async ({ id, selectedFiles, isFlex = false, getToken }, { dispatch, rejectWithValue }) => {
    const url = window.config.timetableAdminBaseUrl + `${id}${isFlex ? '/flex' : ''}/import`;
    const bodySelectedFiles = selectedFiles.map(file => ({ name: file.name }));
    try {
      const response = await axios.post(
        url,
        { files: bodySelectedFiles },
        await getApiConfig(getToken)
      );
      dispatch(addNotification({ message: 'Import started', level: 'success' }));
      return response.data;
    } catch (err) {
      dispatch(addNotification({ message: 'Import failed', level: 'error' }));
      return rejectWithValue(err?.response?.data ?? null);
    }
  }
);

export const cleanDataspace = createAsyncThunk(
  'marduk/cleanDataspace',
  async ({ id, getToken }, { dispatch, rejectWithValue }) => {
    const url = window.config.timetableAdminBaseUrl + `${id}/clean`;
    try {
      const response = await axios({
        url,
        timeout: 20000,
        method: 'post',
        ...(await getApiConfig(getToken)),
      });
      dispatch(addNotification({ message: 'Cleaning of dataspace started', level: 'success' }));
      return response.data;
    } catch (err) {
      dispatch(addNotification({ message: 'Cleaning of dataspace failed', level: 'error' }));
      return rejectWithValue(err?.response?.data ?? null);
    }
  }
);

export const validateProvider = createAsyncThunk(
  'marduk/validateProvider',
  async ({ id, getToken }, { dispatch, rejectWithValue }) => {
    const url = window.config.timetableAdminBaseUrl + `${id}/validate`;
    try {
      const response = await axios({
        url,
        timeout: 20000,
        method: 'post',
        ...(await getApiConfig(getToken)),
      });
      dispatch(addNotification({ message: 'Validation started', level: 'success' }));
      return response.data;
    } catch (err) {
      dispatch(addNotification({ message: 'Validation failed', level: 'error' }));
      return rejectWithValue(err?.response?.data ?? null);
    }
  }
);

export const buildGraph = makePipelineOpThunk('marduk/buildGraph', {
  url: () => window.config.timetableAdminBaseUrl + 'routing_graph/build',
  successMessage: 'Transit Graph build started',
  failureMessage: 'Transit Graph build failed',
});

export const buildBaseGraph = makePipelineOpThunk('marduk/buildBaseGraph', {
  url: () => window.config.timetableAdminBaseUrl + 'routing_graph/build_base',
  successMessage: 'Street Graph build started',
  failureMessage: 'Street Graph build failed',
});

export const buildCandidateGraphOTP = makePipelineOpThunk('marduk/buildCandidateGraphOTP', {
  url: () => window.config.timetableAdminBaseUrl + 'routing_graph/build_candidate/otp2_netex',
  successMessage: 'Candidate Transit Graph build started',
  failureMessage: 'Candidate Transit Graph build failed',
});

export const buildCandidateBaseGraphOTP = makePipelineOpThunk('marduk/buildCandidateBaseGraphOTP', {
  url: () => window.config.timetableAdminBaseUrl + 'routing_graph/build_candidate/otp2_base',
  successMessage: 'Candidate Street Graph build started',
  failureMessage: 'Candidate Street Graph build failed',
});

export const fetchOSM = makePipelineOpThunk('marduk/fetchOSM', {
  url: () => window.config.mapAdminBaseUrl + 'download',
  successMessage: 'OSM update started',
  failureMessage: 'OSM update failed',
});

// ---------------------------------------------------------------------------
// Filenames, chouette job status
// ---------------------------------------------------------------------------

export const fetchFilenames = createAsyncThunk(
  'marduk/fetchFilenames',
  async ({ id, getToken }, { rejectWithValue }) => {
    const url = window.config.timetableAdminBaseUrl + `${id}/files`;
    try {
      const response = await axios({
        url,
        timeout: 20000,
        method: 'get',
        ...(await getApiConfig(getToken)),
      });
      return addFileExtensions(response.data.files);
    } catch (err) {
      return rejectWithValue(err?.response?.data ?? null);
    }
  }
);

export const getChouetteJobStatus = createAsyncThunk(
  'marduk/getChouetteJobStatus',
  async (getToken, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const { chouetteJobFilter, actionFilter } = state.MardukReducer;
    const { activeId } = state.SuppliersReducer;

    let queryString = '';
    for (const [key, value] of Object.entries(chouetteJobFilter)) {
      if (value) queryString += `&status=${key}`;
    }
    if (actionFilter && actionFilter.length) {
      queryString += `&action=${actionFilter}`;
    }
    if (queryString.length) {
      queryString = queryString.substring(1);
    }

    const url = window.config.timetableAdminBaseUrl + `${activeId}/jobs?${queryString}`;
    const CancelToken = axios.CancelToken;

    try {
      const response = await axios.get(url, await getApiConfig(getToken), {
        cancelToken: new CancelToken(function executor(cancel) {
          dispatch(chouetteJobRequestStarted(cancel));
        }),
      });
      return response.data.reverse();
    } catch (err) {
      return rejectWithValue(err?.response?.data ?? null);
    }
  },
  {
    // Don't run (and don't dispatch pending/fulfilled/rejected) when there's
    // no active provider or we're in local-dev auth-bypass mode.  Old code
    // returned without dispatching SUCCESS; the createAsyncThunk equivalent
    // is `condition`.
    condition: (_getToken, { getState }) => {
      if (window.config?.defaultAuthMethod === 'local') return false;
      return getState().SuppliersReducer.activeId >= 0;
    },
  }
);

export const getChouetteJobsForAllSuppliers = createAsyncThunk(
  'marduk/getChouetteJobsForAllSuppliers',
  async (getToken, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const { chouetteJobAllFilter, actionAllFilter } = state.MardukReducer;

    let queryString = '';
    for (const [key, value] of Object.entries(chouetteJobAllFilter)) {
      if (value) queryString += `&status=${key}`;
    }
    if (actionAllFilter && actionAllFilter.length) {
      queryString += `&action=${actionAllFilter}`;
    }

    const url = window.config.timetableAdminBaseUrl + `jobs?${queryString}`;
    const CancelToken = axios.CancelToken;

    try {
      const response = await axios.get(url, {
        cancelToken: new CancelToken(function executor(cancel) {
          dispatch(chouetteAllJobRequestStarted(cancel));
        }),
        ...(await getApiConfig(getToken)),
      });
      const jobs = response.data.reverse();
      const allJobs = [];

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
      return allJobs;
    } catch (err) {
      return rejectWithValue(err?.response?.data ?? null);
    }
  },
  {
    // Skip in local-dev auth-bypass mode; old code returned without dispatch.
    condition: () => window.config?.defaultAuthMethod !== 'local',
  }
);

export const cancelChouetteJobForProvider = createAsyncThunk(
  'marduk/cancelChouetteJobForProvider',
  async ({ providerId, chouetteId, getToken }, { dispatch, rejectWithValue }) => {
    if (providerId < 0) return null;
    const url = window.config.timetableAdminBaseUrl + `${providerId}/jobs/${chouetteId}`;
    try {
      const response = await axios({
        url,
        timeout: 20000,
        method: 'delete',
        ...(await getApiConfig(getToken)),
      });
      dispatch(
        addNotification({
          message: `Cancelled chouettejob with id ${chouetteId}`,
          level: 'success',
        })
      );
      return response.data;
    } catch (err) {
      dispatch(
        addNotification({
          message: `Unable to cancel chouettejob with id ${chouetteId}`,
          level: 'error',
        })
      );
      return rejectWithValue(err?.response?.data ?? null);
    }
  }
);

export const cancelAllChouetteJobsforProvider = createAsyncThunk(
  'marduk/cancelAllChouetteJobsforProvider',
  async ({ providerId, getToken }, { dispatch, rejectWithValue }) => {
    if (providerId < 0) return null;
    const url = window.config.timetableAdminBaseUrl + `${providerId}/jobs`;
    try {
      const response = await axios({
        url,
        timeout: 20000,
        method: 'delete',
        ...(await getApiConfig(getToken)),
      });
      dispatch(
        addNotification({
          message: `Deleted all chouttejobs for provider ${providerId}`,
          level: 'success',
        })
      );
      return response.data;
    } catch (err) {
      dispatch(
        addNotification({
          message: `Failed deleting all chouttejobs for provider ${providerId}`,
          level: 'error',
        })
      );
      return rejectWithValue(err?.response?.data ?? null);
    }
  }
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------

const setRequesting = state => {
  state.isLoading = true;
  state.error = false;
};

const setOpSuccess = key => (state, action) => {
  state.isLoading = false;
  state[key] = action.payload;
  state.error = false;
};

const setOpError = key => (state, action) => {
  state.isLoading = false;
  state[key] = action.payload;
  state.error = true;
};

const mardukSlice = createSlice({
  name: 'marduk',
  initialState,
  reducers: {
    toggleChouetteInfoCheckboxFilter(state, action) {
      const { option, value } = action.payload;
      state.chouetteJobFilter[option] = value;
    },
    toggleChouetteInfoCheckboxAllFilter(state, action) {
      const { option, value } = action.payload;
      state.chouetteJobAllFilter[option] = value;
    },
    setActiveActionFilterValue(state, action) {
      state.actionFilter = action.payload;
    },
    setActiveActionAllFilterValue(state, action) {
      state.actionAllFilter = action.payload;
    },
    chouetteJobRequestStarted(state, action) {
      if (state.chouette_cancel_token) {
        state.chouette_cancel_token('Operation canceled by new request.');
      }
      state.requesting_chouette_job = true;
      state.chouette_cancel_token = action.payload;
    },
    chouetteAllJobRequestStarted(state, action) {
      if (state.chouette_cancel_all_token) {
        state.chouette_cancel_all_token('Operation canceled by new request');
      }
      state.requesting_chouette_all_job = true;
      state.chouette_cancel_all_token = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // import
      .addCase(importData.pending, setRequesting)
      .addCase(importData.fulfilled, setOpSuccess('import_data'))
      .addCase(importData.rejected, setOpError('import_data'))
      // export
      .addCase(exportData.pending, setRequesting)
      .addCase(exportData.fulfilled, setOpSuccess('export_data'))
      .addCase(exportData.rejected, setOpError('export_data'))
      // transfer
      .addCase(transferData.pending, setRequesting)
      .addCase(transferData.fulfilled, setOpSuccess('transfer_data'))
      .addCase(transferData.rejected, setOpError('transfer_data'))
      // clean dataspace (delete data)
      .addCase(cleanDataspace.pending, setRequesting)
      .addCase(cleanDataspace.fulfilled, setOpSuccess('delete_data'))
      .addCase(cleanDataspace.rejected, setOpError('delete_data'))
      // build graph
      .addCase(buildGraph.pending, setRequesting)
      .addCase(buildGraph.fulfilled, setOpSuccess('build_graph'))
      .addCase(buildGraph.rejected, setOpError('build_graph'))
      // build base graph
      .addCase(buildBaseGraph.pending, setRequesting)
      .addCase(buildBaseGraph.fulfilled, setOpSuccess('build_base_graph'))
      .addCase(buildBaseGraph.rejected, setOpError('build_base_graph'))
      // build candidate graph OTP
      // NOTE: the original SuppliersActions.buildCandidateGraphOTP started with
      // requestBuildGraph() (not the candidate variant) for the pending state.
      // We preserve that behavior by sharing the pending side effect.
      .addCase(buildCandidateGraphOTP.pending, setRequesting)
      .addCase(buildCandidateGraphOTP.fulfilled, setOpSuccess('build_candidate_graph_otp'))
      .addCase(buildCandidateGraphOTP.rejected, setOpError('build_candidate_graph_otp'))
      // build candidate base graph OTP
      .addCase(buildCandidateBaseGraphOTP.pending, setRequesting)
      .addCase(buildCandidateBaseGraphOTP.fulfilled, setOpSuccess('build_candidate_base_graph_otp'))
      .addCase(buildCandidateBaseGraphOTP.rejected, setOpError('build_candidate_base_graph_otp'))
      // fetch OSM
      .addCase(fetchOSM.pending, setRequesting)
      .addCase(fetchOSM.fulfilled, setOpSuccess('fetch_osm'))
      .addCase(fetchOSM.rejected, setOpError('fetch_osm'))
      // validate provider — original dispatched requestCleanDataspace() (not its
      // own) before firing.  We preserve that by using the same generic pending
      // setter; the validate_provider key is set on success/error.
      .addCase(validateProvider.pending, setRequesting)
      .addCase(validateProvider.fulfilled, setOpSuccess('validate_provider'))
      .addCase(validateProvider.rejected, setOpError('validate_provider'))
      // filenames
      .addCase(fetchFilenames.pending, state => {
        state.filenames = { isLoading: true, error: false };
      })
      .addCase(fetchFilenames.fulfilled, (state, action) => {
        state.filenames = { isLoading: false, data: action.payload, error: false };
      })
      .addCase(fetchFilenames.rejected, (state, action) => {
        // (Original had a `filesnames` typo here that left
        // `state.filenames.isLoading` permanently true on error, freezing the
        // migrate-data tab in a loading state.)
        state.filenames = { isLoading: false, error: action.payload };
      })
      // chouette job status (single provider)
      .addCase(getChouetteJobStatus.fulfilled, (state, action) => {
        state.requesting_chouette_job = false;
        state.chouetteJobStatus = action.payload;
      })
      // chouette job status (all providers)
      .addCase(getChouetteJobsForAllSuppliers.fulfilled, (state, action) => {
        state.requesting_chouette_all_job = false;
        state.chouetteAllJobStatus = action.payload;
      })
      // cross-slice listener: clear cancel tokens when SELECTED_ALL_SUPPLIERS fires
      .addCase(SUPPLIERS_SELECTED_ALL_TYPE, state => {
        state.chouette_cancel_all_token = null;
        state.chouette_cancel_token = null;
      });
  },
});

export const {
  toggleChouetteInfoCheckboxFilter,
  toggleChouetteInfoCheckboxAllFilter,
  setActiveActionFilterValue,
  setActiveActionAllFilterValue,
  chouetteJobRequestStarted,
  chouetteAllJobRequestStarted,
} = mardukSlice.actions;

// Re-export resetOutboundFiles from UtilsReducer under the name the legacy
// SuppliersActions used.  Components still call this through the
// SuppliersActions shim.
export { resetOutboundFiles as restoreFilesToOutbound } from 'reducers/UtilsReducer';

// ---------------------------------------------------------------------------
// Composite / side-effecting thunks owned by the marduk slice
// ---------------------------------------------------------------------------

export const setActiveActionFilter = (value, getToken) => dispatch => {
  dispatch(setActiveActionFilterValue(value));
  dispatch(getChouetteJobStatus(getToken));
};

export const setActiveActionAllFilter = (value, getToken) => dispatch => {
  dispatch(setActiveActionAllFilterValue(value));
  dispatch(getChouetteJobsForAllSuppliers(getToken));
};

export const toggleChouetteInfoCheckboxFilterAndRefetch = (option, value, getToken) => dispatch => {
  dispatch(toggleChouetteInfoCheckboxFilter({ option, value }));
  dispatch(getChouetteJobStatus(getToken));
};

export const toggleChouetteInfoCheckboxAllFilterAndRefetch =
  (option, value, getToken) => dispatch => {
    dispatch(toggleChouetteInfoCheckboxAllFilter({ option, value }));
    dispatch(getChouetteJobsForAllSuppliers(getToken));
  };

// ---------------------------------------------------------------------------
// Side-effect-only thunks (no slice state changes)
// ---------------------------------------------------------------------------

export const cleanStopPlacesInChouette = getToken => async dispatch => {
  const url = window.config.timetableAdminBaseUrl + 'stop_places/clean';
  try {
    await axios.post(url, null, await getApiConfig(getToken));
    dispatch(
      addNotification({
        message: 'Deleted Stop Place Register in Chouette',
        level: 'success',
      })
    );
  } catch {
    // NOTE: original code forgot to dispatch the error notification; we
    // preserve that behaviour while still using the new payload shape if
    // somebody re-enables the dispatch.
    addNotification({
      message: 'Failed to delete Stop Place Register in Chouette',
      level: 'error',
    });
  }
};

export const deleteAllJobs = getToken => async dispatch => {
  const url = `${window.config.eventsBaseUrl}timetable/`;
  await axios.delete(url, await getApiConfig(getToken));
  dispatch(addNotification({ message: 'Deleted event history', level: 'success' }));
};

export const deleteJobsForProvider = (id, getToken) => async dispatch => {
  const url = `${window.config.eventsBaseUrl}timetable/${id}`;
  await axios.delete(url, await getApiConfig(getToken));
  dispatch(
    addNotification({
      message: 'Deleted event history for provider ' + id,
      level: 'success',
    })
  );
};

export const cancelAllChouetteJobsforAllProviders = getToken => async dispatch => {
  try {
    await axios({
      url: window.config.timetableAdminBaseUrl + `jobs/`,
      timeout: 20000,
      method: 'delete',
      ...(await getApiConfig(getToken)),
    });
    dispatch(
      addNotification({
        message: `Cancelled all chouette jobs for all providers`,
        level: 'success',
      })
    );
  } catch {
    dispatch(
      addNotification({
        message: `Failed deleting all chouttejobs for all providers`,
        level: 'error',
      })
    );
  }
};

export const cleanAllDataspaces = (filter, getToken) => async dispatch => {
  const url = window.config.timetableAdminBaseUrl + `clean/${filter}`;
  try {
    await axios({
      url,
      timeout: 20000,
      method: 'post',
      ...(await getApiConfig(getToken)),
    });
    dispatch(
      addNotification({
        message: 'Cleaning of all dataspaces started with filter ' + filter,
        level: 'success',
      })
    );
  } catch {
    dispatch(
      addNotification({
        message: 'Cleaning of all dataspaces failed with filter ' + filter,
        level: 'error',
      })
    );
  }
};

export const cleanFileFilter = getToken => async dispatch => {
  try {
    await axios({
      url: window.config.timetableAdminBaseUrl + 'idempotentfilter/clean',
      timeout: 20000,
      method: 'post',
      ...(await getApiConfig(getToken)),
    });
    dispatch(addNotification({ message: 'File filter cleaned', level: 'success' }));
  } catch {
    dispatch(addNotification({ message: 'Cleaning file filter failed', level: 'error' }));
  }
};

export default mardukSlice.reducer;
export { mardukSlice };
