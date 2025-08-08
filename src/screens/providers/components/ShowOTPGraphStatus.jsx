import React from 'react';
import GraphStatus from './GraphStatus';
import LatestOTPGraphVersions from './LatestOTPGraphVersions';

export const ShowOTPGraphStatus = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <LatestOTPGraphVersions />
        <GraphStatus />
      </div>
    </div>
  );
};
