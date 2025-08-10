import React, { useState } from 'react';
import { AppBar, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import { useDispatch } from 'react-redux';
import { getProvidersEnv, getTheme } from '../../../config/themes';
import AppActions from '../../../actions/AppActions';
import Menu from '../Menu';
import HeaderBranding from './HeaderBranding';
import HeaderActions from './HeaderActions';

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch<any>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const providersEnv = getProvidersEnv(window.config.providersBaseUrl);

  const handleMenuToggle = () => {
    setDrawerOpen(!drawerOpen);
    dispatch(AppActions.toggleMenu());
  };

  const backgroundStyle = {
    ...getTheme(providersEnv),
  };

  return (
    <>
      <AppBar position="fixed" style={backgroundStyle}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            minHeight: { xs: '64px' },
          }}
        >
          <HeaderBranding />
          <HeaderActions isMobile={isMobile} onMenuIconClick={handleMenuToggle} />
        </Toolbar>
      </AppBar>

      <Menu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
