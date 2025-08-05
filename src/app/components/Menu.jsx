import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import AppActions from 'actions/AppActions';
import { getProvidersEnv, getTheme } from 'config/themes';
import Logo from './Logo';

const Router = props => {
  const handleMenuItemClick = route => {
    props.toggleMenu();
    props.pushRoute(route);
  };

  const providersEnv = getProvidersEnv(window.config.providersBaseUrl);

  const drawerStyle = {
    width: '250px'
    //...getTheme(providersEnv)
  };

  const paperStyle = {
    ...getTheme(providersEnv)
  };

  return (
    <Drawer
      open={props.open}
      style={drawerStyle}
      PaperProps={{
        style: paperStyle
      }}
      onClose={() => props.toggleMenu()}
    >
      <div
        style={{
          minHeight: '64px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          lineHeight: '64px'
        }}
      >
        <Logo providersEnv={providersEnv} />
      </div>
      <Divider />
      <List style={{ width: '250px' }}>
        <ListItem
          button
          onClick={() => handleMenuItemClick('/')}
          selected={props.pathname === '/'}
        >
          <ListItemText
            primary="Providers"
            primaryTypographyProps={{ style: { color: 'white' } }}
          />
        </ListItem>
        <ListItem
          button
          onClick={() => handleMenuItemClick('/geocoder')}
          selected={props.pathname === '/geocoder'}
        >
          <ListItemText
            primary="Geocoder"
            primaryTypographyProps={{ style: { color: 'white' } }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

const mapStateToProps = state => ({
  pathname: state.router.location.pathname,
  search: state.router.location.search,
  hash: state.router.location.hash
});

const mapDispatchToProps = dispatch => {
  return {
    pushRoute: route => dispatch(push(route)),
    toggleMenu: () => dispatch(AppActions.toggleMenu())
  };
};

Router.defaultProps = {
  open: false
};

export default connect(mapStateToProps, mapDispatchToProps)(Router);
