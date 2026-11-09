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

import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import getApiConfig from 'actions/getApiConfig';
import { addNotification } from 'reducers/UtilsReducer';
import type {
  GraphControlStatus,
  GraphPinResult,
  GraphRolloutResult,
  SerializationVersion,
} from 'screens/graphControl/graphControlUtils';
import { graphLabel } from 'screens/graphControl/graphControlUtils';

type GetToken = () => Promise<string>;

export type GraphControlOperation = 'rollout' | 'pin' | 'unpin';

export interface GraphControlState {
  status: GraphControlStatus | null;
  statusError: string | null;
  versions: SerializationVersion[];
  // the number of serialization versions that have published graphs, listed or not
  totalVersions: number;
  versionsLoading: boolean;
  versionsError: string | null;
  // the operation in progress: the buttons are disabled meanwhile, so at most one runs at a time
  pending: GraphControlOperation | null;
  // request ids of the latest fetches: responses of earlier requests are ignored, so that a slow
  // poll cannot overwrite the status returned by a later operation
  statusRequestId: string | null;
  versionsRequestId: string | null;
}

const initialState: GraphControlState = {
  status: null,
  statusError: null,
  versions: [],
  totalVersions: 0,
  versionsLoading: false,
  versionsError: null,
  pending: null,
  statusRequestId: null,
  versionsRequestId: null,
};

const READ_TIMEOUT = 15000;
// a rollout copies a graph of a few GB in the graph bucket
const WRITE_TIMEOUT = 120000;
const VERSIONS_LIMIT = 30;
// the production serialization version, then the most recent ones
const SERIALIZATION_VERSIONS_LIMIT = 5;

const routingGraphUrl = (path: string) =>
  `${window.config.timetableAdminBaseUrl}routing_graph/${path}`;

const MAX_REASON_LENGTH = 300;

/**
 * Error message including the reason returned by Marduk (plain text), for example a lock conflict.
 * Other bodies (an HTML error page from the load balancer, for example) are not included.
 */
export const errorMessage = (err: any, fallback: string): string => {
  const data = err?.response?.data;
  const contentType = String(err?.response?.headers?.['content-type'] ?? '');
  if (typeof data === 'string' && data.trim() && contentType.startsWith('text/plain')) {
    const reason = data.trim();
    return `${fallback}: ${
      reason.length > MAX_REASON_LENGTH ? `${reason.slice(0, MAX_REASON_LENGTH)}…` : reason
    }`;
  }
  return fallback;
};

export const fetchGraphControlStatus = createAsyncThunk<
  GraphControlStatus,
  GetToken,
  { rejectValue: string }
>('graphControl/fetchStatus', async (getToken, { rejectWithValue }) => {
  try {
    const response = await axios({
      url: routingGraphUrl('control'),
      method: 'get',
      timeout: READ_TIMEOUT,
      ...(await getApiConfig(getToken)),
    });
    return response.data;
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Failed to fetch the OTP graph control status'));
  }
});

export const fetchGraphVersions = createAsyncThunk<
  { versions: SerializationVersion[]; totalVersions: number },
  GetToken,
  { rejectValue: string }
>('graphControl/fetchVersions', async (getToken, { rejectWithValue }) => {
  try {
    const response = await axios({
      url: routingGraphUrl(
        `versions?limit=${VERSIONS_LIMIT}&serializationVersions=${SERIALIZATION_VERSIONS_LIMIT}`
      ),
      method: 'get',
      timeout: READ_TIMEOUT,
      ...(await getApiConfig(getToken)),
    });
    const versions: SerializationVersion[] = response.data?.serializationVersions ?? [];
    return {
      versions: versions.slice(0, SERIALIZATION_VERSIONS_LIMIT),
      totalVersions: response.data?.totalSerializationVersions ?? versions.length,
    };
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Failed to fetch the OTP graph versions'));
  }
});

