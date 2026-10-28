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

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PushPinIcon from '@mui/icons-material/PushPin';
import { formatDistanceToNow } from 'date-fns';
import type { GraphVersion, SerializationVersion } from './graphControlUtils';
import { formatGraphTimestamp, formatSize } from './graphControlUtils';

interface GraphVersionsTableProps {
  versions: SerializationVersion[];
  disabled: boolean;
  onRollout: (version: SerializationVersion, graph: GraphVersion, pin: boolean) => void;
  onPinCurrent: (version: SerializationVersion) => void;
}

const GraphRowActions = ({
  version,
  graph,
  disabled,
  onRollout,
  onPinCurrent,
}: {
  version: SerializationVersion;
  graph: GraphVersion;
  disabled: boolean;
  onRollout: GraphVersionsTableProps['onRollout'];
  onPinCurrent: GraphVersionsTableProps['onPinCurrent'];
}) => {
  if (graph.current && graph.pinned) {
    return null;
  }
  if (graph.current) {
    return (
      <Button
        size="small"
        variant="outlined"
        color="error"
        startIcon={<PushPinIcon />}
        disabled={disabled}
        onClick={() => onPinCurrent(version)}
      >
        Pin
      </Button>
    );
  }
  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
      <Button
        size="small"
        variant="contained"
        color="error"
        disabled={disabled}
        onClick={() => onRollout(version, graph, true)}
      >
        Roll out &amp; pin
      </Button>
      <Button
        size="small"
        variant="outlined"
        disabled={disabled}
        onClick={() => onRollout(version, graph, false)}
      >
        Roll out
      </Button>
    </Stack>
  );
};

const GraphVersionsTable = ({
  versions,
  disabled,
  onRollout,
  onPinCurrent,
}: GraphVersionsTableProps) => {
  if (!versions.length) {
    return <Typography color="text.secondary">No published graph.</Typography>;
  }

  return (
    <Box>
      {versions.map(version => (
        <Accordion
          key={version.serializationId}
          defaultExpanded={version.production}
          disableGutters
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography sx={{ fontWeight: 600 }}>{version.serializationId}</Typography>
              {version.production ? (
                <Chip size="small" color="primary" label="production" />
              ) : (
                <Chip
                  size="small"
                  variant="outlined"
                  label="not used by production: no OTP restart"
                />
              )}
              {version.pinnedGraph && (
                <Chip size="small" color="error" icon={<PushPinIcon />} label="pinned" />
              )}
              <Typography variant="body2" color="text.secondary">
                {version.graphs.length < version.totalGraphs
                  ? `latest ${version.graphs.length} of ${version.totalGraphs} graphs`
                  : `${version.totalGraphs} graph${version.totalGraphs === 1 ? '' : 's'}`}
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Built</TableCell>
                  <TableCell>Published</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {version.graphs.map(graph => (
                  <TableRow key={graph.graph} selected={graph.current} title={graph.graph}>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {formatGraphTimestamp(graph.timestamp) ?? graph.fileName}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {graph.creationDate
                        ? formatDistanceToNow(new Date(graph.creationDate), { addSuffix: true })
                        : ''}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatSize(graph.size)}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {graph.current && <Chip size="small" color="success" label="current" />}
                        {graph.pinned && (
                          <Chip size="small" color="error" icon={<PushPinIcon />} label="pinned" />
                        )}
                        {!graph.current &&
                          version.currentGraph &&
                          graph.graph > version.currentGraph && (
                            <Chip size="small" variant="outlined" label="not rolled out" />
                          )}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <GraphRowActions
                        version={version}
                        graph={graph}
                        disabled={disabled}
                        onRollout={onRollout}
                        onPinCurrent={onPinCurrent}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default GraphVersionsTable;
