import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface EmptyStateProps {
  message: string;
  icon?: ReactNode;
}

const EmptyState = ({ message, icon }: EmptyStateProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 4,
      gap: 1,
      color: 'text.secondary',
    }}
  >
    {icon}
    <Typography variant="body2">{message}</Typography>
  </Box>
);

export default EmptyState;
