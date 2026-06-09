import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import type { SxProps, Theme } from '@mui/material';

interface Props {
  state: string;
}

const baseSx: SxProps<Theme> = { width: 22, height: 22 };

const EventStatusIcon = ({ state }: Props) => {
  switch (state) {
    case 'OK':
      return <CheckCircleIcon sx={{ ...baseSx, color: 'green' }} />;
    case 'PENDING':
      return <AccessTimeIcon sx={{ ...baseSx, color: 'orange' }} />;
    case 'STARTED':
      return <SettingsIcon sx={{ ...baseSx, color: '#2274b5' }} />;
    case 'FAILED':
      return <ErrorIcon sx={{ ...baseSx, color: 'red' }} />;
    case 'CANCELLED':
      return <ErrorIcon sx={{ ...baseSx, color: 'orange' }} />;
    case 'DUPLICATE':
      return <ErrorIcon sx={{ ...baseSx, color: 'red' }} />;
    case 'IGNORED':
      return <AccessTimeIcon sx={{ ...baseSx, color: 'black' }} />;
    case 'TIMEOUT':
      return <HelpIcon sx={{ ...baseSx, color: 'red' }} />;
    default:
      return <HelpIcon sx={{ ...baseSx, color: 'grey' }} />;
  }
};

export default EventStatusIcon;
