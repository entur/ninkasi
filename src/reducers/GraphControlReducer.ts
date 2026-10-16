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
  GraphRolloutResult,
  SerializationVersion,
} from 'screens/graphControl/graphControlUtils';
import { graphLabel } from 'screens/graphControl/graphControlUtils';

type GetToken = () => Promise<string>;

export type GraphControlOperation = 'rollout' | 'pin' | 'unpin' | 'pause' | 'resume';

export interface GraphControlState {
  status: GraphControlStatus | null;
  statusError: string | null;
  versions: SerializationVersion[];
  versionsLoading: boolean;
  versionsError: string | null;
  pending: Partial<Record<GraphControlOperation, boolean>>;
}

const initialState: GraphControlState = {
  status: null,
  statusError: null,
  versions: [],
  versionsLoading: false,
  versionsError: null,
  pending: {},
};

const READ_TIMEOUT = 15000;
// a rollout copies a graph of a few GB in the graph bucket
const WRITE_TIMEOUT = 120000;
const VERSIONS_LIMIT = 30;

const routingGraphUrl = (path: string) =>
  `${window.config.timetableAdminBaseUrl}routing_graph/${path}`;

/**
 * Error message including the reason returned by Marduk (plain text), for example a lock conflict.
 */
export const errorMessage = (err: any, fallback: string): string => {
  const data = err?.response?.data;
  if (typeof data === 'string' && data.trim()) {
    return `${fallback}: ${data.trim()}`;
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
  SerializationVersion[],
  GetToken,
  { rejectValue: string }
>('graphControl/fetchVersions', async (getToken, { rejectWithValue }) => {
  try {
    const response = await axios({
      url: routingGraphUrl(`versions?limit=${VERSIONS_LIMIT}`),
      method: 'get',
      timeout: READ_TIMEOUT,
      ...(await getApiConfig(getToken)),
    });
    return response.data?.serializationVersions ?? [];
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
      result.restartTriggered ? ': OTP restarts within a minute' : ''
    }`,
  'Failed to roll out the graph'
);

export const pinGraph = makeControlThunk<
  { getToken: GetToken; serializationId: string; reason: string },
  GraphControlStatus
>(
  'pin',
  'pin',
  ({ serializationId, reason }) => ({ serializationId, reason }),
  ({ serializationId }) => `Pinned the current graph of ${serializationId}`,
  'Failed to pin the current graph'
);

export const unpinGraph = makeControlThunk<
  { getToken: GetToken; serializationId: string; reason: string },
  GraphControlStatus
>(
  'unpin',
  'unpin',
  ({ serializationId, reason }) => ({ serializationId, reason }),
  ({ serializationId }) => `Unpinned the graph of ${serializationId}: the next build is rolled out`,
  'Failed to unpin the graph'
);

export const pauseGraphBuilder = makeControlThunk<
  { getToken: GetToken; reason: string },
  GraphControlStatus
>(
  'pause',
  'builder/pause',
  ({ reason }) => ({ reason }),
  () => 'Paused the graph builder',
  'Failed to pause the graph builder'
);

export const resumeGraphBuilder = makeControlThunk<
  { getToken: GetToken; reason: string },
  GraphControlStatus
>(
  'resume',
  'builder/resume',
  ({ reason }) => ({ reason }),
  () => 'Resumed the graph builder',
  'Failed to resume the graph builder'
);

const operations: Record<GraphControlOperation, any> = {
  rollout: rolloutGraph,
  pin: pinGraph,
  unpin: unpinGraph,
  pause: pauseGraphBuilder,
  resume: resumeGraphBuilder,
};

const graphControlSlice = createSlice({
  name: 'graphControl',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchGraphControlStatus.fulfilled, (state, action) => {
        state.status = action.payload;
        state.statusError = null;
      })
      // the last known status is kept, so that the banner does not disappear on a transient failure
      .addCase(fetchGraphControlStatus.rejected, (state, action) => {
        state.statusError = action.payload ?? 'Failed to fetch the OTP graph control status';
      })
      .addCase(fetchGraphVersions.pending, state => {
        state.versionsLoading = true;
      })
      .addCase(fetchGraphVersions.fulfilled, (state, action) => {
        state.versions = action.payload;
        state.versionsLoading = false;
        state.versionsError = null;
      })
      .addCase(fetchGraphVersions.rejected, (state, action) => {
        state.versionsLoading = false;
        state.versionsError = action.payload ?? 'Failed to fetch the OTP graph versions';
      })
      .addMatcher(
        isAnyOf(
          pinGraph.fulfilled,
          unpinGraph.fulfilled,
          pauseGraphBuilder.fulfilled,
          resumeGraphBuilder.fulfilled
        ),
        (state, action) => {
          state.status = action.payload;
          state.statusError = null;
        }
      );

    (Object.keys(operations) as GraphControlOperation[]).forEach(operation => {
      const thunk = operations[operation];
      builder
        .addMatcher(thunk.pending.match, state => {
          state.pending[operation] = true;
        })
        .addMatcher(isAnyOf(thunk.fulfilled, thunk.rejected), state => {
          state.pending[operation] = false;
        });
    });
  },
});

export default graphControlSlice.reducer;
export { graphControlSlice };
