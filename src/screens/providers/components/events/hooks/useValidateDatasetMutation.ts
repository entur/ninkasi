import { useMutation } from '@tanstack/react-query';
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

  const mutation = useMutation({
    mutationFn: async () => {
      const accessToken = await getToken();
      await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Et-Client-Name': 'entur-ninkasi',
        },
      });
    },
  });

  return { mutation };
};
