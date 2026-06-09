import { Box } from '@mui/material';
import GraphStatus from './GraphStatus';
import LatestOTPGraphVersions from './LatestOTPGraphVersions';

export const ShowOTPGraphStatus = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <LatestOTPGraphVersions />
        <GraphStatus />
      </Box>
    </Box>
  );
};
