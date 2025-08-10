/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert, AccountCircle, Help, History, Menu as MenuIcon } from '@mui/icons-material';
import AppActions from 'actions/AppActions';
import SuppliersActions from 'actions/SuppliersActions';
import { getProvidersEnv, getTheme } from 'config/themes';
import Logo from './Logo';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  handleLogout() {
    const { auth } = this.props;
    if (auth) {
      auth.logout({ returnTo: window.location.origin });
    }
  }

  handleShowHistory() {
    this.props.dispatch(SuppliersActions.openHistoryModal());
  }

  handleMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  getUsername() {
    const { auth } = this.props;
    if (auth && auth.user) {
      return auth.user.name || 'N/A';
    }
  }

  render() {
    const providersEnv = getProvidersEnv(window.config.providersBaseUrl);
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    const backgroundStyle = {
      height: 60,
      ...getTheme(providersEnv),
    };

    const username = this.getUsername();
    return (
      <>
        <AppBar position="static" style={backgroundStyle}>
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => this.props.dispatch(AppActions.toggleMenu())}
              size="large"
            >
              <MenuIcon sx={{ color: 'white !important' }} />
            </IconButton>
            <div
              style={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Logo providersEnv={providersEnv} pathname={this.props.pathname} />
            </div>
            <IconButton edge="end" onClick={this.handleMenuOpen} size="large">
              <MoreVert sx={{ color: 'white !important' }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleMenuClose}
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
            onClick={() => {
              this.handleShowHistory();
              this.handleMenuClose();
            }}
            style={{ fontSize: 12 }}
          >
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
              this.handleLogout();
              this.handleMenuClose();
            }}
            style={{ fontSize: 12 }}
          >
            <AccountCircle style={{ marginRight: 8, color: '#41c0c4' }} />
            Log out {username}
          </MenuItem>
        </Menu>
      </>
    );
  }
}

const mapStateToProps = ({ UserReducer, router }) => ({
  auth: UserReducer.auth,
  pathname: router.location.pathname,
});

export default connect(mapStateToProps)(Header);
