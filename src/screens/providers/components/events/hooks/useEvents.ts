import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
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
  const [data, setData] = useState<TimetableJobEvent[] | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    let cancelled = false;

    const fetchEvents = async () => {
      try {
        const accessToken = await getToken();
        const response = await axios.get<TimetableJobEvent[]>(
          `${timetableEventsApiUrl}/${providerId ?? ''}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Et-Client-Name': 'entur-ninkasi',
            },
          }
        );
        if (cancelled || !isMountedRef.current) return;
        const sorted = [...response.data].sort((a, b) => a.firstEvent - b.firstEvent).reverse();
        setData(sorted);
        setError(undefined);
      } catch (e) {
        if (cancelled || !isMountedRef.current) return;
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (!cancelled && isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [providerId, getToken, timetableEventsApiUrl]);

  return { isLoading, isError: !!error, data, error };
};
