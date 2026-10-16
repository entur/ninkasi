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

import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Alert, Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PushPinIcon from '@mui/icons-material/PushPin';
import RefreshIcon from '@mui/icons-material/Refresh';
import { formatDistanceToNow } from 'date-fns';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import EmergencyConfirmDialog from 'modals/EmergencyConfirmDialog';
import GraphStatus from 'screens/providers/components/GraphStatus';
import {
  fetchGraphControlStatus,
  fetchGraphVersions,
  pauseGraphBuilder,
  pinGraph,
  resumeGraphBuilder,
  rolloutGraph,
  unpinGraph,
} from 'reducers/GraphControlReducer';
import type { GraphControlOperation } from 'reducers/GraphControlReducer';
import GraphVersionsTable from './GraphVersionsTable';
import RecentGraphActions from './RecentGraphActions';
import type { GraphPin, GraphVersion, SerializationVersion } from './graphControlUtils';
import { graphLabel, rolloutImpact } from './graphControlUtils';

const REFRESH_INTERVAL = 30000;

interface Confirmation {
  operation: GraphControlOperation;
  title: string;
  impact: string[];
  confirmLabel: string;
  severity: 'error' | 'warning';
  run: (reason: string) => Promise<unknown>;
}

const since = (time?: number | null) =>
  time ? formatDistanceToNow(new Date(time), { addSuffix: true }) : '';

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 150 }}>
      {label}
    </Typography>
    <Box sx={{ typography: 'body1' }}>{children}</Box>
  </Stack>
);

const PinDetails = ({ pin }: { pin: GraphPin }) => (
  <Typography variant="body2" color="text.secondary">
    Pinned by {pin.pinnedBy} {since(pin.pinnedAt)}: “{pin.reason}”
  </Typography>
);

