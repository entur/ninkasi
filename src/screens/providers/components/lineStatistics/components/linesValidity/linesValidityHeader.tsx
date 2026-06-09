import { Box, Typography } from '@mui/material';
import { titleText } from '../../lineStatistics.constants';
import { useLocale } from '../../appContext';

interface Props {
  startDate: string;
  validFromDate: string;
  endDate: string;
}

export const LinesValidityHeader = ({ startDate, validFromDate, endDate }: Props) => {
  const locale = useLocale();
  return (
    <Box sx={{ display: 'flex', pr: '37px' }}>
      <Typography variant="caption" component="div" sx={{ mr: 'auto' }}>
        {startDate}
      </Typography>
      <Typography variant="caption" component="div" sx={{ ml: '35%' }}>
        {`${validFromDate} (120 ${titleText(locale).days})`}
      </Typography>
      <Typography variant="caption" component="div" sx={{ ml: 'auto' }}>
        {endDate}
      </Typography>
    </Box>
  );
};
