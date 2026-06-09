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
  data: [],
  statusList: [],
  statusListAllProviders: [],
  all_suppliers_selected: true,
  activeId: 0,
  allTransportModes: [],
  exportedFiles: null,
};

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(types.ERRORS_SUPPLIERS, (state, action) => {
        state.isLoading = false;
        state.data = action.payLoad;
        state.error = true;
      })
      .addCase(types.RECEIVED_SUPPLIERS, (state, action) => {
        const level1Providers = action.payLoad
          .filter(p => p.chouetteInfo && p.chouetteInfo.migrateDataToProvider)
          .sort((a, b) => a.name.localeCompare(b.name, 'nb'));
        const level2Providers = action.payLoad
          .filter(p => !(p.chouetteInfo && p.chouetteInfo.migrateDataToProvider))
          .sort((a, b) => a.name.localeCompare(b.name, 'nb'));
        state.isLoading = false;
        state.data = level1Providers.concat(level2Providers);
        state.error = false;
      })
      .addCase(types.REQUESTED_SUPPLIERS, state => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(types.SELECT_SUPPLIER, (state, action) => {
        state.activeId = action.payLoad;
      })
      .addCase(types.RECEIVED_SUPPLIER_STATUS, (state, action) => {
        state.SupplierStatusIsLoading = true;
        state.statusList = action.payLoad;
      })
      .addCase(types.REQUESTED_SUPPLIER_STATUS, (state, action) => {
        state.SupplierStatusIsLoading = false;
        state.statusList = action.payLoad;
      })
      .addCase(types.SELECTED_ALL_SUPPLIERS, state => {
        state.activeId = -1;
        state.all_suppliers_selected = true;
      })
      .addCase(types.RECEIVED_EXPORTED_FILES, (state, action) => {
        state.exportedFiles = action.payLoad;
      })
      .addCase(types.UNSELECTED_ALL_SUPPLIERS, state => {
        state.all_suppliers_selected = false;
      })
      .addCase(types.REQUESTED_ALL_SUPPLIERS_STATUS, state => {
        state.statusListAllProviders = [];
      })
      .addCase(types.RECEIVED_ALL_SUPPLIERS_STATUS, (state, action) => {
        state.statusListAllProviders = action.payLoad;
      })
      .addCase(types.RECEIVED_GRAPH_STATUS, (state, action) => {
        Object.assign(state, action.payLoad);
      })
      .addCase(types.RECEIVED_GRAPH_VERSIONS, (state, action) => {
        Object.assign(state, action.payLoad);
      })
      .addCase(types.RECEIVED_TRANSPORT_MODES, (state, action) => {
        state.allTransportModes = action.payLoad;
      });
  },
});

export default suppliersSlice.reducer;
