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
import SuppliersActions from 'actions/SuppliersActions';

const initialState = {
  preferredName: '',
  isRouteDataAdmin: false,
  isOrganisationAdmin: false,
};

export const fetchUserContext = createAsyncThunk(
  'userContext/fetch',
  /**
   * @param {() => Promise<string | undefined>} getToken
   */
  async (getToken, { dispatch, rejectWithValue }) => {
    if (window.config?.defaultAuthMethod === 'local') {
      return {
        preferredName: 'Local Dev',
        isRouteDataAdmin: true,
        isOrganisationAdmin: true,
      };
    }
    const url = window.config.providersBaseUrl + 'usercontext';
    try {
      const response = await axios.get(url, await getApiConfig(getToken));
      return response.data;
    } catch (err) {
      dispatch(SuppliersActions.addNotification('Failed to fetch user context', 'error'));
      return rejectWithValue(err);
    }
  }
);

const userContextSlice = createSlice({
  name: 'userContext',
  initialState,
  reducers: {
    receiveUserContext(state, action) {
      Object.assign(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUserContext.fulfilled, (state, action) => {
      Object.assign(state, action.payload);
    });
  },
});

export const { receiveUserContext } = userContextSlice.actions;
export default userContextSlice.reducer;
