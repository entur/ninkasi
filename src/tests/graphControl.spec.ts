import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import GraphControlReducer, {
  errorMessage,
  fetchGraphControlStatus,
  pauseGraphBuilder,
  rolloutGraph,
} from '../reducers/GraphControlReducer';
import UtilsReducer from '../reducers/UtilsReducer';
import {
  actionLabel,
  bannerMessages,
  formatGraphTimestamp,
  formatSize,
  graphLabel,
  isReasonValid,
  parseGraphPath,
  rolloutImpact,
} from '../screens/graphControl/graphControlUtils';
import type {
  GraphControlStatus,
  SerializationVersion,
} from '../screens/graphControl/graphControlUtils';

vi.mock('axios', () => ({ default: vi.fn() }));

const OLD_GRAPH = 'netex-otp2/EN-0239/20261013080000000-Graph-otp2-EN-0239.obj';
const CURRENT_GRAPH = 'netex-otp2/EN-0239/20261014081200123-Graph-otp2-EN-0239.obj';

const status = (overrides: Partial<GraphControlStatus> = {}): GraphControlStatus => ({
  builder: { paused: false, deferredTransitBuilds: 0, deferredStreetBuilds: 0 },
  production: { serializationId: 'EN-0239', currentGraph: CURRENT_GRAPH, pinned: false },
  pins: [],
  recentActions: [],
  ...overrides,
});

const productionVersion = (
  overrides: Partial<SerializationVersion> = {}
): SerializationVersion => ({
  serializationId: 'EN-0239',
  production: true,
  currentGraph: CURRENT_GRAPH,
  pinnedGraph: null,
  totalGraphs: 2,
  graphs: [
    {
      graph: CURRENT_GRAPH,
      fileName: '20261014081200123-Graph-otp2-EN-0239.obj',
      timestamp: '20261014081200123',
      current: true,
      pinned: false,
    },
    {
      graph: OLD_GRAPH,
      fileName: '20261013080000000-Graph-otp2-EN-0239.obj',
      timestamp: '20261013080000000',
      current: false,
      pinned: false,
    },
  ],
  ...overrides,
});

describe('graph control utils', () => {
  it('requires a reason of at least 5 characters', () => {
    expect(isReasonValid(undefined)).toBe(false);
    expect(isReasonValid('   bad   ')).toBe(false);
    expect(isReasonValid('bad data')).toBe(true);
    expect(isReasonValid('x'.repeat(1001))).toBe(false);
  });

  it('formats graph timestamps and paths', () => {
    expect(formatGraphTimestamp('20261014081200123')).toBe('2026-10-14 08:12:00');
    expect(formatGraphTimestamp('not a timestamp')).toBeNull();
    expect(parseGraphPath(CURRENT_GRAPH)).toEqual({
      serializationId: 'EN-0239',
      timestamp: '20261014081200123',
      fileName: '20261014081200123-Graph-otp2-EN-0239.obj',
    });
    expect(parseGraphPath('current-otp2')).toBeNull();
    expect(graphLabel(CURRENT_GRAPH)).toBe('2026-10-14 08:12:00');
    expect(graphLabel('netex-otp2/unknown-version/Graph-otp2.obj')).toBe('Graph-otp2.obj');
    expect(graphLabel(null)).toBe('none');
  });

  it('formats sizes', () => {
    expect(formatSize(512)).toBe('512 B');
    expect(formatSize(2_040_109_465)).toBe('1.9 GB');
    expect(formatSize(undefined)).toBe('');
  });

  it('shows no banner when nothing is pinned or paused', () => {
    expect(bannerMessages(null)).toEqual([]);
    expect(bannerMessages(status())).toEqual([]);
  });

  it('shows the pinned production graph and the paused builder in the banner', () => {
    const messages = bannerMessages(
      status({
        production: { serializationId: 'EN-0239', currentGraph: OLD_GRAPH, pinned: true },
        pins: [
          {
            serializationId: 'EN-0240',
            graph: 'netex-otp2/EN-0240/20261015080000000-Graph-otp2-EN-0240.obj',
            pinnedBy: 'bob',
            pinnedAt: 0,
            reason: 'testing',
          },
          {
            serializationId: 'EN-0239',
            graph: OLD_GRAPH,
            pinnedBy: 'alice',
            pinnedAt: 0,
            reason: 'bad data',
          },
        ],
        builder: {
          paused: true,
          pausedBy: 'alice',
          deferredTransitBuilds: 2,
          deferredStreetBuilds: 1,
        },
      })
    );
    expect(messages).toEqual([
      'Production OTP graph pinned to 2026-10-13 08:00:00 (EN-0239) by alice: new builds are not rolled out.',
      'OTP graph EN-0240 pinned to 2026-10-15 08:00:00 (EN-0240) by bob: new builds are not rolled out.',
      'Graph builder paused by alice: 3 build requests waiting.',
    ]);
  });

  it('describes the impact of a rollout', () => {
    const version = productionVersion();
    const pinned = rolloutImpact(version, version.graphs[1], true);
    expect(pinned.restartsProduction).toBe(true);
    expect(pinned.isCurrent).toBe(false);
    expect(pinned.description.join(' ')).toContain('OTP instances restart');
    expect(pinned.description.join(' ')).toContain('until the graph is unpinned');

    const unpinned = rolloutImpact(
      productionVersion({ pinnedGraph: CURRENT_GRAPH }),
      version.graphs[1],
      false
    );
    expect(unpinned.replacesPin).toBe(true);
    expect(unpinned.description.join(' ')).toContain('next successful graph build will replace it');
    expect(unpinned.description.join(' ')).toContain(
      'pin on the graph built 2026-10-14 08:12:00 is removed'
    );

    const otherVersion = rolloutImpact(
      productionVersion({ serializationId: 'EN-0240', production: false }),
      version.graphs[1],
      false
    );
    expect(otherVersion.restartsProduction).toBe(false);
    expect(otherVersion.description[0]).toContain('OTP is not restarted');
  });

  it('labels the recorded actions', () => {
    expect(actionLabel('ROLLOUT_AND_PIN')).toBe('Roll out & pin');
    expect(actionLabel('SOMETHING_NEW')).toBe('SOMETHING_NEW');
  });

  it('includes the reason returned by Marduk in error messages', () => {
    expect(errorMessage({ response: { data: 'Graph not found: x' } }, 'Failed')).toBe(
      'Failed: Graph not found: x'
    );
    expect(errorMessage(new Error('network'), 'Failed')).toBe('Failed');
  });
});

