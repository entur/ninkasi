import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { getProvidersEnv } from '../../../config/themes';
import Logo from '../Logo';

export default function HeaderBranding() {
  const location = useLocation();
  const providersEnv = getProvidersEnv(window.config.providersBaseUrl);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Link
        to="/timetable-admin"
        style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <Logo providersEnv={providersEnv} pathname={location.pathname} />
      </Link>
    </Box>
  );
}
