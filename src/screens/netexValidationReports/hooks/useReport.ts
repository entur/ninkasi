import { useEffect, useState } from 'react';
import { useAccessToken } from '@/utils/useAccessToken';
import { useConfig } from '@/contexts/ConfigContext';
import type { ValidationReport } from '../model/ValidationReport';

export type ValidationReportFetchError = {
  status: number;
  statusText: string;
};

export const useReport = (codespace: string, id: string) => {
  const { getToken } = useAccessToken();
  const { timetableValidationApiUrl } = useConfig();
  const [report, setReport] = useState<ValidationReport | undefined>();
  const [error, setError] = useState<ValidationReportFetchError | undefined>();

  useEffect(() => {
    const fetchReport = async () => {
      const accessToken = await getToken();
      const response = await fetch(`${timetableValidationApiUrl}/${codespace}/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Et-Client-Name': 'entur-ninkasi',
        },
      });
      if (response.ok) {
        const fetched = (await response.json()) as ValidationReport;
        setReport(fetched);
        setError(undefined);
      } else {
        setError({
          status: response.status,
          statusText: response.statusText,
        });
      }
    };
    fetchReport();
  }, [codespace, id, getToken, timetableValidationApiUrl]);

  return { report, error };
};
