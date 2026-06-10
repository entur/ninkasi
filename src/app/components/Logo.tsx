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
  pathname?: string | null;
}

const Logo = ({ pathname }: Props) => {
  const pageName = pageNameFromPathName(pathname);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: 0.2 }}>Ninkasi</Box>
      {pageName && (
        <Box component="span" sx={{ color: 'white', fontSize: '1.5rem', ml: '0.5rem' }}>
          — {pageName}
        </Box>
      )}
    </Box>
  );
};

export default Logo;
