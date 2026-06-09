import { useCallback, useState } from 'react';
import axios from 'axios';
import { useAccessToken } from '@/utils/useAccessToken';
import { useConfig } from '@/contexts/ConfigContext';

interface UseValidateDatasetMutationOptions {
  providerId?: string;
}

export const useValidateDatasetMutation = ({ providerId }: UseValidateDatasetMutationOptions) => {
  const { timetableAdminApiUrl } = useConfig();
  const { getToken } = useAccessToken();
  const url = `${timetableAdminApiUrl}/${providerId}/validate`;
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(async () => {
    setIsPending(true);
    try {
      const accessToken = await getToken();
      await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Et-Client-Name': 'entur-ninkasi',
        },
      });
    } finally {
      setIsPending(false);
    }
  }, [getToken, url]);

  return { mutation: { mutate, isPending } };
};
