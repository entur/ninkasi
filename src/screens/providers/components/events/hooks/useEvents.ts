import { useQuery } from '@tanstack/react-query';
import { useAccessToken } from '@/utils/useAccessToken';
import { useConfig } from '@/contexts/ConfigContext';
import type { TimetableJobEvent } from '../types/event';

const REFRESH_INTERVAL_MS = 5000;

interface UseEventsOptions {
  providerId?: string;
}

export const useEvents = ({ providerId }: UseEventsOptions) => {
  const { timetableEventsApiUrl } = useConfig();
  const { getToken } = useAccessToken();

  const { isLoading, isError, data, error } = useQuery<TimetableJobEvent[]>({
    queryKey: ['events', providerId],
    queryFn: async () => {
      const accessToken = await getToken();
      const response = await fetch(`${timetableEventsApiUrl}/${providerId ? providerId : ''}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Et-Client-Name': 'entur-ninkasi',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const events: TimetableJobEvent[] = await response.json();
      return events.sort((a, b) => a.firstEvent - b.firstEvent).reverse();
    },
    refetchInterval: REFRESH_INTERVAL_MS,
  });

  return { isLoading, isError, data, error };
};
