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
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ fontSize: '1.5rem' }}>Ninkasi</div>
      {providersEnv !== 'PROD' && (
        <div
          style={{
            marginLeft: 5,
            fontSize: '0.75rem',
            lineHeight: '3rem',
          }}
        >
          {providersEnv}
        </div>
      )}
      {pathname && (
        <span
          style={{
            color: 'white',
            fontSize: '1.5rem',
            marginLeft: '0.5rem',
          }}
        >
          {pageNameFromPathName(pathname) !== '' ? `— ${pageNameFromPathName(pathname)}` : ''}
        </span>
      )}
    </div>
  );
};
