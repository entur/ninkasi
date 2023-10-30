import React from 'react';
import GraphStatus from './GraphStatus';
import LatestOTPGraphVersions from './LatestOTPGraphVersions';

export const ShowOTPGraphStatus = () => {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          margin: '0px 20px 0 10px;',
          justifyContent: 'flex-end'
        }}
      >
        <LatestOTPGraphVersions />
        <GraphStatus />
      </div>
    </div>
  );
};