describe('GraphControlReducer', () => {
  const makeStore = () => configureStore({ reducer: { GraphControlReducer, UtilsReducer } });

  it('keeps the last status when fetching the status fails', () => {
    const fetched = status({
      builder: { paused: true, deferredTransitBuilds: 1, deferredStreetBuilds: 0 },
    });
    let state = GraphControlReducer(
      undefined,
      fetchGraphControlStatus.fulfilled(fetched, 'id', null)
    );
    expect(state.status).toEqual(fetched);
    state = GraphControlReducer(
      state,
      fetchGraphControlStatus.rejected(null, 'id', null, 'Marduk is down')
    );
    expect(state.status).toEqual(fetched);
    expect(state.statusError).toBe('Marduk is down');
  });

  it('tracks the pending operations and stores the status returned by a pause', () => {
    const arg = { getToken: async () => '', reason: 'investigating' };
    let state = GraphControlReducer(undefined, pauseGraphBuilder.pending('id', arg));
    expect(state.pending.pause).toBe(true);
    const paused = status({
      builder: { paused: true, deferredTransitBuilds: 0, deferredStreetBuilds: 0 },
    });
    state = GraphControlReducer(state, pauseGraphBuilder.fulfilled(paused, 'id', arg));
    expect(state.pending.pause).toBe(false);
    expect(state.status?.builder.paused).toBe(true);
  });

  describe('rollout', () => {
    beforeEach(() => {
      window.config = {
        ...(window.config ?? {}),
        timetableAdminBaseUrl: 'https://marduk.test/services/timetable_admin/',
        defaultAuthMethod: 'local',
      } as typeof window.config;
      vi.mocked(axios).mockReset();
    });

    it('posts the graph, the pin and the reason, then refreshes the status', async () => {
      vi.mocked(axios).mockImplementation((async (request: { url: string }) => {
        if (request.url.endsWith('routing_graph/rollout')) {
          return {
            data: {
              graph: OLD_GRAPH,
              serializationId: 'EN-0239',
              production: true,
              restartTriggered: true,
              pinned: true,
            },
          };
        }
        if (request.url.endsWith('routing_graph/control')) {
          return { data: status() };
        }
        return { data: { serializationVersions: [] } };
      }) as any);

      const store = makeStore();
      await store
        .dispatch(
          rolloutGraph({
            getToken: async () => '',
            graph: OLD_GRAPH,
            pin: true,
            reason: 'bad data',
          })
        )
        .unwrap();

      const rolloutRequest = vi
        .mocked(axios)
        .mock.calls.map(([request]) => request as any)
        .find(request => request.url.endsWith('rollout'));
      expect(rolloutRequest.method).toBe('post');
      expect(rolloutRequest.url).toBe(
        'https://marduk.test/services/timetable_admin/routing_graph/rollout'
      );
      expect(rolloutRequest.data).toEqual({ graph: OLD_GRAPH, pin: true, reason: 'bad data' });
      expect(store.getState().UtilsReducer.notification).toEqual({
        message:
          'Rolled out the graph built 2026-10-13 08:00:00 and pinned it: OTP restarts within a minute',
        level: 'success',
      });
      expect(store.getState().GraphControlReducer.pending.rollout).toBe(false);
    });

    it('notifies the reason of a failure', async () => {
      vi.mocked(axios).mockRejectedValue({
        response: { status: 409, data: 'Another operation is in progress' },
      });

      const store = makeStore();
      const result = await store.dispatch(
        rolloutGraph({ getToken: async () => '', graph: OLD_GRAPH, pin: true, reason: 'bad data' })
      );

      expect(rolloutGraph.rejected.match(result)).toBe(true);
      expect(store.getState().UtilsReducer.notification).toEqual({
        message: 'Failed to roll out the graph: Another operation is in progress',
        level: 'error',
      });
    });
  });
});
