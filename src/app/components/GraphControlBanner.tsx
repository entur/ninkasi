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

import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Alert, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import { fetchGraphControlStatus } from 'reducers/GraphControlReducer';
import { bannerMessages } from 'screens/graphControl/graphControlUtils';

const POLL_INTERVAL = 30000;

/**
 * Warns on every page while the production graph is pinned or the graph builder is paused.
 */
const GraphControlBanner = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();
  const location = useLocation();
  const status = useAppSelector(state => state.GraphControlReducer.status);

  useEffect(() => {
    dispatch(fetchGraphControlStatus(getToken));
    const timer = setInterval(() => dispatch(fetchGraphControlStatus(getToken)), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [dispatch, getToken]);

  const messages = bannerMessages(status);
  if (!messages.length) {
    return null;
  }

  return (
    <Alert
      severity="warning"
      variant="filled"
      sx={{ borderRadius: 0 }}
      action={
        location.pathname !== '/graph-control' && (
          <Button color="inherit" size="small" component={Link} to="/graph-control">
            Open graph control
          </Button>
        )
      }
    >
      {messages.map(message => (
        <div key={message}>{message}</div>
      ))}
    </Alert>
  );
};

export default GraphControlBanner;
