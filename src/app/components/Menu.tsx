import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  IconButton,
  styled,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { getProvidersEnv, getTheme } from '../../config/themes';
import Logo from './Logo';

const DESKTOP_WIDTH = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const menuItems = [
  { text: 'Providers', path: '/' },
  { text: 'Geocoder', path: '/geocoder' },
];

interface MenuProps {
  open: boolean;
  onClose: () => void;
}

export default function Menu({ open, onClose }: MenuProps) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const providersEnv = getProvidersEnv(window.config.providersBaseUrl);
  const themeColors = getTheme(providersEnv);

  return (
    <StyledDrawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : DESKTOP_WIDTH,
          ...themeColors,
        },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1,
          ...themeColors,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Logo providersEnv={providersEnv} pathname={null} />
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <ChevronRightIcon />
        </IconButton>
      </Toolbar>
      <Divider />

      <List disablePadding>
        {menuItems.map(({ text, path }) => (
          <ListItem key={path} disablePadding>
            <ListItemButton
              component={Link}
              to={path}
              onClick={onClose}
              selected={location.pathname === path}
            >
              <ListItemText primary={text} primaryTypographyProps={{ style: { color: 'white' } }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </StyledDrawer>
  );
}
