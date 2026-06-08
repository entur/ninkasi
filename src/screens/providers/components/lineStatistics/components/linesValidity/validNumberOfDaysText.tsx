import { Typography } from '@mui/material';
import { titleText } from '../../lineStatistics.constants';
import { useLocale } from '../../appContext';

interface Props {
  lineNumber: string;
  numberOfDays: number;
}

export const ValidNumberOfDaysText = ({ lineNumber, numberOfDays }: Props) => {
  const locale = useLocale();
  return (
    <>
      {numberOfDays === 0 && (
        <Typography variant="caption">{titleText(locale).noLongerValid(lineNumber)}</Typography>
      )}

      {numberOfDays > 0 && numberOfDays < 120 && (
        <Typography variant="caption">
          {titleText(locale).expiringLine(lineNumber, numberOfDays)}
        </Typography>
      )}

      {numberOfDays >= 120 && (
        <Typography variant="caption">
          {titleText(locale).validLine(lineNumber, numberOfDays)}
        </Typography>
      )}
    </>
  );
};
