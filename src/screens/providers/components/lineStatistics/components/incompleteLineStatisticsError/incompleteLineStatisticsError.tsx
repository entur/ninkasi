import { Alert, Box } from '@mui/material';
import type { FetchError } from '../../apiHooks/lineStatistics.response.types';
import { errorText } from '../../lineStatistics.constants';
import { useLocale } from '../../appContext';

interface Props {
  lineStatisticsError?: FetchError | null;
}

export const IncompleteLineStatisticsError = ({ lineStatisticsError }: Props) => {
  const locale = useLocale();
  if (!lineStatisticsError) {
    return null;
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Alert severity="error">{errorText(locale).missingLineStatisticsFromOperatorPortal}</Alert>
    </Box>
  );
};
