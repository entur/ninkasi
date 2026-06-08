import type { ReactElement } from 'react';
import { Alert, Box, CircularProgress } from '@mui/material';

interface Props {
  error: boolean;
  errorText: string;
  children: ReactElement | ReactElement[];
  isLoading: boolean;
}

export const LoadingOrFailed = ({ isLoading, error, errorText, children }: Props) => (
  <>
    {isLoading ? (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 2,
          gap: 1,
        }}
      >
        <CircularProgress size={20} />
        <span>Laster</span>
      </Box>
    ) : error ? (
      <Alert severity="error">{errorText}</Alert>
    ) : (
      children
    )}
  </>
);
