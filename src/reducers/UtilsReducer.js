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

const intialState = {
  shouldUpdateProvider: false,
  editProviderModal: false,
  outboundFilelist: [],
  expandedEvents: [],
  isConfigLoaded: false,
  activeTab: 'migrateData',
  eventListSortOrder: {
    property: 'firstEvent',
    sortOrder: 0 // 0 = asc, 1 = desc
  },
  chouetteListAllSortOrder: {
    property: 'id',
    sortOrder: 0
  },
  chouetteListSortOrder: {
    property: 'id',
    sortOrder: 0
  },
  supplierForm: {
    chouetteInfo: {}
  }
};

const UtilsReducer = (state = intialState, action) => {
  switch (action.type) {
    case types.ADD_NOTIFICATION:
      return Object.assign({}, state, {
        notification: {
          message: action.message,
          level: action.level
        }
      });

    case types.APPEND_FILES_TO_OUTBOUND:
      return Object.assign({}, state, {
        outboundFilelist: [
          ...state.outboundFilelist,
          ...action.payLoad.filter(
            x => state.outboundFilelist.indexOf(x) === -1
          )
        ]
      });

    case types.REMOVE_FILES_FROM_OUTBOUND:
      return Object.assign({}, state, {
        outboundFilelist: state.outboundFilelist.filter(
          x => action.payLoad.indexOf(x) === -1
        )
      });

    case types.RESET_OUTBOUND_FILES:
      return Object.assign({}, state, { outboundFilelist: [] });

    case types.UPDATE_FILES_TO_OUTBOUND:
      return Object.assign({}, state, { outboundFilelist: action.payLoad });

    case types.TOGGLE_EXPANDABLE_FOR_EVENT_WRAPPER:
      return Object.assign({}, state, {
        expandedEvents: toggleExpandedEvents(
          action.payLoad,
          state.expandedEvents
        )
      });

    case types.DISMISS_EDIT_PROVIDER_DIALOG:
      return Object.assign({}, state, { editProviderModal: false });

    case types.OPENED_EDIT_PROVIDER_DIALOG:
      return Object.assign({}, state, {
        shouldUpdateProvider: true,
        editProviderModal: true
      });

    case types.OPENED_NEW_PROVIDER_DIALOG:
      return Object.assign({}, state, {
        shouldUpdateProvider: false,
        editProviderModal: true
      });

    case types.OPENED_POI_FILTER_DIALOG:
      return Object.assign({}, state, {
        shouldUpdatePoiFilter: true
      });

    case types.SUCCESS_FETCH_PROVIDER:
      return Object.assign({}, state, { supplierForm: action.payLoad });

    case types.SORT_EVENTLIST_BY_COLUMN:
      let eventsSortOrder = 0;

      if (state.eventListSortOrder.property === action.payLoad) {
        eventsSortOrder = state.eventListSortOrder.sortOrder === 1 ? 0 : 1;
      }

      return Object.assign({}, state, {
        eventListSortOrder: {
          property: action.payLoad,
          sortOrder: eventsSortOrder
        }
      });

    case types.SORT_CHOUETTE_ALL_BY_COLUMN:
      let chouetteAllSortOrder = 0;

      if (state.chouetteListAllSortOrder.property === action.payLoad) {
        chouetteAllSortOrder =
          state.chouetteListAllSortOrder.sortOrder >= 1 ? 0 : 1;
      }

      return Object.assign({}, state, {
        chouetteListAllSortOrder: {
          property: action.payLoad,
          sortOrder: chouetteAllSortOrder
        }
      });

    case types.SORT_CHOUETTE_BY_COLUMN:
      let chouetteSortOrder = 0;

      if (state.chouetteListSortOrder.property === action.payLoad) {
        chouetteSortOrder = state.chouetteListSortOrder.sortOrder >= 1 ? 0 : 1;
      }

      return Object.assign({}, state, {
        chouetteListSortOrder: {
          property: action.payLoad,
          sortOrder: chouetteSortOrder
        }
      });

    case types.CONFIG_LOADED:
      return Object.assign({}, state, { isConfigLoaded: true });

    default:
      return state;
  }
};

const toggleExpandedEvents = (index, expanded) => {
  if (expanded.indexOf(index) === -1) return expanded.concat(index);

  return expanded.filter(item => item !== index);
};

export default UtilsReducer;
