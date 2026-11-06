import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import GraphControlReducer, {
  errorMessage,
  fetchGraphControlStatus,
  pinGraph,
  rolloutGraph,
} from 'reducers/GraphControlReducer';
import UtilsReducer from 'reducers/UtilsReducer';
import {
  actionLabel,
  bannerMessages,
  formatGraphTimestamp,
  formatSize,
  graphLabel,
  isNewerThanCurrent,
  isProductionUnknown,
  isReasonValid,
  parseGraphPath,
  rolloutImpact,
} from 'screens/graphControl/graphControlUtils';
import type {
  GraphControlStatus,
  SerializationVersion,
} from 'screens/graphControl/graphControlUtils';

vi.mock('axios', () => ({ default: vi.fn() }));

const OLD_GRAPH = 'netex-otp2/EN-0239/20261013080000000-Graph-otp2-EN-0239.obj';
const CURRENT_GRAPH = 'netex-otp2/EN-0239/20261014081200123-Graph-otp2-EN-0239.obj';

const status = (overrides: Partial<GraphControlStatus> = {}): GraphControlStatus => ({
  production: {
    serializationId: 'EN-0239',
    currentGraph: CURRENT_GRAPH,
    pinned: false,
    source: 'OTP',
  },
  pins: [],
  recentActions: [],
  skippedBuilds: [],
  unreadableFiles: [],
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

  it('shows no banner when nothing is pinned', () => {
    expect(bannerMessages(null)).toEqual([]);
    expect(bannerMessages(status())).toEqual([]);
  });

  it('shows the pinned graphs in the banner, production first', () => {
    const messages = bannerMessages(
      status({
        production: {
          serializationId: 'EN-0239',
          currentGraph: OLD_GRAPH,
          pinned: true,
          source: 'OTP',
        },
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
      })
    );
    expect(messages).toEqual([
      'Production OTP graph pinned to 2026-10-13 08:00:00 (EN-0239) by alice: new builds are not rolled out.',
      'OTP graph EN-0240 pinned to 2026-10-15 08:00:00 (EN-0240) by bob: new builds are not rolled out.',
    ]);
  });

  it('describes the impact of a rollout', () => {
    const version = productionVersion();
    const pinned = rolloutImpact(version, version.graphs[1], true);
    expect(pinned.restartsProduction).toBe(true);
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

    const unknownProduction = rolloutImpact(
      productionVersion({ serializationId: 'EN-0240', production: false }),
      version.graphs[1],
      false,
      true
    );
    expect(unknownProduction.restartsProduction).toBe(true);
    expect(unknownProduction.description[0]).toContain('OTP instances restart');
  });

  it('detects that the serialization version used in production is unknown', () => {
    expect(isProductionUnknown(null)).toBe(false);
    expect(isProductionUnknown(status())).toBe(false);
    expect(isProductionUnknown(status({ production: null }))).toBe(false);
    expect(
      isProductionUnknown(
        status({ production: null, unreadableFiles: ['netex-otp2/EN-0239/current-otp2'] })
      )
    ).toBe(false);
    expect(
      isProductionUnknown(status({ production: null, unreadableFiles: ['current-otp2'] }))
    ).toBe(true);
    expect(isProductionUnknown(status({ unreadableFiles: ['current-otp2'] }))).toBe(false);
  });

  it('labels the recorded actions', () => {
    expect(actionLabel('ROLLOUT_AND_PIN')).toBe('Roll out & pin');
    expect(actionLabel('BUILD_NOT_PROMOTED')).toBe('Build not promoted');
    expect(actionLabel('POINTER_REPLACED')).toBe('Broken pointer replaced by build');
    expect(actionLabel('SOMETHING_NEW')).toBe('SOMETHING_NEW');
  });

  it('flags the builds newer than the current graph as not rolled out', () => {
    const version = productionVersion();
    expect(isNewerThanCurrent(version, version.graphs[0])).toBe(false);
    expect(isNewerThanCurrent(version, version.graphs[1])).toBe(false);
    const newBuild = {
      graph: 'netex-otp2/EN-0239/20261015080000000-Graph-otp2-EN-0239.obj',
      fileName: '20261015080000000-Graph-otp2-EN-0239.obj',
      timestamp: '20261015080000000',
      current: false,
      pinned: false,
    };
    expect(isNewerThanCurrent(version, newBuild)).toBe(true);
    const legacyCurrent = productionVersion({
      currentGraph: 'netex-otp2/EN-0239/Graph-otp2-EN-0239.obj',
    });
    expect(isNewerThanCurrent(legacyCurrent, newBuild)).toBe(true);
    expect(isNewerThanCurrent(productionVersion({ currentGraph: null }), newBuild)).toBe(false);
  });

  it('includes the plain text reason returned by Marduk in error messages', () => {
    const plainText = { headers: { 'content-type': 'text/plain;charset=UTF-8' } };
    expect(errorMessage({ response: { ...plainText, data: 'Graph not found: x' } }, 'Failed')).toBe(
      'Failed: Graph not found: x'
    );
    expect(
      errorMessage({ response: { ...plainText, data: 'x'.repeat(400) } }, 'Failed')
    ).toHaveLength('Failed: '.length + 301);
    expect(
      errorMessage(
        { response: { headers: { 'content-type': 'text/html' }, data: '<html>502</html>' } },
        'Failed'
      )
    ).toBe('Failed');
    expect(errorMessage({ response: { data: '<html>502</html>' } }, 'Failed')).toBe('Failed');
    expect(errorMessage(new Error('network'), 'Failed')).toBe('Failed');
  });
});

