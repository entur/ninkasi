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

import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { format } from 'date-fns';
import type { GraphControlAction } from './graphControlUtils';
import { actionLabel, graphLabel } from './graphControlUtils';

const RecentGraphActions = ({ actions }: { actions: GraphControlAction[] }) => {
  if (!actions.length) {
    return <Typography color="text.secondary">No action yet.</Typography>;
  }
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>When</TableCell>
          <TableCell>Who</TableCell>
          <TableCell>Action</TableCell>
          <TableCell>Graph</TableCell>
          <TableCell>Reason</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {actions.map(action => (
          <TableRow
            key={`${action.performedAt}-${action.action}-${action.performedBy}-${action.graph ?? ''}`}
          >
            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              {format(new Date(action.performedAt), 'yyyy-MM-dd HH:mm:ss')}
            </TableCell>
            <TableCell>{action.performedBy}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{actionLabel(action.action)}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }} title={action.graph ?? ''}>
              {action.graph ? `${graphLabel(action.graph)} (${action.serializationId})` : ''}
            </TableCell>
            <TableCell>{action.reason}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RecentGraphActions;
