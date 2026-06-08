import { useEffect, useState } from 'react';
import moment from 'moment';
import { useAccessToken } from '@/utils/useAccessToken';
import { useConfig } from '@/contexts/ConfigContext';
import type { FetchError, LatestDeliveryDateResponse } from './lineStatistics.response.types';

export const useLatestDeliveryDate = (providerId: string | undefined) => {
  const { getToken } = useAccessToken();
  const { timetableEventsApiUrl } = useConfig();

  const [latestDeliveryDate, setLatestDeliveryDate] = useState<string | undefined>();
  const [latestDeliveryDateError, setLatestDeliveryDateError] = useState<FetchError | undefined>();

  useEffect(() => {
    const fetchLatestDeliveryDate = async () => {
      const accessToken = await getToken();
      const response = await fetch(`${timetableEventsApiUrl}/latest_upload/${providerId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Et-Client-Name': 'entur-ninkasi',
        },
      });
      if (response.ok) {
        const latestDeliveryDateResponse: LatestDeliveryDateResponse = await response.json();
        setLatestDeliveryDate(
          latestDeliveryDateResponse.date
            ? moment(latestDeliveryDateResponse.date).format('YYYY-MM-DD')
            : 'N/A'
        );
        setLatestDeliveryDateError(undefined);
      } else {
        setLatestDeliveryDateError({
          status: response.status,
          statusText: response.statusText,
        });
      }
    };
    fetchLatestDeliveryDate();
  }, [getToken, providerId, timetableEventsApiUrl]);

  return { latestDeliveryDate, latestDeliveryDateError };
};
