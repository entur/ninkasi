import { useCallback, useEffect, useMemo } from 'react';
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
  adaptV4Theme,
  CssBaseline,
} from '@mui/material';
import { useAuth } from '../auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateAuth } from '@/reducers/UserReducer';
import { notifyConfigIsLoaded } from '@/reducers/UtilsReducer';
import { fetchUserContext } from '@/reducers/UserContextReducer';
import Header from './components/header/Header';
import NoAccess from './components/NoAccess';
import Router from './Router';
import NotificationContainer from './components/NotificationContainer';

const App = () => {
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const isConfigLoaded = useAppSelector(state => state.UtilsReducer.isConfigLoaded);
  const isAdmin = useAppSelector(state => state.UserContextReducer.isRouteDataAdmin);

  const getToken = useCallback(async () => {
    return auth.user?.access_token ?? '';
  }, [auth]);

  useEffect(() => {
    dispatch(updateAuth(auth));
  }, [auth, dispatch]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      dispatch(notifyConfigIsLoaded());
      dispatch(fetchUserContext(getToken));
    }
  }, [dispatch, auth.isAuthenticated, getToken]);

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

  if (auth.isLoading || !auth.isAuthenticated) {
    return null;
  }

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

export default App;
