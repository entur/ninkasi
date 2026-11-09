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
import PushPinIcon from '@mui/icons-material/PushPin';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import EmergencyConfirmDialog from 'modals/EmergencyConfirmDialog';
import GraphStatus from 'screens/providers/components/GraphStatus';
import {
  fetchGraphControlStatus,
  fetchGraphVersions,
  pinGraph,
  rolloutGraph,
  unpinGraph,
} from 'reducers/GraphControlReducer';
import type { GraphControlOperation } from 'reducers/GraphControlReducer';
import GraphVersionsTable from 'screens/graphControl/GraphVersionsTable';
import RecentGraphActions from 'screens/graphControl/RecentGraphActions';
import type {
  GraphPin,
  GraphVersion,
  SerializationVersion,
} from 'screens/graphControl/graphControlUtils';
import {
  graphLabel,
  isProductionUnknown,
  rolloutImpact,
  since,
} from 'screens/graphControl/graphControlUtils';

// the status itself is polled by GraphControlBanner, which is mounted on every page
const VERSIONS_REFRESH_INTERVAL = 30000;

interface Confirmation {
  operation: GraphControlOperation;
  title: string;
  impact: string[];
  confirmLabel: string;
  severity: 'error' | 'warning';
  run: (reason: string) => Promise<unknown>;
}

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
  const { status, statusError, versions, totalVersions, versionsError, pending } = useAppSelector(
    state => state.GraphControlReducer
  );
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const refreshVersions = useCallback(
    () => dispatch(fetchGraphVersions(getToken)),
    [dispatch, getToken]
  );

  const refresh = () => {
    dispatch(fetchGraphControlStatus(getToken));
    refreshVersions();
  };

  useEffect(() => {
    refreshVersions();
    const timer = setInterval(refreshVersions, VERSIONS_REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [refreshVersions]);

  const anyPending = pending !== null;
  const production = status?.production;
  const productionPin = status?.pins.find(p => p.serializationId === production?.serializationId);
  const otherPins =
    status?.pins.filter(p => p.serializationId !== production?.serializationId) ?? [];
  const productionUnknown = isProductionUnknown(status);
  const unreadableFiles = status?.unreadableFiles ?? [];

  const confirmRollout = (version: SerializationVersion, graph: GraphVersion, pin: boolean) => {
    const impact = rolloutImpact(version, graph, pin, productionUnknown);
    setConfirmation({
      operation: 'rollout',
      title: `${pin ? 'Roll out and pin' : 'Roll out'} the graph built ${graphLabel(graph.graph)}?`,
      impact: impact.description,
      confirmLabel: pin ? 'Roll out & pin' : 'Roll out',
      severity: impact.restartsProduction ? 'error' : 'warning',
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
        Emergency procedures for the production journey planner: roll out a previous graph, or pin
        the current graph so that new builds are not rolled out. Every action is recorded with its
        reason.
      </Typography>

      {statusError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {statusError}
        </Alert>
      )}

      {unreadableFiles.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          These state files of the graph bucket cannot be parsed and are left out of this page:
          <Box component="ul" sx={{ my: 0.5 }}>
            {unreadableFiles.map(file => (
              <li key={file}>
                <code>{file}</code>
              </li>
            ))}
          </Box>
          A serialization version whose pointer file cannot be parsed shows no current graph, and
          one whose pin file cannot be parsed is not shown as pinned. Repair or delete them in the
          graph bucket. A pointer file is also replaced by the next production build or by a rollout
          of its serialization version.
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
              {!status && !statusError && <Typography color="text.secondary">Loading…</Typography>}
              {status && !production && !productionUnknown && (
                <Typography color="text.secondary">No graph published yet.</Typography>
              )}
              {productionUnknown && (
                <Alert severity="error">
                  The serialization version used in production is unknown: production OTP cannot be
                  reached and the root pointer file cannot be parsed. Any rollout restarts OTP.
                </Alert>
              )}
              {production && (
                <>
                  <Field label="Serialization version">{production.serializationId}</Field>
                  {production.source === 'ROOT_POINTER' && (
                    <Alert severity="warning">
                      Marduk cannot reach production OTP: this is the serialization version of the
                      latest production build. After an OTP release that changes the serialization
                      version, it lags behind the version OTP runs until the first build of the new
                      version.
                    </Alert>
                  )}
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
              <Typography variant="h6">Graph builder</Typography>
              <Typography variant="body2" color="text.secondary">
                Graphs are built when datasets are published and when the street graph changes.
                Builds keep running while a graph is pinned: they are published and listed below,
                available for rollout, but not promoted.
              </Typography>
              <Box sx={{ ml: -2.5 }}>
                <GraphStatus />
              </Box>
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
          totalVersions={totalVersions}
          disabled={anyPending}
          productionUnknown={productionUnknown}
          onRollout={confirmRollout}
          onPinCurrent={version => confirmPin(version.serializationId, version.currentGraph)}
        />
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Recent actions
      </Typography>
      <Box sx={{ mb: 3 }}>
        <RecentGraphActions actions={status?.recentActions ?? []} />
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Builds not promoted
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Graphs built in the last 30 days that did not become the current graph of their
        serialization version, and why.
      </Typography>
      <RecentGraphActions
        actions={status?.skippedBuilds ?? []}
        emptyMessage="Every recent build was promoted."
      />

      <EmergencyConfirmDialog
        open={!!confirmation}
        title={confirmation?.title ?? ''}
        impact={confirmation?.impact ?? []}
        confirmLabel={confirmation?.confirmLabel ?? 'Confirm'}
        severity={confirmation?.severity}
        pending={!!confirmation && pending === confirmation.operation}
        onCancel={() => setConfirmation(null)}
        onConfirm={onConfirm}
      />
    </Box>
  );
};

export default GraphControlPage;
