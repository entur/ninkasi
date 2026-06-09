import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useAccessToken } from '@/utils/useAccessToken';
import { useConfig } from '@/contexts/ConfigContext';
import type { FetchError, LatestDeliveryDateResponse } from './lineStatistics.response.types';

export const useLatestDeliveryDate = (providerId: string | undefined) => {
  const { getToken } = useAccessToken();
  const { eventsBaseUrl } = useConfig();

  const [latestDeliveryDate, setLatestDeliveryDate] = useState<string | undefined>();
  const [latestDeliveryDateError, setLatestDeliveryDateError] = useState<FetchError | undefined>();

  useEffect(() => {
    const fetchLatestDeliveryDate = async () => {
      const accessToken = await getToken();
      const response = await fetch(`${eventsBaseUrl}latest_upload/${providerId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Et-Client-Name': 'entur-ninkasi',
        },
      });
      if (response.ok) {
        const latestDeliveryDateResponse: LatestDeliveryDateResponse = await response.json();
        setLatestDeliveryDate(
          latestDeliveryDateResponse.date
            ? format(new Date(latestDeliveryDateResponse.date), 'yyyy-MM-dd')
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
  }, [getToken, providerId, eventsBaseUrl]);

  return { latestDeliveryDate, latestDeliveryDateError };
};
