import { Link, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useConfig } from '@/contexts/ConfigContext';
import Logo from '../Logo';
import EnvironmentBadge from './EnvironmentBadge';

export default function HeaderBranding() {
  const location = useLocation();
  const cfg = useConfig();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box
        component={Link}
        to="/timetable-pipeline"
        sx={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <Logo pathname={location.pathname} />
      </Box>
      {cfg.envLabel && <EnvironmentBadge label={cfg.envLabel} color={cfg.envLabelColor} />}
    </Box>
  );
}
