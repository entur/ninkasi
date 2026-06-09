import { Alert, AlertTitle, Box } from '@mui/material';

interface ErrorStateProps {
  title?: string;
  message: string;
  severity?: 'error' | 'warning' | 'info';
}

const ErrorState = ({ title, message, severity = 'error' }: ErrorStateProps) => (
  <Box sx={{ p: 2 }}>
    <Alert severity={severity} variant="outlined">
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      {message}
    </Alert>
  </Box>
);

export default ErrorState;
