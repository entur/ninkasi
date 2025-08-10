import React from 'react';
import { Box, IconButton, Menu, MenuItem, Badge } from '@mui/material';
import { MoreVert, AccountCircle, Help, History, Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../../../auth';
import { useDispatch } from 'react-redux';
import SuppliersActions from '../../../actions/SuppliersActions';

interface HeaderActionsProps {
  isMobile: boolean;
  onMenuIconClick: () => void;
}

export default function HeaderActions({ isMobile, onMenuIconClick }: HeaderActionsProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const auth = useAuth();
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  const handleShowHistory = () => {
    dispatch(SuppliersActions.openHistoryModal());
    handleMenuClose();
  };

  const username = auth.user?.profile?.name || auth.user?.profile?.email || 'User';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 0.5 }}>
      {/* User Account Button */}
      <IconButton
        color="inherit"
        onClick={handleMenuOpen}
        aria-label="user account"
        sx={{ color: 'white' }}
      >
        <Badge color="success" overlap="circular" variant="dot">
          <AccountCircle />
        </Badge>
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
        <MenuItem onClick={handleShowHistory} style={{ fontSize: 12 }}>
          <History style={{ marginRight: 8, color: '#41c0c4' }} />
          History
        </MenuItem>
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
          Log out {username}
        </MenuItem>
      </Menu>
    </Box>
  );
}
