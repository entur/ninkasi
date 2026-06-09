import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingStateProps {
  label?: string;
  inline?: boolean;
}

const LoadingState = ({ label = 'Loading…', inline = false }: LoadingStateProps) =>
  inline ? (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <CircularProgress size={20} />
      <Typography variant="body2">{label}</Typography>
    </Box>
  ) : (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        gap: 1,
      }}
    >
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );

export default LoadingState;
