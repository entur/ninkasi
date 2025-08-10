import React, { Fragment, useCallback, useEffect, useMemo } from 'react';
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
  adaptV4Theme,
  CssBaseline,
} from '@mui/material';
import { connect } from 'react-redux';
import { useAuth } from '../auth';
import { useConfig } from '../contexts/ConfigContext';
import Header from './components/header/Header';
import NoAccess from './components/NoAccess';
import Router from './Router';
import NotificationContainer from './components/NotificationContainer';
import UtilsActions from '../actions/UtilsActions';
import UserContextActions from '../actions/UserContextActions';
import UserActions from '../actions/UserActions';

interface AppProps {
  dispatch: any;
  isConfigLoaded: boolean;
  isAdmin: boolean;
}

const App: React.FC<AppProps> = ({ dispatch, isConfigLoaded, isAdmin }) => {
  const auth = useAuth();
  const config = useConfig();

  const getToken = useCallback(async () => {
    return auth.user?.access_token;
  }, [auth]);

  // Update auth in Redux store
  useEffect(() => {
    dispatch(UserActions.updateAuth(auth));
  }, [auth, dispatch]);

  // Initialize app when authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      dispatch(UtilsActions.notifyConfigIsLoaded());
      dispatch(UserContextActions.fetchUserContext(getToken));
    }
  }, [dispatch, auth.isAuthenticated, getToken]);

  // Handle authentication state
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      auth.signinRedirect();
    }
  }, [auth]);

  const theme = useMemo(
    () =>
      createTheme(
        adaptV4Theme({
          palette: {
            mode: 'light',
          },
        })
      ),
    []
  );

  // Show loading state while auth is loading
  if (auth.isLoading) {
    return null;
  }

  // Show nothing while redirecting to auth
  if (!auth.isAuthenticated) {
    return null;
  }

  // Main app render
  if (isConfigLoaded && auth.isAuthenticated) {
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NotificationContainer />
          <Header />
          <div className="app" style={{ marginTop: '64px' }}>
            {isAdmin ? (
              <Router />
            ) : (
              <NoAccess
                username={auth.user?.profile?.name || auth.user?.profile?.email || 'User'}
                handleLogout={() => {
                  auth.signoutRedirect();
                }}
              />
            )}
          </div>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }

  return null;
};

const mapStateToProps = (state: any) => ({
  isConfigLoaded: state.UtilsReducer.isConfigLoaded,
  isAdmin: state.UserContextReducer.isRouteDataAdmin,
});

export default connect(mapStateToProps)(App);
