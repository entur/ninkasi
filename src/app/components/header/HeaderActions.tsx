import React, { useMemo } from 'react';
import { Box, IconButton, Menu, MenuItem, Avatar, useTheme } from '@mui/material';
import { AccountCircle, Help, Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../../../auth';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';

interface HeaderActionsProps {
  isMobile: boolean;
  onMenuIconClick: () => void;
}

export default function HeaderActions({ isMobile, onMenuIconClick }: HeaderActionsProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const auth = useAuth();
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const { preferredName } = useSelector((state: any) => state.UserContextReducer);

  const initials = useMemo(() => {
    if (typeof preferredName === 'string') {
      const parts = preferredName.trim().split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return preferredName.slice(0, 2).toUpperCase();
    }
    return '';
  }, [preferredName]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 0.5 }}>
      {/* User Account Button */}
      <IconButton
        color="inherit"
        onClick={handleMenuOpen}
        aria-label="user account"
        sx={{ color: 'white' }}
      >
        <Avatar
          className="avatar"
          sx={{
            bgcolor: theme.palette.common.white,
            color: theme.palette.primary.main,
            width: '24px',
            height: '24px',
          }}
        >
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 'bold',
            }}
          >
            {initials}
          </Typography>
        </Avatar>
      </IconButton>

      {/* Menu Button */}
      <IconButton
        color="inherit"
        onClick={onMenuIconClick}
        aria-label="menu"
        sx={{ color: 'white' }}
      >
        <MenuIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          component="a"
          href="https://enturas.atlassian.net/wiki/spaces/ROR/pages/682623320/Brukerveiledning+-+Ninkasi"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 12 }}
        >
          <Help style={{ marginRight: 8, color: '#41c0c4' }} />
          User guide (Norwegian)
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleLogout();
            handleMenuClose();
          }}
          style={{ fontSize: 12 }}
        >
          <AccountCircle style={{ marginRight: 8, color: '#41c0c4' }} />
          Log out {preferredName}
        </MenuItem>
      </Menu>
    </Box>
  );
}
