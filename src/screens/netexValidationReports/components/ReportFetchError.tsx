import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import type { ValidationReportFetchError } from '../hooks/useReport';

export const ReportFetchError = ({ error }: { error?: ValidationReportFetchError }) => {
  if (!error) {
    return null;
  }
  return (
    <Alert severity="error" sx={{ my: 2 }}>
      <AlertTitle>Error fetching report</AlertTitle>
      <Box component="pre" sx={{ m: 0 }}>
        {error.status}: {error.statusText}
      </Box>
    </Alert>
  );
};
