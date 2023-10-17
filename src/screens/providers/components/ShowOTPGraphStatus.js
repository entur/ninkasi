import React, { useState } from 'react';
import GraphStatus from './GraphStatus';
import LatestOTPGraphVersions from './LatestOTPGraphVersions';
import CloseButton from 'material-ui/svg-icons/navigation/close';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';

export const ShowOTPGraphStatus = () => {
  const [showGraphStatus, setShowGraphStatus] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ alignSelf: 'flex-end', margin: '10px' }}>
        <IconButton
          tooltip={
            showGraphStatus ? 'Hide OTP graph status' : 'Show OTP graph status'
          }
          tooltipPosition="bottom-left"
          onClick={() => setShowGraphStatus(!showGraphStatus)}
        >
          {showGraphStatus ? <CloseButton /> : <ArrowBack />}
        </IconButton>
      </div>
      {showGraphStatus && (
        <div
          style={{ display: 'flex', flexDirection: 'column', margin: '0 20px' }}
        >
          <GraphStatus />
          <LatestOTPGraphVersions />
        </div>
      )}
    </div>
  );
};
