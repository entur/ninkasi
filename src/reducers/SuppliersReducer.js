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

import * as types from 'actions/actionTypes';

const initialState = {
  data: [],
  statusList: [],
  statusListAllProviders: [],
  all_suppliers_selected: true,
  activeId: 0,
  allTransportModes: [],
  exportedFiles: null
};

const SuppliersReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ERRORS_SUPPLIERS:
      return Object.assign({}, state, {
        isLoading: false,
        data: action.payLoad,
        error: true
      });
    case types.RECEIVED_SUPPLIERS:
      const level1Providers = action.payLoad
        .filter(p => p.chouetteInfo && p.chouetteInfo.migrateDataToProvider)
        .sort((a, b) => {
          return a.name.localeCompare(b.name, 'nb');
        });

      const level2Providers = action.payLoad
        .filter(p => !(p.chouetteInfo && p.chouetteInfo.migrateDataToProvider))
        .sort((a, b) => {
          return a.name.localeCompare(b.name, 'nb');
        });

      return Object.assign({}, state, {
        isLoading: false,
        data: level1Providers.concat(level2Providers),
        error: false
      });
    case types.REQUESTED_SUPPLIERS:
      return Object.assign({}, state, { isLoading: true, error: false });
    case types.SELECT_SUPPLIER:
      return Object.assign({}, state, { activeId: action.payLoad });
    case types.RECEIVED_SUPPLIER_STATUS:
      return Object.assign({}, state, {
        SupplierStatusIsLoading: true,
        statusList: action.payLoad
      });

    case types.REQUESTED_SUPPLIER_STATUS:
      return Object.assign({}, state, {
        SupplierStatusIsLoading: false,
        statusList: action.payLoad
      });

    case types.SELECTED_ALL_SUPPLIERS:
      return Object.assign({}, state, {
        activeId: -1,
        all_suppliers_selected: true
      });

    case types.RECEIVED_EXPORTED_FILES:
      return Object.assign({}, state, {
        exportedFiles: action.payLoad
      });

    case types.UNSELECTED_ALL_SUPPLIERS:
      return Object.assign({}, state, { all_suppliers_selected: false });

    case types.REQUESTED_ALL_SUPPLIERS_STATUS:
      return Object.assign({}, state, { statusListAllProviders: [] });

    case types.RECEIVED_ALL_SUPPLIERS_STATUS:
      return Object.assign({}, state, {
        statusListAllProviders: action.payLoad
      });

    case types.UPDATED_TARIFF_ZONE_FILE_UPLOAD_PROGRESS:
      return Object.assign({}, state, {
        tariffZoneFileUploadProgress: action.payLoad
      });

    case types.RECEIVED_GRAPH_STATUS:
      return Object.assign({}, state, { ...action.payLoad });

    case types.RECEIVED_GRAPH_VERSIONS:
      return Object.assign({}, state, { ...action.payLoad });

    case types.RECEIVED_TRANSPORT_MODES:
      return Object.assign({}, state, {
        allTransportModes: action.payLoad
      });

    default:
      return state;
  }
};

export default SuppliersReducer;