describe('GraphControlReducer', () => {
  const makeStore = () => configureStore({ reducer: { GraphControlReducer, UtilsReducer } });

  it('keeps the last status when fetching the status fails', () => {
    const fetched = status({
      skippedBuilds: [
        {
          action: 'BUILD_NOT_PROMOTED',
          serializationId: 'EN-0239',
          graph: 'netex-otp2/EN-0239/20261015080000000-Graph-otp2-EN-0239.obj',
          performedBy: 'system',
          performedAt: 1760515200000,
          reason: 'The serialization version EN-0239 is pinned',
        },
      ],
    });
    let state = GraphControlReducer(undefined, fetchGraphControlStatus.pending('id', null));
    state = GraphControlReducer(state, fetchGraphControlStatus.fulfilled(fetched, 'id', null));
    expect(state.status).toEqual(fetched);
    state = GraphControlReducer(
      state,
      fetchGraphControlStatus.rejected(null, 'id', null, 'Marduk is down')
    );
    expect(state.status).toEqual(fetched);
    expect(state.statusError).toBe('Marduk is down');
  });

  it('ignores the response of a status fetch started before the latest one', () => {
    const stale = status();
    const fresh = status({
      production: { serializationId: 'EN-0239', pinned: true, source: 'OTP' },
    });
    let state = GraphControlReducer(undefined, fetchGraphControlStatus.pending('stale', null));
    state = GraphControlReducer(state, fetchGraphControlStatus.pending('fresh', null));
    state = GraphControlReducer(state, fetchGraphControlStatus.fulfilled(fresh, 'fresh', null));
    state = GraphControlReducer(state, fetchGraphControlStatus.fulfilled(stale, 'stale', null));
    expect(state.status).toEqual(fresh);
    state = GraphControlReducer(
      state,
      fetchGraphControlStatus.rejected(null, 'stale', null, 'Marduk is down')
    );
    expect(state.statusError).toBeNull();
  });

  it('tracks the pending operations and leaves the status to the refresh after a pin', () => {
    const arg = { getToken: async () => '', serializationId: 'EN-0239', reason: 'bad data' };
    const fetched = status();
    let state = GraphControlReducer(undefined, fetchGraphControlStatus.pending('status', null));
    state = GraphControlReducer(state, fetchGraphControlStatus.fulfilled(fetched, 'status', null));
    state = GraphControlReducer(state, pinGraph.pending('id', arg));
    expect(state.pending).toBe('pin');
    state = GraphControlReducer(
      state,
      pinGraph.fulfilled(
        { serializationId: 'EN-0239', graph: CURRENT_GRAPH, pinned: true },
        'id',
        arg
      )
    );
    expect(state.pending).toBeNull();
    // the status is fetched again by the thunk, the result of the pin is not a status
    expect(state.status).toEqual(fetched);
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
      expect(store.getState().GraphControlReducer.pending).toBeNull();
    });

    it('notifies the reason of a failure', async () => {
      vi.mocked(axios).mockRejectedValue({
        response: {
          status: 409,
          headers: { 'content-type': 'text/plain;charset=UTF-8' },
          data: 'Another operation is in progress',
        },
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
