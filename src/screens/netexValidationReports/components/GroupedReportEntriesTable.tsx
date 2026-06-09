import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export const GroupedReportEntriesTable = ({ children }: { children: ReactNode }) => {
  return (
    <Box sx={{ pt: 1 }}>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" />
            <TableCell>File name</TableCell>
            <TableCell>Messages</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </Box>
  );
};
