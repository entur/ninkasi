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
import { format, formatDistanceToNow } from 'date-fns';
import getApiConfig from 'actions/getApiConfig';
import { getQueryVariable } from 'utils';
import {
  addNotification,
  openedEditProviderDialog,
  resetOutboundFiles,
} from 'reducers/UtilsReducer';
import {
  addExportedFileMetadata,
  addExportedNorwayMetadata,
  formatProviderData,
} from 'actions/formatUtils';
import * as MardukReducer from 'reducers/MardukReducer';

const initialState = {
  data: [],
  statusList: [],
  statusListAllProviders: [],
  all_suppliers_selected: true,
  activeId: 0,
  allTransportModes: [],
  exportedFiles: null,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const addFileExtensions = (files = []) => {
  return files.map(file => {
    if (file.name) {
      file.ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
    }
    return file;
  });
};

const pad2 = n => String(n).padStart(2, '0');

// Format a millisecond delta as HH:mm:ss (matches moment(diff).utc().format('HH:mm:ss')
// for sub-day durations; for >= 24h the original would wrap at 24h too).
const formatElapsed = ms => {
  const totalSeconds = Math.floor(Math.abs(ms) / 1000);
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = totalSeconds % 60;
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
};

export const formatProviderStatusDate = (list, provider) => {
  try {
    return list.map(listItem => {
      const firstEventDate = new Date(listItem.firstEvent);
      const lastEventDate = new Date(listItem.lastEvent);
      listItem.duration = formatElapsed(lastEventDate.getTime() - firstEventDate.getTime());
      listItem.firstEvent = format(firstEventDate, 'yyyy-MM-dd HH:mm:ss');
      listItem.lastEvent = format(lastEventDate, 'yyyy-MM-dd HH:mm:ss');
      listItem.started = formatDistanceToNow(firstEventDate, { addSuffix: true });

      if (provider) {
        listItem.provider = provider;
      }

      if (listItem.events) {
        listItem.events.forEach(function (event) {
          event.date = format(new Date(event.date), 'yyyy-MM-dd HH:mm:ss');
        });
      }
      return listItem;
    });
  } catch (err) {
    console.log(err);
  }
};

const sortEventlistByNewestFirst = list =>
  list.sort((a, b) => new Date(b.firstEvent) - new Date(a.firstEvent));

const getProviderPayload = data => {
  const trimmedData = JSON.parse(JSON.stringify(data).replace(/"\s+|\s+"/g, '"'));
  const payload = {
    name: trimmedData._name,
    chouetteInfo: {
      xmlns: trimmedData._xmlns,
      xmlnsurl: trimmedData._xmlnsurl,
      referential: trimmedData._referential,
      organisation: trimmedData._organisation,
      user: trimmedData._user,
      allowCreateMissingStopPlace: trimmedData._allowCreateMissingStopPlace,
      generateDatedServiceJourneyIds: trimmedData._generateDatedServiceJourneyIds,
      generateMissingServiceLinksForModes: trimmedData._generateMissingServiceLinksForModes,
      migrateDataToProvider: trimmedData._migrateDataToProvider,
      enableAutoImport: trimmedData._enableAutoImport,
      enableAutoValidation: trimmedData._enableAutoValidation,
      enableBlocksExport: trimmedData._enableBlocksExport,
      enableExperimentalImport: trimmedData._enableExperimentalImport,
    },
  };

  if (trimmedData._providerId) {
    payload.id = trimmedData._providerId;
  }

  if (trimmedData._chouetteInfoId) {
    payload.chouetteInfo.id = trimmedData._chouetteInfoId;
  }

  return payload;
};

// ---------------------------------------------------------------------------
// Async thunks
// ---------------------------------------------------------------------------

export const fetchAllProviders = createAsyncThunk(
  'suppliers/fetchAllProviders',
  async (getToken, { dispatch, rejectWithValue }) => {
    const url = window.config.providersBaseUrl;
    try {
      const response = await axios({
        url,
        timeout: 20000,
        method: 'get',
        responseType: 'json',
        ...(await getApiConfig(getToken)),
      });

      const queryTab = getQueryVariable('tab');
      const queryId = getQueryVariable('id');

      /* TODO: This is a hack to ensure that all providers are loaded before
         before getting their respective job status */
      if (!queryId && queryTab === 1) {
        dispatch(fetchAllProviderStatus(getToken));
      }

      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data ?? null);
    }
  }
);

