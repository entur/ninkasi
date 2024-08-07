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

import React, { Fragment, useEffect, useMemo } from 'react';
import cfgreader from 'config/readConfig';
import Header from './components/Header';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles'; // v1.x
import { MuiThemeProvider as V0MuiThemeProvider } from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { connect } from 'react-redux';
import UtilsActions from 'actions/UtilsActions';
import NoAccess from './components/NoAccess';
import Router from './Router';
import Menu from './components/Menu';
import NotificationContainer from './components/NotificationContainer';
import UserContextActions from '../actions/UserContextActions';

const themeV0 = getMuiTheme({
  /* theme for v0.x */
});

const MainPage = ({ dispatch, isConfigLoaded, isMenuOpen, auth, isAdmin }) => {
  useEffect(() => {
    cfgreader.readConfig(config => {
      window.config = config;
      dispatch(UtilsActions.notifyConfigIsLoaded());
      dispatch(UserContextActions.fetchUserContext());
    });
  }, [dispatch]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          type: 'light'
        }
      }),
    []
  );

  if (isConfigLoaded && auth.roleAssignments) {
    return (
      <MuiThemeProvider theme={theme}>
        <V0MuiThemeProvider muiTheme={themeV0}>
          <Fragment>
            <NotificationContainer />
            <Menu open={isMenuOpen} />
            <div className="app">
              <Header />
              {isAdmin ? (
                <Router />
              ) : (
                <NoAccess
                  username={auth.user.name}
                  handleLogout={() => {
                    auth.logout({ returnTo: window.location.origin });
                  }}
                />
              )}
            </div>
          </Fragment>
        </V0MuiThemeProvider>
      </MuiThemeProvider>
    );
  } else {
    return null;
  }
};

const mapStateToProps = state => ({
  auth: state.UserReducer.auth,
  isConfigLoaded: state.UtilsReducer.isConfigLoaded,
  isMenuOpen: state.app.isMenuOpen,
  isAdmin: state.UserContextReducer.isRouteDataAdmin
});

export default connect(mapStateToProps)(MainPage);
