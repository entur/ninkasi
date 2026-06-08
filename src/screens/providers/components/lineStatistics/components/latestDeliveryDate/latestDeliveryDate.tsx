import { Typography } from '@mui/material';
import { Card } from '../card/card';
import { errorText, titleText } from '../../lineStatistics.constants';
import { useLocale } from '../../appContext';
import { useLatestDeliveryDate } from '../../apiHooks/useLatestDeliveryDate';
import { LoadingOrFailed } from '../LoadingOrFailed';

interface Props {
  providerId: string;
}

export const LatestDeliveryDate = ({ providerId }: Props) => {
  const locale = useLocale();
  const { latestDeliveryDate, latestDeliveryDateError } = useLatestDeliveryDate(providerId);
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4">{titleText(locale).latestDeliveryDate}</Typography>
      <LoadingOrFailed
        errorText={errorText(locale).failedToLoadLatestDate}
        isLoading={!latestDeliveryDate && !latestDeliveryDateError}
        error={!!latestDeliveryDateError}
      >
        <Typography variant="h1" sx={{ m: '15px 0 0 0' }}>
          {latestDeliveryDate}
        </Typography>
      </LoadingOrFailed>
    </Card>
  );
};
