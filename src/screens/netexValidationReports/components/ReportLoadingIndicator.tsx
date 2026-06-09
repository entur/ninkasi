import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export const ReportLoadingIndicator = ({ loading }: { loading: boolean }) => {
  if (!loading) {
    return null;
  }
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        my: 2,
      }}
    >
      <CircularProgress size={24} />
      <Typography variant="body1">Loading report</Typography>
    </Box>
  );
};
