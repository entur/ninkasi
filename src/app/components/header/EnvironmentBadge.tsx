import { Chip } from '@mui/material';

interface EnvironmentBadgeProps {
  label: string;
  color?: string;
}

const EnvironmentBadge = ({ label, color }: EnvironmentBadgeProps) => (
  <Chip
    label={label}
    size="small"
    sx={{
      height: 20,
      fontSize: '0.7rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: 'white',
      backgroundColor: color,
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }}
  />
);

export default EnvironmentBadge;
