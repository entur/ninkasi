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
      return <CheckCircleIcon sx={{ ...baseSx, color: 'success.main' }} />;
    case 'PENDING':
      return <AccessTimeIcon sx={{ ...baseSx, color: 'warning.dark' }} />;
    case 'STARTED':
      return <SettingsIcon sx={{ ...baseSx, color: 'info.main' }} />;
    case 'FAILED':
      return <ErrorIcon sx={{ ...baseSx, color: 'error.main' }} />;
    case 'CANCELLED':
      return <ErrorIcon sx={{ ...baseSx, color: 'warning.dark' }} />;
    case 'DUPLICATE':
      return <ErrorIcon sx={{ ...baseSx, color: 'error.main' }} />;
    case 'IGNORED':
      return <AccessTimeIcon sx={{ ...baseSx, color: 'text.primary' }} />;
    case 'TIMEOUT':
      return <HelpIcon sx={{ ...baseSx, color: 'error.main' }} />;
    default:
      return <HelpIcon sx={{ ...baseSx, color: 'text.disabled' }} />;
  }
};

export default EventStatusIcon;
