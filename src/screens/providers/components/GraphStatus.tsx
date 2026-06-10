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
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import { format, formatDistanceToNow } from 'date-fns';
import * as SuppliersReducer from 'reducers/SuppliersReducer';
const { fetchGraphStatus } = SuppliersReducer as any;

const getColorByStatus = (status?: string) => {
  switch (status) {
    case 'STARTED':
      return '#08920e';
    case 'OK':
      return '#08920e';
    case 'FAILED':
      return '#990000';
    default:
      return 'grey';
  }
};

const containerSx = {
  display: 'flex',
  flexDirection: 'row',
  margin: '0 20px',
  lineHeight: '24px',
};

const wrapperSx = {
  display: 'flex',
  flexDirection: 'column',
  margin: '0 10px',
};

const statusSx = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
};

interface GraphStatusDetailsProps {
  status?: string;
  started?: string;
}

const GraphStatusDetails = ({ status, started }: GraphStatusDetailsProps) => (
  <Box sx={statusSx}>
    {status && started && (
      <>
        <Box
          component="span"
          sx={{
            fontWeight: 600,
            marginLeft: '5px',
            color: getColorByStatus(status),
          }}
        >
          {status}
        </Box>
        <Box
          component="span"
          title={format(new Date(started), 'dd-MM-yyyy HH:mm:ss')}
          sx={{ fontSize: '0.8em', paddingLeft: '5px', whiteSpace: 'nowrap' }}
        >
          {formatDistanceToNow(new Date(started), { addSuffix: true })}
        </Box>
      </>
    )}
  </Box>
);

const GraphStatus = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  const graphStatus = useAppSelector(state => (state.SuppliersReducer as any).graphStatus);
  const baseGraphStatus = useAppSelector(state => (state.SuppliersReducer as any).baseGraphStatus);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    dispatch(fetchGraphStatus(getToken));
    const startTimeout = setTimeout(() => {
      timer = setInterval(() => {
        dispatch(fetchGraphStatus(getToken));
      }, 10000);
    }, 1000);
    return () => {
      clearTimeout(startTimeout);
      if (timer) clearInterval(timer);
    };
  }, [dispatch, getToken]);

  if (!graphStatus || !baseGraphStatus) {
    return null;
  }

  return (
    <Box sx={containerSx}>
      <Box sx={wrapperSx}>
        <Box component="h4" sx={{ fontWeight: 'bold', margin: '0' }}>
          Transit Graph status
        </Box>
        <Box component="h4" sx={{ fontWeight: 'bold', margin: '0' }}>
          Street Graph status
        </Box>
      </Box>
      <Box sx={wrapperSx}>
        {graphStatus.otp2 && (
          <GraphStatusDetails status={graphStatus.otp2.status} started={graphStatus.otp2.started} />
        )}
        {baseGraphStatus.otp2 && (
          <GraphStatusDetails
            status={baseGraphStatus.otp2.status}
            started={baseGraphStatus.otp2.started}
          />
        )}
      </Box>
    </Box>
  );
};

export default GraphStatus;
