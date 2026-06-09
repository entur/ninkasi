import { Box } from '@mui/material';

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
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ fontSize: '1.5rem' }}>Ninkasi</Box>
      {providersEnv !== 'PROD' && (
        <Box
          sx={{
            marginLeft: '5px',
            fontSize: '0.75rem',
            lineHeight: '3rem',
          }}
        >
          {providersEnv}
        </Box>
      )}
      {pathname && (
        <Box
          component="span"
          sx={{
            color: 'white',
            fontSize: '1.5rem',
            marginLeft: '0.5rem',
          }}
        >
          {pageNameFromPathName(pathname) !== '' ? `— ${pageNameFromPathName(pathname)}` : ''}
        </Box>
      )}
    </Box>
  );
};

export default Logo;
