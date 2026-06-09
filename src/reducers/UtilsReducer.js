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

const toggleSortOrder = (current, payLoad) => {
  if (current.property === payLoad) {
    return current.sortOrder >= 1 ? 0 : 1;
  }
  return 0;
};

const utilsSlice = createSlice({
  name: 'utils',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(types.ADD_NOTIFICATION, (state, action) => {
        state.notification = {
          message: action.message,
          level: action.level,
        };
      })
      .addCase(types.APPEND_FILES_TO_OUTBOUND, (state, action) => {
        const incoming = action.payLoad.filter(x => !state.outboundFilelist.includes(x));
        state.outboundFilelist.push(...incoming);
      })
      .addCase(types.REMOVE_FILES_FROM_OUTBOUND, (state, action) => {
        state.outboundFilelist = state.outboundFilelist.filter(x => !action.payLoad.includes(x));
      })
      .addCase(types.RESET_OUTBOUND_FILES, state => {
        state.outboundFilelist = [];
      })
      .addCase(types.UPDATE_FILES_TO_OUTBOUND, (state, action) => {
        state.outboundFilelist = action.payLoad;
      })
      .addCase(types.TOGGLE_EXPANDABLE_FOR_EVENT_WRAPPER, (state, action) => {
        const idx = state.expandedEvents.indexOf(action.payLoad);
        if (idx === -1) {
          state.expandedEvents.push(action.payLoad);
        } else {
          state.expandedEvents.splice(idx, 1);
        }
      })
      .addCase(types.DISMISS_EDIT_PROVIDER_DIALOG, state => {
        state.editProviderModal = false;
      })
      .addCase(types.OPENED_EDIT_PROVIDER_DIALOG, state => {
        state.shouldUpdateProvider = true;
        state.editProviderModal = true;
      })
      .addCase(types.OPENED_NEW_PROVIDER_DIALOG, state => {
        state.shouldUpdateProvider = false;
        state.editProviderModal = true;
      })
      .addCase(types.SUCCESS_FETCH_PROVIDER, (state, action) => {
        state.supplierForm = action.payLoad;
      })
      .addCase(types.SORT_EVENTLIST_BY_COLUMN, (state, action) => {
        state.eventListSortOrder = {
          property: action.payLoad,
          sortOrder: toggleSortOrder(state.eventListSortOrder, action.payLoad),
        };
      })
      .addCase(types.SORT_CHOUETTE_ALL_BY_COLUMN, (state, action) => {
        state.chouetteListAllSortOrder = {
          property: action.payLoad,
          sortOrder: toggleSortOrder(state.chouetteListAllSortOrder, action.payLoad),
        };
      })
      .addCase(types.SORT_CHOUETTE_BY_COLUMN, (state, action) => {
        state.chouetteListSortOrder = {
          property: action.payLoad,
          sortOrder: toggleSortOrder(state.chouetteListSortOrder, action.payLoad),
        };
      })
      .addCase(types.CONFIG_LOADED, state => {
        state.isConfigLoaded = true;
      });
  },
});

export default utilsSlice.reducer;