export const fetchProviderStatus = createAsyncThunk(
  'suppliers/fetchProviderStatus',
  async ({ id, getToken }, { rejectWithValue }) => {
    const url = `${window.config.eventsBaseUrl}timetable/${id}`;
    try {
      const response = await axios({
        url,
        timeout: 20000,
        method: 'get',
        responseType: 'json',
        ...(await getApiConfig(getToken)),
      });
      return formatProviderStatusDate(response.data.reverse(), null);
    } catch (err) {
      return rejectWithValue(err?.response?.data ?? null);
    }
  },
  {
    condition: ({ id }) => !(id < 0),
  }
);

export const fetchAllProviderStatus = createAsyncThunk(
  'suppliers/fetchAllProviderStatus',
  async (getToken, { getState, rejectWithValue }) => {
    const state = getState();
    const providers = state.SuppliersReducer.data;
    const url = `${window.config.eventsBaseUrl}timetable`;

    try {
      const response = await axios({
        url,
        timeout: 20000,
        method: 'get',
        responseType: 'json',
        ...(await getApiConfig(getToken)),
      });

      const providerStatus = response.data.map(status => {
        let provider = null;
        for (let i = 0; i < providers.length; i++) {
          if (providers[i].id === status.providerId) {
            provider = providers[i];
            break;
          }
        }
        return formatProviderStatusDate([status], provider);
      });
      const eventList = [].concat(...providerStatus);
      return sortEventlistByNewestFirst(eventList);
    } catch (err) {
      return rejectWithValue(err?.response?.data ?? null);
    }
  }
);

export const createProvider = createAsyncThunk(
  'suppliers/createProvider',
  async ({ data, getToken }, { dispatch, rejectWithValue }) => {
    const url = `${window.config.providersBaseUrl}`;
    const provider = getProviderPayload(data);
    try {
      const response = await axios.post(url, provider, await getApiConfig(getToken));
      const id = response.data.id;
      window.history.pushState(
        window.config.endpointBase,
        'Title',
        `${window.config.endpointBase}?id=${id}`
      );
      dispatch(fetchAllProviders(getToken)).then(() => {
        dispatch(selectActiveSupplier(id, getToken));
      });
      dispatch(addNotification({ message: 'Provider created', level: 'success' }));
      return response.data;
    } catch (err) {
      dispatch(addNotification({ message: 'Unable to create provider', level: 'error' }));
      dispatch(fetchAllProviders(getToken));
      return rejectWithValue(err?.response?.data ?? null);
    }
  }
);

export const updateProvider = createAsyncThunk(
  'suppliers/updateProvider',
  async ({ data, getToken }, { dispatch, rejectWithValue }) => {
    const provider = getProviderPayload(data);
    const url = `${window.config.providersBaseUrl}${provider.id}`;
    try {
      const response = await axios.put(url, provider, await getApiConfig(getToken));
      dispatch(addNotification({ message: 'Updated provider successfully', level: 'success' }));
      dispatch(fetchAllProviders(getToken));
      return response.data;
    } catch (err) {
      dispatch(addNotification({ message: 'Unable to update provider', level: 'error' }));
      return rejectWithValue(err?.response?.data ?? null);
    }
  }
);

