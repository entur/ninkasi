import { useState } from 'react';
import { AppBar, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import { useAppDispatch } from '@/store/hooks';
import { toggleMenu } from '@/reducers/AppReducer';
import Menu from '../Menu';
import HeaderBranding from './HeaderBranding';
import HeaderActions from './HeaderActions';

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuToggle = () => {
    setDrawerOpen(!drawerOpen);
    dispatch(toggleMenu());
  };

  return (
    <>
      <AppBar position="fixed">
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
