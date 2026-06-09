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

import { createSlice } from '@reduxjs/toolkit';
import * as types from 'actions/actionTypes';

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

const setOpData = (state, key, payLoad, errored) => {
  state.isLoading = false;
  state[key] = payLoad;
  state.error = errored;
};

const setRequesting = state => {
  state.isLoading = true;
  state.error = false;
};

const mardukSlice = createSlice({
  name: 'marduk',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(types.ERROR_IMPORT_DATA, (state, action) =>
        setOpData(state, 'import_data', action.payLoad, true)
      )
      .addCase(types.SUCCESS_IMPORT_DATA, (state, action) =>
        setOpData(state, 'import_data', action.payLoad, false)
      )
      .addCase(types.REQUEST_IMPORT_DATA, setRequesting)
      .addCase(types.ERROR_EXPORT_DATA, (state, action) =>
        setOpData(state, 'export_data', action.payLoad, true)
      )
      .addCase(types.SUCCESS_EXPORT_DATA, (state, action) =>
        setOpData(state, 'export_data', action.payLoad, false)
      )
      .addCase(types.REQUEST_EXPORT_DATA, setRequesting)
      .addCase(types.ERROR_TRANSFER_DATA, (state, action) =>
        setOpData(state, 'transfer_data', action.payLoad, true)
      )
      .addCase(types.SUCCESS_TRANSFER_DATA, (state, action) =>
        setOpData(state, 'transfer_data', action.payLoad, false)
      )
      .addCase(types.REQUEST_TRANSFER_DATA, setRequesting)
      .addCase(types.ERROR_DELETE_DATA, (state, action) =>
        setOpData(state, 'delete_data', action.payLoad, true)
      )
      .addCase(types.SUCCESS_DELETE_DATA, (state, action) =>
        setOpData(state, 'delete_data', action.payLoad, false)
      )
      .addCase(types.REQUEST_DELETE_DATA, setRequesting)
      .addCase(types.ERROR_BUILD_GRAPH, (state, action) =>
        setOpData(state, 'build_graph', action.payLoad, true)
      )
      .addCase(types.SUCCESS_BUILD_GRAPH, (state, action) =>
        setOpData(state, 'build_graph', action.payLoad, false)
      )
      .addCase(types.REQUEST_BUILD_GRAPH, setRequesting)
      .addCase(types.ERROR_BUILD_BASE_GRAPH, (state, action) =>
        setOpData(state, 'build_base_graph', action.payLoad, true)
      )
      .addCase(types.SUCCESS_BUILD_BASE_GRAPH, (state, action) =>
        setOpData(state, 'build_base_graph', action.payLoad, false)
      )
      .addCase(types.REQUEST_BUILD_BASE_GRAPH, setRequesting)
      .addCase(types.ERROR_BUILD_CANDIDATE_GRAPH_OTP, (state, action) =>
        setOpData(state, 'build_candidate_graph_otp', action.payLoad, true)
      )
      .addCase(types.SUCCESS_BUILD_CANDIDATE_GRAPH_OTP, (state, action) =>
        setOpData(state, 'build_candidate_graph_otp', action.payLoad, false)
      )
      .addCase(types.REQUEST_BUILD_CANDIDATE_GRAPH_OTP, setRequesting)
      .addCase(types.ERROR_BUILD_CANDIDATE_BASE_GRAPH_OTP, (state, action) =>
        setOpData(state, 'build_candidate_base_graph_otp', action.payLoad, true)
      )
      .addCase(types.SUCCESS_BUILD_CANDIDATE_BASE_GRAPH_OTP, (state, action) =>
        setOpData(state, 'build_candidate_base_graph_otp', action.payLoad, false)
      )
      .addCase(types.REQUEST_BUILD_CANDIDATE_BASE_GRAPH_OTP, setRequesting)
      .addCase(types.ERROR_FETCH_OSM, (state, action) =>
        setOpData(state, 'fetch_osm', action.payLoad, true)
      )
      .addCase(types.SUCCESS_FETCH_OSM, (state, action) =>
        setOpData(state, 'fetch_osm', action.payLoad, false)
      )
      .addCase(types.REQUEST_FETCH_OSM, setRequesting)
      .addCase(types.ERROR_VALIDATE_PROVIDER, (state, action) =>
        setOpData(state, 'validate_provider', action.payLoad, true)
      )
      .addCase(types.SUCCESS_VALIDATE_PROVIDER, (state, action) =>
        setOpData(state, 'validate_provider', action.payLoad, false)
      )
      .addCase(types.REQUEST_FILENAMES, state => {
        state.filenames = { isLoading: true, error: false };
      })
      .addCase(types.SUCCESS_FILENAMES, (state, action) => {
        state.filenames = { isLoading: false, data: action.payLoad, error: false };
      })
      .addCase(types.ERROR_FILENAMES, (state, action) => {
        // NOTE: typo `filesnames` preserved from original behavior.
        state.filesnames = { isLoading: false, error: action.payLoad };
      })
      .addCase(types.SUCCESS_CHOUETTE_JOB_STATUS, (state, action) => {
        state.requesting_chouette_job = false;
        state.chouetteJobStatus = action.payLoad;
      })
      .addCase(types.SUCCESS_ALL_CHOUETTE_JOB_STATUS, (state, action) => {
        state.requesting_chouette_all_job = false;
        state.chouetteAllJobStatus = action.payLoad;
      })
      .addCase(types.TOGGLE_CHOUETTE_INFO_CHECKBOX_FILTER, (state, action) => {
        state.chouetteJobFilter[action.payLoad.option] = action.payLoad.value;
      })
      .addCase(types.TOGGLE_CHOUETTE_INFO_CHECKBOX_ALL_FILTER, (state, action) => {
        state.chouetteJobAllFilter[action.payLoad.option] = action.payLoad.value;
      })
      .addCase(types.SET_ACTIVE_ACTION_FILTER, (state, action) => {
        state.actionFilter = action.payLoad;
      })
      .addCase(types.SET_ACTIVE_ACTION_ALL_FILTER, (state, action) => {
        state.actionAllFilter = action.payLoad;
      })
      .addCase(types.REQUESTED_CHOUETTE_JOBS_FOR_PROVIDER, (state, action) => {
        if (state.chouette_cancel_token) {
          state.chouette_cancel_token('Operation canceled by new request.');
        }
        state.requesting_chouette_job = true;
        state.chouette_cancel_token = action.payLoad;
      })
      .addCase(types.REQUESTED_ALL_CHOUETTE_JOB_STATUS, (state, action) => {
        if (state.chouette_cancel_all_token) {
          state.chouette_cancel_all_token('Operation canceled by new request');
        }
        state.requesting_chouette_all_job = true;
        state.chouette_cancel_all_token = action.payLoad;
      })
      .addCase(types.SELECTED_ALL_SUPPLIERS, state => {
        state.chouette_cancel_all_token = null;
        state.chouette_cancel_token = null;
      });
  },
});

export default mardukSlice.reducer;
