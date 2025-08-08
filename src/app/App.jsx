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

import React, { Fragment, useCallback, useEffect, useMemo } from 'react';
import cfgreader from 'config/readConfig';
import Header from './components/Header';
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
  adaptV4Theme,
} from '@mui/material/styles'; // v1.x
import { connect } from 'react-redux';
import UtilsActions from 'actions/UtilsActions';
import NoAccess from './components/NoAccess';
import Router from './Router';
import Menu from './components/Menu';
import NotificationContainer from './components/NotificationContainer';
import UserContextActions from '../actions/UserContextActions';
import UserActions from '../actions/UserActions';
import { useAuth } from 'react-oidc-context';

const MainPage = ({ dispatch, isConfigLoaded, isMenuOpen, isAdmin }) => {
  const auth = useAuth();

  const getToken = useCallback(async () => {
    return auth.user?.access_token;
  }, [auth]);

  useEffect(() => {
    dispatch(UserActions.updateAuth(auth));
  }, [auth, dispatch]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      cfgreader.readConfig((config) => {
        window.config = config;
        dispatch(UtilsActions.notifyConfigIsLoaded());
        dispatch(UserContextActions.fetchUserContext(getToken));
      });
    }
  }, [dispatch, auth.isAuthenticated]);

  const theme = useMemo(
    () =>
      createTheme(
        adaptV4Theme({
          palette: {
            mode: 'light',
          },
        }),
      ),
    [],
  );

  if (isConfigLoaded && auth.isAuthenticated) {
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
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
                    auth.signoutRedirect();
                  }}
                />
              )}
            </div>
          </Fragment>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  } else {
    return null;
  }
};

const mapStateToProps = (state) => ({
  isConfigLoaded: state.UtilsReducer.isConfigLoaded,
  isMenuOpen: state.app.isMenuOpen,
  isAdmin: state.UserContextReducer.isRouteDataAdmin,
});

export default connect(mapStateToProps)(MainPage);
