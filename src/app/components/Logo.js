import React from 'react';

const pageNameFromPathName = pathname => {
  switch (pathname) {
    case '/':
      return 'Providers';
    case '/geocoder':
      return 'Geocoder';
    default:
      return '';
  }
};

export default ({ providersEnv, pathname }) => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ fontSize: '1.5rem' }}>Ninkasi</div>
      {providersEnv !== 'PROD' && (
        <div
          style={{
            marginLeft: 5,
            fontSize: '0.75rem',
            lineHeight: '3rem'
          }}
        >
          {providersEnv}
        </div>
      )}
      — {pageNameFromPathName(pathname)}
    </div>
  );
};