const GraphControlPage = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();
  const { status, statusError, versions, versionsError, pending } = useAppSelector(
    state => state.GraphControlReducer
  );
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const refresh = useCallback(() => {
    dispatch(fetchGraphControlStatus(getToken));
    dispatch(fetchGraphVersions(getToken));
  }, [dispatch, getToken]);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [refresh]);

  const anyPending = Object.values(pending).some(Boolean);
  const production = status?.production;
  const builder = status?.builder;
  const productionPin = status?.pins.find(p => p.serializationId === production?.serializationId);
  const otherPins =
    status?.pins.filter(p => p.serializationId !== production?.serializationId) ?? [];

  const confirmRollout = (version: SerializationVersion, graph: GraphVersion, pin: boolean) => {
    setConfirmation({
      operation: 'rollout',
      title: `${pin ? 'Roll out and pin' : 'Roll out'} the graph built ${graphLabel(graph.graph)}?`,
      impact: rolloutImpact(version, graph, pin).description,
      confirmLabel: pin ? 'Roll out & pin' : 'Roll out',
      severity: version.production ? 'error' : 'warning',
      run: reason => dispatch(rolloutGraph({ getToken, graph: graph.graph, pin, reason })).unwrap(),
    });
  };

  const confirmPin = (serializationId: string, currentGraph?: string | null) => {
    setConfirmation({
      operation: 'pin',
      title: `Pin the current graph of ${serializationId}?`,
      impact: [
        `The current graph (built ${graphLabel(currentGraph)}) stays in use: new builds are not rolled out until the graph is unpinned.`,
        'The graph files are unchanged and OTP is not restarted.',
      ],
      confirmLabel: 'Pin',
      severity: 'error',
      run: reason => dispatch(pinGraph({ getToken, serializationId, reason })).unwrap(),
    });
  };

  const confirmUnpin = (pin: GraphPin) => {
    setConfirmation({
      operation: 'unpin',
      title: `Unpin the graph of ${pin.serializationId}?`,
      impact: [
        `The current graph (built ${graphLabel(pin.currentGraph ?? pin.graph)}) stays in use until the next successful graph build, which is then rolled out.`,
        'Build a transit graph afterwards to roll out the latest data right away.',
      ],
      confirmLabel: 'Unpin',
      severity: 'warning',
      run: reason =>
        dispatch(unpinGraph({ getToken, serializationId: pin.serializationId, reason })).unwrap(),
    });
  };

  const confirmPause = () => {
    setConfirmation({
      operation: 'pause',
      title: 'Pause the graph builder?',
      impact: [
        'No new transit or street graph build starts. The build requests (for example new datasets) are kept and replayed when the graph builder is resumed.',
        'A graph whose build is already running is kept, but it is not rolled out.',
        'Candidate builds are not affected.',
      ],
      confirmLabel: 'Pause',
      severity: 'error',
      run: reason => dispatch(pauseGraphBuilder({ getToken, reason })).unwrap(),
    });
  };

  const confirmResume = () => {
    const waiting = (builder?.deferredTransitBuilds ?? 0) + (builder?.deferredStreetBuilds ?? 0);
    setConfirmation({
      operation: 'resume',
      title: 'Resume the graph builder?',
      impact: [
        waiting
          ? `The ${waiting} deferred build request${waiting === 1 ? ' is' : 's are'} replayed: the graph builder starts a new build.`
          : 'No build request was received while the graph builder was paused.',
        productionPin
          ? 'The production graph is pinned: new graphs are not rolled out until it is unpinned.'
          : 'The new graph is rolled out to production when the build succeeds.',
      ],
      confirmLabel: 'Resume',
      severity: 'warning',
      run: reason => dispatch(resumeGraphBuilder({ getToken, reason })).unwrap(),
    });
  };

  const onConfirm = async (reason: string) => {
    if (!confirmation) {
      return;
    }
    try {
      await confirmation.run(reason);
      setConfirmation(null);
    } catch {
      // the error is notified by the thunk, the dialog stays open to retry
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h5">OTP graph control</Typography>
        <Button startIcon={<RefreshIcon />} onClick={refresh}>
          Refresh
        </Button>
      </Stack>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Emergency procedures for the production journey planner: roll out a previous graph, pin the
        current graph so that new builds are not rolled out, or pause the graph builder. Every
        action is recorded with its reason.
      </Typography>

      {statusError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {statusError}
        </Alert>
      )}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant="h6">Production graph</Typography>
                {production?.pinned && (
                  <Chip size="small" color="error" icon={<PushPinIcon />} label="PINNED" />
                )}
              </Stack>
              {!status && <Typography color="text.secondary">Loading…</Typography>}
              {status && !production && (
                <Typography color="text.secondary">No graph published yet.</Typography>
              )}
              {production && (
                <>
                  <Field label="Serialization version">{production.serializationId}</Field>
                  <Field label="Current graph">
                    <span title={production.currentGraph ?? ''}>
                      {graphLabel(production.currentGraph)}
                    </span>
                  </Field>
                  {productionPin ? (
                    <>
                      <PinDetails pin={productionPin} />
                      <Box>
                        <Button
                          variant="outlined"
                          color="warning"
                          disabled={anyPending}
                          onClick={() => confirmUnpin(productionPin)}
                        >
                          Unpin
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        New graphs are rolled out as soon as they are built.
                      </Typography>
                      <Box>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<PushPinIcon />}
                          disabled={anyPending || !production.currentGraph}
                          onClick={() =>
                            confirmPin(production.serializationId, production.currentGraph)
                          }
                        >
                          Pin current graph
                        </Button>
                      </Box>
                    </>
                  )}
                </>
              )}
              {otherPins.map(pin => (
                <Alert
                  key={pin.serializationId}
                  severity="info"
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      disabled={anyPending}
                      onClick={() => confirmUnpin(pin)}
                    >
                      Unpin
                    </Button>
                  }
                >
                  {pin.serializationId} pinned to the graph built {graphLabel(pin.graph)} by{' '}
                  {pin.pinnedBy}: “{pin.reason}”
                </Alert>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant="h6">Graph builder</Typography>
                {builder &&
                  (builder.paused ? (
                    <Chip size="small" color="warning" icon={<PauseIcon />} label="PAUSED" />
                  ) : (
                    <Chip size="small" color="success" icon={<PlayArrowIcon />} label="RUNNING" />
                  ))}
              </Stack>
              {builder?.paused && (
                <>
                  <Typography variant="body2" color="text.secondary">
                    Paused by {builder.pausedBy} {since(builder.pausedAt)}: “{builder.reason}”
                  </Typography>
                  <Field label="Deferred requests">
                    {builder.deferredTransitBuilds} transit, {builder.deferredStreetBuilds} street
                  </Field>
                </>
              )}
              {builder && !builder.paused && (
                <Typography variant="body2" color="text.secondary">
                  Graphs are built when datasets are published and when the street graph changes.
                </Typography>
              )}
              <Box sx={{ ml: -2.5 }}>
                <GraphStatus />
              </Box>
              {builder && (
                <Box>
                  {builder.paused ? (
                    <Button
                      variant="contained"
                      startIcon={<PlayArrowIcon />}
                      disabled={anyPending}
                      onClick={confirmResume}
                    >
                      Resume
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<PauseIcon />}
                      disabled={anyPending}
                      onClick={confirmPause}
                    >
                      Pause
                    </Button>
                  )}
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Graph versions
      </Typography>
      {versionsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {versionsError}
        </Alert>
      )}
      <Box sx={{ mb: 3 }}>
        <GraphVersionsTable
          versions={versions}
          disabled={anyPending}
          onRollout={confirmRollout}
          onPinCurrent={version => confirmPin(version.serializationId, version.currentGraph)}
        />
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Recent actions
      </Typography>
      <RecentGraphActions actions={status?.recentActions ?? []} />

      <EmergencyConfirmDialog
        open={!!confirmation}
        title={confirmation?.title ?? ''}
        impact={confirmation?.impact ?? []}
        confirmLabel={confirmation?.confirmLabel ?? 'Confirm'}
        severity={confirmation?.severity}
        pending={!!(confirmation && pending[confirmation.operation])}
        onCancel={() => setConfirmation(null)}
        onConfirm={onConfirm}
      />
    </Box>
  );
};

export default GraphControlPage;
