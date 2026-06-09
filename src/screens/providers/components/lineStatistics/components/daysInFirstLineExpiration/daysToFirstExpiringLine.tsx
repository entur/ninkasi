import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { Card } from '../card/card';
import { titleText, palette } from '../../lineStatistics.constants';
import type { LineStatistics } from '../../lineStatistics.types';
import { useLocale } from '../../appContext';

interface Props {
  lineStatistics?: LineStatistics | undefined;
  exportedLineStatistics?: LineStatistics | undefined;
}

export const DaysToFirstExpiringLine = ({ lineStatistics, exportedLineStatistics }: Props) => {
  const locale = useLocale();
  const [numberOfDays, setNumberOfDays] = useState<number>(0);

  useEffect(() => {
    const minLineStatistics = lineStatistics
      ? Math.min(...Object.values(lineStatistics.linesMap).map(lineStats => lineStats.daysValid))
      : 0;

    const minExportedLineStatistics = exportedLineStatistics
      ? Math.min(
          ...Object.values(exportedLineStatistics.linesMap).map(lineStats => lineStats.daysValid)
        )
      : 0;
    setNumberOfDays(Math.min(minLineStatistics, minExportedLineStatistics));
  }, [lineStatistics, exportedLineStatistics]);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4">{titleText(locale).daysToFirstExpiringLine}</Typography>
      <Typography variant="h1" sx={{ m: '15px 0 0 0', color: palette.expiring }}>
        {numberOfDays}
      </Typography>
    </Card>
  );
};
