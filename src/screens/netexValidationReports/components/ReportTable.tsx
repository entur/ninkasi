import type { ReactNode } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const ReportTable = ({ children }: { children: ReactNode }) => {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
      <Table sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" />
            <TableCell>Rule name</TableCell>
            <TableCell>Severity</TableCell>
            <TableCell>Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};
