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
 * Back-compat namespace shim for the (now slice-owned) Suppliers/Marduk
 * actions.  All real logic lives in `reducers/SuppliersReducer.js`,
 * `reducers/MardukReducer.js`, and `reducers/UtilsReducer.js`.  Existing
 * call sites use `SuppliersActions.<actionName>(...)` so we re-expose
 * everything here under the old names and original (positional) call
 * signatures.
 */

import {
  // sync slice actions
  selectSupplier,
  selectedAllSuppliers,
  unselectedAllSuppliers,
  // async thunks
  fetchAllProviders,
  fetchProviderStatus,
  fetchAllProviderStatus,
  createProvider as createProviderThunk,
  updateProvider as updateProviderThunk,
  fetchProvider,
  deleteProvider as deleteProviderThunk,
  fetchGraphStatus,
  fetchOTPGraphVersions,
  fetchExportedFiles,
  fetchTransportModes,
  // composite / plain thunks
  selectAllSuppliers,
  selectActiveSupplier,
  refreshSupplierData,
  openEditProviderDialog,
  // helpers
  addFileExtensions,
  formatProviderStatusDate,
} from 'reducers/SuppliersReducer';

import {
  // async thunks
  exportData as exportDataThunk,
  transferData as transferDataThunk,
  importData as importDataThunk,
  cleanDataspace as cleanDataspaceThunk,
  validateProvider as validateProviderThunk,
  buildGraph,
  buildBaseGraph,
  buildCandidateGraphOTP,
  buildCandidateBaseGraphOTP,
  fetchOSM,
  fetchFilenames as fetchFilenamesThunk,
  getChouetteJobStatus,
  getChouetteJobsForAllSuppliers,
  cancelChouetteJobForProvider as cancelChouetteJobForProviderThunk,
  cancelAllChouetteJobsforProvider as cancelAllChouetteJobsforProviderThunk,
  // composite / plain thunks
  setActiveActionFilter,
  setActiveActionAllFilter,
  toggleChouetteInfoCheckboxFilterAndRefetch,
  toggleChouetteInfoCheckboxAllFilterAndRefetch,
  cleanStopPlacesInChouette,
  deleteAllJobs,
  deleteJobsForProvider,
  cancelAllChouetteJobsforAllProviders,
  cleanAllDataspaces,
  cleanFileFilter,
  restoreFilesToOutbound,
} from 'reducers/MardukReducer';

import {
  addNotification as addNotificationAction,
  appendFilesToOutbound,
  removeFilesFromOutbound,
  updateFilesToOutbound,
  toggleExpandableForEventWrapper,
  dismissEditProviderDialog,
  openedEditProviderDialog,
  openedNewProviderDialog,
  sortEventListByColumn,
  sortChouetteAllByColumn,
  sortChouetteByColumn,
} from 'reducers/UtilsReducer';

// Re-export the addFileExtensions helper as a named export (the test
// in src/tests/filelist.spec.js imports it directly).
export { addFileExtensions };

const SuppliersActions = {
  // -------- pure helpers --------
  formatProviderStatusDate,

  // -------- suppliers slice --------
  changeActiveSupplierId: selectSupplier,
  unselectAllSuppliers: () => unselectedAllSuppliers(),
  selectAllSuppliers,
  selectActiveSupplier,
  refreshSupplierData,
  openEditProviderDialog,

  // suppliers async thunks (positional → object adapters)
  getProviderStatus: (id, getToken) => fetchProviderStatus({ id, getToken }),
  getAllProviderStatus: getToken => fetchAllProviderStatus(getToken),
  getAllProviders: getToken => fetchAllProviders(getToken),
  fetchProvider: (id, getToken) => fetchProvider({ id, getToken }),
  createProvider: (data, getToken) => createProviderThunk({ data, getToken }),
  updateProvider: (data, getToken) => updateProviderThunk({ data, getToken }),
  deleteProvider: (providerId, getToken) => deleteProviderThunk({ providerId, getToken }),
  getGraphStatus: getToken => fetchGraphStatus(getToken),
  getOTPGraphVersions: getToken => fetchOTPGraphVersions(getToken),
  getExportedFiles: getToken => fetchExportedFiles(getToken),
  getTransportModes: getToken => fetchTransportModes(getToken),

  // -------- marduk slice --------
  exportData: (id, getToken) => exportDataThunk({ id, getToken }),
  transferData: (id, getToken) => transferDataThunk({ id, getToken }),
  importData: (id, selectedFiles, isFlex, getToken) =>
    importDataThunk({ id, selectedFiles, isFlex, getToken }),
  cleanDataspace: (id, getToken) => cleanDataspaceThunk({ id, getToken }),
  validateProvider: (id, getToken) => validateProviderThunk({ id, getToken }),
  buildGraph,
  buildBaseGraph,
  buildCandidateGraphOTP,
  buildCandidateBaseGraphOTP,
  fetchOSM,
  fetchFilenames: (id, getToken) => fetchFilenamesThunk({ id, getToken }),
  getChouetteJobStatus,
  getChouetteJobsForAllSuppliers,
  cancelChouetteJobForProvider: (providerId, chouetteId, getToken) =>
    cancelChouetteJobForProviderThunk({ providerId, chouetteId, getToken }),
  cancelAllChouetteJobsforProvider: (providerId, getToken) =>
    cancelAllChouetteJobsforProviderThunk({ providerId, getToken }),
  setActiveActionFilter,
  setActiveActionAllFilter,
  toggleChouetteInfoCheckboxFilter: toggleChouetteInfoCheckboxFilterAndRefetch,
  toggleChouetteInfoCheckboxAllFilter: toggleChouetteInfoCheckboxAllFilterAndRefetch,
  cleanStopPlacesInChouette,
  deleteAllJobs,
  deleteJobsForProvider,
  cancelAllChouetteJobsforAllProviders,
  cleanAllDataspaces,
  cleanFileFilter,

  // -------- utils slice (re-exports) --------
  addNotification: (message, level) => addNotificationAction({ message, level }),
  restoreFilesToOutbound,
  updateOutboundFilelist: updateFilesToOutbound,
  appendFilesToOutbound,
  removeFilesToOutbound: removeFilesFromOutbound,
  toggleExpandableEventsContent: toggleExpandableForEventWrapper,
  openEditModalDialog: openedEditProviderDialog,
  openNewProviderDialog: openedNewProviderDialog,
  dismissEditProviderDialog,
  sortEventlistByColumn: sortEventListByColumn,
  sortChouetteAllByColumn,
  sortChouetteByColumn,

  // sortListByColumn is a router that dispatches to the appropriate slice
  // action above based on listName.
  sortListByColumn: (listName, columnName) => dispatch => {
    switch (listName) {
      case 'events':
        dispatch(sortEventListByColumn(columnName));
        break;
      case 'chouetteAll':
        dispatch(sortChouetteAllByColumn(columnName));
        break;
      case 'chouette':
        dispatch(sortChouetteByColumn(columnName));
        break;
      default:
    }
  },
};

export default SuppliersActions;
