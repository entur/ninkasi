import { useCallback, useState } from 'react';
import axios from 'axios';
import { useAccessToken } from '@/utils/useAccessToken';
import { useConfig } from '@/contexts/ConfigContext';

export enum FileUploadState {
  NOT_STARTED,
  STARTED,
  COMPLETED,
  FAILED,
}

interface UseFileUploadMutationOptions {
  providerId?: string;
  isFlexDataset: boolean;
}

export const useFileUploadMutation = ({
  providerId,
  isFlexDataset,
}: UseFileUploadMutationOptions) => {
  const { timetableAdminApiUrl } = useConfig();
  const { getToken } = useAccessToken();
  const url = `${timetableAdminApiUrl}/${providerId}/files`;
  const flexUrl = `${timetableAdminApiUrl}/${providerId}/flex/files`;

  const [fileUploadState, setFileUploadState] = useState<FileUploadState>(
    FileUploadState.NOT_STARTED
  );
  const [progress, setProgress] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (files: File[]) => {
      setFileUploadState(FileUploadState.STARTED);
      setIsPending(true);
      setProgress(0);

      const accessToken = await getToken();
      const data = new FormData();
      files.forEach(file => {
        data.append('files', file);
      });

      try {
        await axios.post(isFlexDataset ? flexUrl : url, data, {
          onUploadProgress: progressEvent => {
            const total = progressEvent.total ?? 0;
            const percentCompleted = total ? (progressEvent.loaded / total) * 100 : 0;
            setProgress(percentCompleted);
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Et-Client-Name': 'entur-ninkasi',
          },
        });
        setFileUploadState(FileUploadState.COMPLETED);
      } catch (e) {
        setFileUploadState(FileUploadState.FAILED);
        throw e;
      } finally {
        setIsPending(false);
      }
    },
    [flexUrl, getToken, isFlexDataset, url]
  );

  return { mutation: { mutate, isPending }, progress, fileUploadState };
};
