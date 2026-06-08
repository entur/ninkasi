import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { ValidationReportEntry } from '../model/ValidationReport';
import type { GroupedEntry } from '../util/groupReportEntries';

export const ReportEntryTable = ({
  subEntry,
}: {
  subEntry: [keyof ValidationReportEntry, GroupedEntry];
}) => {
  return (
    <Box sx={{ pt: 1 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ pl: 9 }}>Line</TableCell>
            <TableCell>Column</TableCell>
            <TableCell>Id</TableCell>
            <TableCell>Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subEntry[1].entries?.map((messageEntry, messageEntryIndex) => (
            <TableRow key={messageEntryIndex}>
              <TableCell sx={{ pl: 9 }}>{messageEntry.lineNumber}</TableCell>
              <TableCell>{messageEntry.columnNumber}</TableCell>
              <TableCell>{messageEntry.objectId}</TableCell>
              <TableCell>{messageEntry.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