export const fetchProvider = createAsyncThunk(
  'suppliers/fetchProvider',
  async ({ id, getToken }, { dispatch, rejectWithValue }) => {
    const url = `${window.config.providersBaseUrl}${id}`;
    try {
      const response = await axios.get(url, await getApiConfig(getToken));

      const tabQueryParam = getQueryVariable('tab') ? `&tab=${getQueryVariable('tab')}` : '';

      if (getQueryVariable('tab') === 'events') {
        dispatch(fetchProviderStatus({ id, getToken }));
      } else if (getQueryVariable('tab') === 'chouetteJobs') {
        dispatch(MardukReducer.getChouetteJobStatus(getToken));
      }

      window.history.pushState(
        window.config.endpointBase,
        'Title',
        `${window.config.endpointBase}?id=${id}${tabQueryParam}`
      );

      return response.data;
    } catch (err) {
      dispatch(addNotification({ message: 'Unable to fetch provider', level: 'error' }));
      return rejectWithValue(err?.response?.data ?? null);
    }
  },
  {
    condition: ({ id }) => !(id < 0),
  }
);

export const deleteProvider = createAsyncThunk(
  'suppliers/deleteProvider',
  async ({ providerId, getToken }, { dispatch, rejectWithValue }) => {
    const url = `${window.config.providersBaseUrl}${providerId}`;
    try {
      const response = await axios.delete(url, await getApiConfig(getToken));
      dispatch(selectActiveSupplier(-1, getToken));
      dispatch(addNotification({ message: 'Provider deleted', level: 'success' }));
      dispatch(fetchAllProviders(getToken)).then(() => {
        window.history.pushState(
          window.config.endpointBase,
          'Title',
          `${window.config.endpointBase}`
        );
        dispatch(selectAllSuppliers());
      });
      return response.data;
    } catch (err) {
      dispatch(addNotification({ message: 'Unable to delete provider', level: 'error' }));
      return rejectWithValue(err?.data ?? null);
    }
  }
);

export const fetchGraphStatus = createAsyncThunk(
  'suppliers/fetchGraphStatus',
  async (getToken, { rejectWithValue }) => {
    const url = window.config.eventsBaseUrl + `admin_summary/status/aggregation`;
    try {
      const response = await axios.get(url, await getApiConfig(getToken));
      const status = {
        graphStatus: {},
        baseGraphStatus: {},
      };
      response.data.forEach(type => {
        if (type.jobType === 'OTP2_BUILD_GRAPH') {
          status.graphStatus.otp2 = {
            status: type.currentState,
            started: type.currentStateDate,
          };
        } else if (type.jobType === 'OTP2_BUILD_BASE') {
          status.baseGraphStatus.otp2 = {
            status: type.currentState,
            started: type.currentStateDate,
          };
        }
      });
      return status;
    } catch (err) {
      console.error('error receiving graph status', err);
      return rejectWithValue(err);
    }
  }
);

export const fetchOTPGraphVersions = createAsyncThunk(
  'suppliers/fetchOTPGraphVersions',
  async (getToken, { rejectWithValue }) => {
    const url = window.config.timetableAdminBaseUrl + `routing_graph/graphs`;
    try {
      const response = await axios.get(url, await getApiConfig(getToken));
      return {
        streetGraphs: response.data.streetGraphs,
        transitGraphs: response.data.transitGraphs,
      };
    } catch (err) {
      console.error('error receiving graph status', err);
      return rejectWithValue(err);
    }
  }
);

