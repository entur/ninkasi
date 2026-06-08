import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export const NoValidationIssues = () => {
  return (
    <Alert severity="info" sx={{ my: 2 }}>
      <AlertTitle>No validation issues</AlertTitle>
      The validation report contains no issues.
    </Alert>
  );
};
