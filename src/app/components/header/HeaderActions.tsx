import React, { useMemo } from 'react';
import { Box, IconButton, Menu, MenuItem, Avatar, useTheme, Typography } from '@mui/material';
import { HelpOutline, Menu as MenuIcon, OpenInNew } from '@mui/icons-material';
import { useAuth } from '../../../auth';
import { useSelector } from 'react-redux';

interface HeaderActionsProps {
  isMobile: boolean;
  onMenuIconClick: () => void;
}

export default function HeaderActions({ isMobile, onMenuIconClick }: HeaderActionsProps) {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorElDocs, setAnchorElDocs] = React.useState<null | HTMLElement>(null);
  const auth = useAuth();
  const theme = useTheme();

  const { preferredName } = useSelector((state: any) => state.UserContextReducer);

  const initials = useMemo(() => {
    if (typeof preferredName === 'string') {
      const parts = preferredName.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      return preferredName.slice(0, 2).toUpperCase();
    }
    return '';
  }, [preferredName]);

  const handleUserMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorElUser(e.currentTarget);
  const handleUserMenuClose = () => setAnchorElUser(null);
  const handleDocsMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorElDocs(e.currentTarget);
  const handleDocsMenuClose = () => setAnchorElDocs(null);
  const handleLogout = () => auth.signoutRedirect();

  const menuStyles = {
    mt: 1,
    minWidth: 140,
    borderRadius: 2,
    boxShadow: 3,
    '& .MuiPaper-root': {
      bgcolor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    '& .MuiMenuItem-root': {
      '&:hover': {
        bgcolor: theme.palette.action.hover,
        color: theme.palette.text.primary,
      },
    },
  } as const;

  const iconButtonStyles = {
    bgcolor: theme.palette.common.white,
    color: theme.palette.primary.main,
    width: 24,
    height: 24,
    borderRadius: '50%',
    p: 0,
    boxShadow: 1,
    transition: theme.transitions.create(['transform', 'background-color', 'box-shadow'], {
      duration: theme.transitions.duration.shortest,
    }),
    '&:hover, &:focus-visible': {
      transform: 'scale(1.06)',
      boxShadow: 2,
      bgcolor: theme.palette.common.white,
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&:hover, &:focus-visible': { transform: 'none' },
    },
  } as const;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 0.5 }}>
      <IconButton onClick={handleUserMenuOpen} aria-label="user account" sx={iconButtonStyles}>
        <Avatar
          sx={{
            bgcolor: 'transparent',
            color: theme.palette.primary.main,
            width: '100%',
            height: '100%',
          }}
        >
          <Typography sx={{ fontSize: '13px', fontWeight: 'bold' }}>{initials}</Typography>
        </Avatar>
      </IconButton>

      <IconButton onClick={handleDocsMenuOpen} aria-label="documentation" sx={iconButtonStyles}>
        <HelpOutline />
      </IconButton>

      <IconButton
        color="inherit"
        onClick={onMenuIconClick}
        aria-label="menu"
        sx={{ color: theme.palette.common.white }}
      >
        <MenuIcon />
      </IconButton>

      <Menu
        disableScrollLock
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleUserMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={menuStyles}
      >
        <MenuItem
          onClick={() => {
            handleLogout();
            handleUserMenuClose();
          }}
          sx={{ fontSize: '1em' }}
        >
          Log out {preferredName}
        </MenuItem>
      </Menu>

      <Menu
        disableScrollLock
        anchorEl={anchorElDocs}
        open={Boolean(anchorElDocs)}
        onClose={handleDocsMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ ...menuStyles, minWidth: 200 }}
      >
        <MenuItem
          component="a"
          href="https://enturas.atlassian.net/wiki/spaces/ROR/pages/682623320/Brukerveiledning+-+Ninkasi"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            fontSize: '1em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          User guide (Norwegian)
          <OpenInNew fontSize="small" sx={{ ml: 1 }} />
        </MenuItem>
      </Menu>
    </Box>
  );
}
