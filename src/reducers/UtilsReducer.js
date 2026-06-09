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

const initialState = {
  shouldUpdateProvider: false,
  editProviderModal: false,
  outboundFilelist: [],
  expandedEvents: [],
  isConfigLoaded: false,
  activeTab: 'migrateData',
  eventListSortOrder: {
    property: 'firstEvent',
    sortOrder: 0, // 0 = asc, 1 = desc
  },
  chouetteListAllSortOrder: {
    property: 'id',
    sortOrder: 0,
  },
  chouetteListSortOrder: {
    property: 'id',
    sortOrder: 0,
  },
  supplierForm: {
    chouetteInfo: {},
  },
};

const toggleSortOrder = (current, property) =>
  current.property === property ? (current.sortOrder >= 1 ? 0 : 1) : 0;

// fetchProvider lives in SuppliersReducer; referencing it here would create
// a runtime-only cyclic import, so listen to the fulfilled action by its
// auto-generated type string. This restores the pre-PR-B' behavior where
// SUCCESS_FETCH_PROVIDER populated `supplierForm` — without it the migrate-
// data tab can't see the active provider's chouetteInfo.
const FETCH_PROVIDER_FULFILLED = 'suppliers/fetchProvider/fulfilled';

const utilsSlice = createSlice({
  name: 'utils',
  initialState,
  extraReducers: builder => {
    builder.addCase(FETCH_PROVIDER_FULFILLED, (state, action) => {
      state.supplierForm = action.payload;
    });
  },
  reducers: {
    addNotification(state, action) {
      state.notification = action.payload;
    },
    appendFilesToOutbound(state, action) {
      const incoming = action.payload.filter(x => !state.outboundFilelist.includes(x));
      state.outboundFilelist.push(...incoming);
    },
    removeFilesFromOutbound(state, action) {
      state.outboundFilelist = state.outboundFilelist.filter(x => !action.payload.includes(x));
    },
    resetOutboundFiles(state) {
      state.outboundFilelist = [];
    },
    updateFilesToOutbound(state, action) {
      state.outboundFilelist = action.payload;
    },
    toggleExpandableForEventWrapper(state, action) {
      const idx = state.expandedEvents.indexOf(action.payload);
      if (idx === -1) {
        state.expandedEvents.push(action.payload);
      } else {
        state.expandedEvents.splice(idx, 1);
      }
    },
    dismissEditProviderDialog(state) {
      state.editProviderModal = false;
    },
    openedEditProviderDialog(state) {
      state.shouldUpdateProvider = true;
      state.editProviderModal = true;
    },
    openedNewProviderDialog(state) {
      state.shouldUpdateProvider = false;
      state.editProviderModal = true;
    },
    setSupplierForm(state, action) {
      state.supplierForm = action.payload;
    },
    sortEventListByColumn(state, action) {
      state.eventListSortOrder = {
        property: action.payload,
        sortOrder: toggleSortOrder(state.eventListSortOrder, action.payload),
      };
    },
    sortChouetteAllByColumn(state, action) {
      state.chouetteListAllSortOrder = {
        property: action.payload,
        sortOrder: toggleSortOrder(state.chouetteListAllSortOrder, action.payload),
      };
    },
    sortChouetteByColumn(state, action) {
      state.chouetteListSortOrder = {
        property: action.payload,
        sortOrder: toggleSortOrder(state.chouetteListSortOrder, action.payload),
      };
    },
    notifyConfigIsLoaded(state) {
      state.isConfigLoaded = true;
    },
  },
});

export const {
  addNotification,
  appendFilesToOutbound,
  removeFilesFromOutbound,
  resetOutboundFiles,
  updateFilesToOutbound,
  toggleExpandableForEventWrapper,
  dismissEditProviderDialog,
  openedEditProviderDialog,
  openedNewProviderDialog,
  setSupplierForm,
  sortEventListByColumn,
  sortChouetteAllByColumn,
  sortChouetteByColumn,
  notifyConfigIsLoaded,
} = utilsSlice.actions;

export default utilsSlice.reducer;
