import { useEffect, useState } from 'react';
import { useAccessToken } from '@/utils/useAccessToken';
import { useConfig } from '@/contexts/ConfigContext';
import { graphqlFetch } from '@/utils/graphqlFetch';
import { Validity } from '../lineStatistics.types';
import type { FetchError, LineStatisticsPerProviderId } from './lineStatistics.response.types';

const LINE_STATISTICS_QUERY = `
  query {
    lineStatistics {
        providerId
        providerName
        startDate
        days
        validityCategories {
          name
          numDaysAtLeastValid
          lineNumbersCount
        }
      }
    }
`;

interface ValidityCategoryResponse {
  name: Validity;
  numDaysAtLeastValid: number;
  lineNumbersCount: number;
}

interface LineStatisticsAllResponse {
  providerId: number | string;
  providerName: string;
  startDate: string;
  days: number;
  validityCategories: ValidityCategoryResponse[];
}

interface LineStatisticsQueryResponse {
  lineStatistics: LineStatisticsAllResponse[];
}

export const useLineStatisticsForAllProviders = (): {
  lineStatisticsForAllProviders: LineStatisticsPerProviderId;
  loading: boolean;
  error: FetchError | null;
} => {
  const { getToken } = useAccessToken();
  const { kililiApiUrl } = useConfig();
  const [lineStatisticsForAllProviders, setLineStatisticsForAllProviders] =
    useState<LineStatisticsPerProviderId>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FetchError | null>(null);

  useEffect(() => {
    const fetchLineStatistics = async () => {
      try {
        setLoading(true);
        const accessToken = await getToken();
        const data = await graphqlFetch<LineStatisticsQueryResponse>(
          kililiApiUrl ?? '',
          LINE_STATISTICS_QUERY,
          {},
          accessToken
        );

        const transformedData: LineStatisticsPerProviderId = {};

        data.lineStatistics.forEach(lineStatistics => {
          const { providerId } = lineStatistics;
          const validityCategories = new Map<Validity, number>();
          let sum = 0;
          lineStatistics.validityCategories.forEach(category => {
            validityCategories.set(category.name, category.lineNumbersCount);
            sum += category.lineNumbersCount;
          });
          validityCategories.set(Validity.ALL, sum);

          transformedData[providerId.toString()] = {
            providerName: lineStatistics.providerName,
            startDate: lineStatistics.startDate,
            endDate: new Date(
              new Date(lineStatistics.startDate).getTime() +
                lineStatistics.days * 24 * 60 * 60 * 1000
            )
              .toISOString()
              .split('T')[0],
            requiredValidityDate: new Date().toISOString().split('T')[0],
            linesMap: {},
            // validityCategories is typed as Map<Validity, LineNumbers>, but
            // for the all-providers query we only know counts. The pie chart
            // path uses `validityCategoriesCount`; keep both populated.
            validityCategories: new Map(),
            validityCategoriesCount: validityCategories,
          };
        });

        setLineStatisticsForAllProviders(transformedData);
        setError(null);
      } catch (err) {
        const cause = (err as { cause?: FetchError }).cause;
        setError(
          cause ?? {
            status: 0,
            statusText: (err as Error).message,
          }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLineStatistics();
  }, [getToken, kililiApiUrl]);

  return {
    lineStatisticsForAllProviders,
    loading,
    error,
  };
};
