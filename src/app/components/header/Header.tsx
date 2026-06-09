import { useState } from 'react';
import { AppBar, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import { useAppDispatch } from '@/store/hooks';
import { toggleMenu } from '@/reducers/AppReducer';
import { getProvidersEnv, getTheme } from '../../../config/themes';
import Menu from '../Menu';
import HeaderBranding from './HeaderBranding';
import HeaderActions from './HeaderActions';

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const providersEnv = getProvidersEnv(window.config.providersBaseUrl);

  const handleMenuToggle = () => {
    setDrawerOpen(!drawerOpen);
    dispatch(toggleMenu());
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
