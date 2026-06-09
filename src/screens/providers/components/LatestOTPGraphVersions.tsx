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

import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import moment from 'moment';
import { UnfoldLess, UnfoldMore } from '@mui/icons-material';
import { Popover } from '@mui/material';
import Button from '@mui/material/Button';
import * as SuppliersReducer from 'reducers/SuppliersReducer';
const { fetchOTPGraphVersions } = SuppliersReducer as any;

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: 'rgb(229, 229, 229)',
};

const wrapperStyle: React.CSSProperties = {
  padding: '20px',
};

const versionDetailsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  whiteSpace: 'nowrap',
  borderBottom: '1px solid gray',
  paddingBottom: '10px',
};

interface GraphVersionDetailsProps {
  name: string;
  serializationId: string;
  creationDate: string;
  size: number;
}

const GraphVersionDetails = ({
  name,
  serializationId,
  creationDate,
  size,
}: GraphVersionDetailsProps) => (
  <div style={versionDetailsStyle}>
    <div>
      <h5>{name}</h5>
    </div>
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontWeight: 'bold' }}>Serialization id: </span>
        <span style={{ fontWeight: 'bold' }}>Created: </span>
        <span style={{ fontWeight: 'bold' }}>Size: </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
        <span>{serializationId}</span>
        <span title={moment(creationDate).fromNow()}>
          {moment(creationDate).format('DD-MM-YYYY HH:mm:ss')}
        </span>
        <span>{Math.round((size / 1024 / 1024 / 1024 + Number.EPSILON) * 100) / 100} GB</span>
      </div>
    </div>
  </div>
);

const LatestOTPGraphVersions = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  const streetGraphs = useAppSelector(state => (state.SuppliersReducer as any).streetGraphs);
  const transitGraphs = useAppSelector(state => (state.SuppliersReducer as any).transitGraphs);

  const [showGraphVersions, setShowGraphVersions] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const requestOTPGraphVersions = () => {
    dispatch(fetchOTPGraphVersions(getToken));
  };

  return (
    <>
      <Button
        variant="text"
        sx={{ color: 'black' }}
        startIcon={
          showGraphVersions ? (
            <UnfoldLess sx={{ color: 'black' }} />
          ) : (
            <UnfoldMore sx={{ color: 'black' }} />
          )
        }
        onClick={(e: MouseEvent<HTMLElement>) => {
          e.preventDefault();
          setShowGraphVersions(true);
          setAnchorEl(e.currentTarget);
          requestOTPGraphVersions();
        }}
      >
        OTP graph versions
      </Button>
      <Popover
        open={showGraphVersions}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        onClose={() => setShowGraphVersions(false)}
      >
        <div style={containerStyle}>
          {!streetGraphs || !transitGraphs ? (
            <div style={wrapperStyle}>Loading ...</div>
          ) : (
            <>
              <div style={wrapperStyle}>
                <h3
                  style={{
                    fontWeight: 'bold',
                    marginBottom: 0,
                    marginTop: 0,
                  }}
                >
                  Latest Street Graphs
                </h3>
                <>
                  {streetGraphs.map((streetGraph: any) => (
                    <GraphVersionDetails
                      key={streetGraph.serializationId}
                      name={streetGraph.name}
                      serializationId={streetGraph.serializationId}
                      creationDate={streetGraph.creationDate}
                      size={streetGraph.size}
                    />
                  ))}
                </>
              </div>
              <div style={wrapperStyle}>
                <h3
                  style={{
                    fontWeight: 'bold',
                    marginBottom: 0,
                    marginTop: 0,
                  }}
                >
                  Latest Transit Graphs
                </h3>
                <>
                  {transitGraphs.map((transitGraph: any) => (
                    <GraphVersionDetails
                      key={transitGraph.serializationId}
                      name={transitGraph.name}
                      serializationId={transitGraph.serializationId}
                      creationDate={transitGraph.creationDate}
                      size={transitGraph.size}
                    />
                  ))}
                </>
              </div>
            </>
          )}
        </div>
      </Popover>
    </>
  );
};

export default LatestOTPGraphVersions;
