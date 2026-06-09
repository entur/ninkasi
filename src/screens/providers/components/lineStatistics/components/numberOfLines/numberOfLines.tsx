import { Box, Typography } from '@mui/material';
import { Card } from '../card/card';
import { titleText, palette } from '../../lineStatistics.constants';
import type { NumberOfLinesType } from '../pieStatistics/pieStatistics.types';
import { useLocale } from '../../appContext';

interface Props {
  numberOfLines: NumberOfLinesType;
}

export const NumberOfLines = ({ numberOfLines }: Props) => {
  const locale = useLocale();
  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-around' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <Typography variant="h4">{titleText(locale).numberOfLines}</Typography>
        <Typography variant="h1" sx={{ m: '15px 0 0 0' }}>
          {numberOfLines.totalNumberOfLines}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around',
          mt: '24px',
        }}
      >
        <Typography variant="h2" sx={{ m: 0, lineHeight: '3rem', color: palette.valid }}>
          {numberOfLines.numberOfValidLines}
        </Typography>
        <Typography variant="h2" sx={{ m: 0, lineHeight: '3rem', color: palette.expiring }}>
          {numberOfLines.numberOfExpiringLines}
        </Typography>
        <Typography variant="h2" sx={{ m: 0, lineHeight: '3rem', color: palette.expired }}>
          {numberOfLines.numberOfExpiredLines}
        </Typography>
      </Box>
    </Card>
  );
};
