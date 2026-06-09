import { useCallback, useEffect } from 'react';
import { Box, Toolbar } from '@mui/material';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from '../auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateAuth } from '@/reducers/UserReducer';
import { notifyConfigIsLoaded } from '@/reducers/UtilsReducer';
import { fetchUserContext } from '@/reducers/UserContextReducer';
import theme from '@/theme/theme';
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
          <Toolbar />
          <Box component="main">
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
          </Box>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }

  return null;
};

export default App;
