import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ValidationReport } from '../model/ValidationReport';

export const Preamble = ({ report }: { report: ValidationReport }) => {
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="body1">
        Codespace:{' '}
        <Box component="span" sx={{ fontWeight: 'bold' }}>
          {report.codespace}
        </Box>
      </Typography>
      <Typography variant="body1">
        Report ID:{' '}
        <Box component="span" sx={{ fontWeight: 'bold' }}>
          {report.validationReportId}
        </Box>
      </Typography>
      <Typography variant="body1">
        Created:{' '}
        <Box component="span" sx={{ fontWeight: 'bold' }}>
          {new Date(report.creationDate).toLocaleString()}
        </Box>
      </Typography>
    </Box>
  );
};