export const fetchExportedFiles = createAsyncThunk(
  'suppliers/fetchExportedFiles',
  async (getToken, { rejectWithValue }) => {
    const url = window.config.timetableAdminBaseUrl + 'export/files';
    try {
      const response = await axios({
        url,
        timeout: 20000,
        method: 'get',
        responseType: 'json',
        ...(await getApiConfig(getToken)),
      });

      if (response.data && response.data.files) {
        const providerData = {};
        const norwayGTFS = [];
        const norwayNetex = [];

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
        return { providerData: formattedProviderData };
      }
      return null;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchTransportModes = createAsyncThunk(
  'suppliers/fetchTransportModes',
  async (getToken, { rejectWithValue }) => {
    const url = `${window.config.providersBaseUrl}transport_modes`;
    try {
      const response = await axios.get(url, await getApiConfig(getToken));
      return response.data;
    } catch (err) {
      console.log('Error receiving transport modes', err);
      return rejectWithValue(err);
    }
  }
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    selectSupplier(state, action) {
      state.activeId = action.payload;
    },
    selectedAllSuppliers(state) {
      state.activeId = -1;
      state.all_suppliers_selected = true;
    },
    unselectedAllSuppliers(state) {
      state.all_suppliers_selected = false;
    },
  },
  extraReducers: builder => {
    builder
      // fetchAllProviders
      .addCase(fetchAllProviders.pending, state => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(fetchAllProviders.fulfilled, (state, action) => {
        const level1Providers = action.payload
          .filter(p => p.chouetteInfo && p.chouetteInfo.migrateDataToProvider)
          .sort((a, b) => a.name.localeCompare(b.name, 'nb'));
        const level2Providers = action.payload
          .filter(p => !(p.chouetteInfo && p.chouetteInfo.migrateDataToProvider))
          .sort((a, b) => a.name.localeCompare(b.name, 'nb'));
        state.isLoading = false;
        state.data = level1Providers.concat(level2Providers);
        state.error = false;
      })
      .addCase(fetchAllProviders.rejected, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = true;
      })
      // fetchProviderStatus
      .addCase(fetchProviderStatus.pending, state => {
        state.SupplierStatusIsLoading = false;
        state.statusList = null;
      })
      .addCase(fetchProviderStatus.fulfilled, (state, action) => {
        state.SupplierStatusIsLoading = true;
        state.statusList = action.payload;
      })
      .addCase(fetchProviderStatus.rejected, () => {
        // ERROR_SUPPLIER_STATUS originally did not change suppliers state.
      })
      // fetchAllProviderStatus
      .addCase(fetchAllProviderStatus.pending, state => {
        state.statusListAllProviders = [];
      })
      .addCase(fetchAllProviderStatus.fulfilled, (state, action) => {
        state.statusListAllProviders = action.payload;
      })
      // fetchGraphStatus
      .addCase(fetchGraphStatus.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })
      // fetchOTPGraphVersions
      .addCase(fetchOTPGraphVersions.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })
      // fetchExportedFiles
      .addCase(fetchExportedFiles.pending, state => {
        state.exportedFiles = null;
      })
      .addCase(fetchExportedFiles.fulfilled, (state, action) => {
        if (action.payload) {
          state.exportedFiles = action.payload;
        }
      })
      // fetchTransportModes
      .addCase(fetchTransportModes.fulfilled, (state, action) => {
        state.allTransportModes = action.payload;
      });
  },
});

export const { selectSupplier, selectedAllSuppliers, unselectedAllSuppliers } =
  suppliersSlice.actions;

// ---------------------------------------------------------------------------
// Composite / side-effecting thunks owned by the suppliers slice
// ---------------------------------------------------------------------------

export const selectAllSuppliers = () => dispatch => {
  const tabQueryParam = getQueryVariable('tab') ? `?tab=${getQueryVariable('tab')}` : '';
  window.history.pushState(
    window.config.endpointBase,
    'Title',
    `${window.config.endpointBase}${tabQueryParam}`
  );
  dispatch(selectedAllSuppliers());
};

export const selectActiveSupplier = (id, getToken) => dispatch => {
  dispatch(selectSupplier(id));
  dispatch(resetOutboundFiles());
  dispatch(MardukReducer.fetchFilenames({ id, getToken }));
  dispatch(fetchProvider({ id, getToken }));
  dispatch(MardukReducer.setActiveActionFilter('', getToken));
  dispatch(unselectedAllSuppliers());
};

export const refreshSupplierData = getToken => (dispatch, getState) => {
  const state = getState();
  const { activeId } = state.SuppliersReducer;
  dispatch(selectActiveSupplier(activeId, getToken));
  dispatch(MardukReducer.fetchFilenames({ id: activeId, getToken }));
  dispatch(fetchProviderStatus({ id: activeId, getToken }));
  dispatch(MardukReducer.getChouetteJobStatus(getToken));
};

export const openEditProviderDialog = getToken => (dispatch, getState) => {
  const state = getState();
  dispatch(fetchProvider({ id: state.SuppliersReducer.activeId, getToken }));
  dispatch(openedEditProviderDialog());
};

export default suppliersSlice.reducer;
export { suppliersSlice };
