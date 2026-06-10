import { Link, useLocation } from 'react-router-dom';
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
import Logo from './Logo';

const DESKTOP_WIDTH = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const menuItems = [
  { text: 'Timetable Pipeline', path: '/timetable-pipeline' },
  { text: 'Permissions', path: '/permissions' },
];

interface MenuProps {
  open: boolean;
  onClose: () => void;
}

export default function Menu({ open, onClose }: MenuProps) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <StyledDrawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        root: { keepMounted: true },
        paper: { sx: { width: isMobile ? '100%' : DESKTOP_WIDTH } },
      }}
    >
      <Toolbar
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Logo pathname={null} />
        </Box>
        <IconButton onClick={onClose} aria-label="Close menu" sx={{ color: 'white' }}>
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
              <ListItemText primary={text} slotProps={{ primary: { style: { color: 'white' } } }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </StyledDrawer>
  );
}