const makeControlThunk = <Arg extends { getToken: GetToken }, Result>(
  operation: GraphControlOperation,
  path: string,
  body: (arg: Arg) => object,
  successMessage: (arg: Arg, result: Result) => string,
  failureMessage: string
) =>
  createAsyncThunk<Result, Arg, { rejectValue: string }>(
    `graphControl/${operation}`,
    async (arg, { dispatch, rejectWithValue }) => {
      try {
        const response = await axios({
          url: routingGraphUrl(path),
          method: 'post',
          data: body(arg),
          timeout: WRITE_TIMEOUT,
          ...(await getApiConfig(arg.getToken)),
        });
        dispatch(
          addNotification({ message: successMessage(arg, response.data), level: 'success' })
        );
        dispatch(fetchGraphControlStatus(arg.getToken));
        dispatch(fetchGraphVersions(arg.getToken));
        return response.data;
      } catch (err) {
        const message = errorMessage(err, failureMessage);
        dispatch(addNotification({ message, level: 'error' }));
        return rejectWithValue(message);
      }
    }
  );

export const rolloutGraph = makeControlThunk<
  { getToken: GetToken; graph: string; pin: boolean; reason: string },
  GraphRolloutResult
>(
  'rollout',
  'rollout',
  ({ graph, pin, reason }) => ({ graph, pin, reason }),
  (_, result) =>
    `Rolled out the graph built ${graphLabel(result.graph)}${result.pinned ? ' and pinned it' : ''}${
      result.production ? ': OTP restarts within a minute' : ''
    }`,
  'Failed to roll out the graph'
);

export const pinGraph = makeControlThunk<
  { getToken: GetToken; serializationId: string; reason: string },
  GraphPinResult
>(
  'pin',
  'pin',
  ({ serializationId, reason }) => ({ serializationId, reason }),
  ({ serializationId }) => `Pinned the current graph of ${serializationId}`,
  'Failed to pin the current graph'
);

export const unpinGraph = makeControlThunk<
  { getToken: GetToken; serializationId: string; reason: string },
  GraphPinResult
>(
  'unpin',
  'unpin',
  ({ serializationId, reason }) => ({ serializationId, reason }),
  ({ serializationId }) => `Unpinned the graph of ${serializationId}: the next build is rolled out`,
  'Failed to unpin the graph'
);

const controlThunks = [rolloutGraph, pinGraph, unpinGraph];

// graphControl/<operation>/<pending|fulfilled|rejected>
const operationOf = (actionType: string) => actionType.split('/')[1] as GraphControlOperation;

const graphControlSlice = createSlice({
  name: 'graphControl',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchGraphControlStatus.pending, (state, action) => {
        state.statusRequestId = action.meta.requestId;
      })
      .addCase(fetchGraphControlStatus.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.statusRequestId) {
          return;
        }
        state.status = action.payload;
        state.statusError = null;
      })
      // the last known status is kept, so that the banner does not disappear on a transient failure
      .addCase(fetchGraphControlStatus.rejected, (state, action) => {
        if (action.meta.requestId !== state.statusRequestId) {
          return;
        }
        state.statusError = action.payload ?? 'Failed to fetch the OTP graph control status';
      })
      .addCase(fetchGraphVersions.pending, (state, action) => {
        state.versionsRequestId = action.meta.requestId;
        state.versionsLoading = true;
      })
      .addCase(fetchGraphVersions.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.versionsRequestId) {
          return;
        }
        state.versions = action.payload.versions;
        state.totalVersions = action.payload.totalVersions;
        state.versionsLoading = false;
        state.versionsError = null;
      })
      .addCase(fetchGraphVersions.rejected, (state, action) => {
        if (action.meta.requestId !== state.versionsRequestId) {
          return;
        }
        state.versionsLoading = false;
        state.versionsError = action.payload ?? 'Failed to fetch the OTP graph versions';
      })
      .addMatcher(isAnyOf(...controlThunks.map(thunk => thunk.pending)), (state, action) => {
        state.pending = operationOf(action.type);
      })
      .addMatcher(
        isAnyOf(...controlThunks.flatMap(thunk => [thunk.fulfilled, thunk.rejected])),
        state => {
          state.pending = null;
        }
      );
  },
});

export default graphControlSlice.reducer;
export { graphControlSlice };
