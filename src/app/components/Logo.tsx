const pageNameFromPathName = (pathname: string | null | undefined): string => {
  switch (pathname) {
    case '/':
    case '/timetable-admin':
    case '/timetable-pipeline':
      return 'Timetable Pipeline';
    case '/permissions':
      return 'Permissions';
    default:
      return '';
  }
};

interface Props {
  providersEnv?: string;
  pathname?: string | null;
}

const Logo = ({ providersEnv, pathname }: Props) => {
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

export default Logo;
