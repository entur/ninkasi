import { useEffect, useState } from 'react';
import { addDays, format, parse } from 'date-fns';
import { useAccessToken } from '@/utils/useAccessToken';
import { useConfig } from '@/contexts/ConfigContext';
import { graphqlFetch } from '@/utils/graphqlFetch';
import { Validity } from '../lineStatistics.types';
import type { Line, LineNumbers, LineStatistics, PeriodValidity } from '../lineStatistics.types';
import {
  findTimeLineEndPositionForEffectivePeriod,
  findTimeLineStartPositionForEffectivePeriod,
  findValidity,
  getDaysRange,
  validPeriod,
} from '../lineStatisticsCalculator/utilities';
import type { FetchError } from './lineStatistics.response.types';

const LINE_STATISTICS_QUERY = `
  query LineStatisticsForProvider($providerId: Int) {
    lineStatisticsForProvider(providerId: $providerId) {
        providerId
        providerName
        startDate
        days
        validityCategories {
          name
          lineNumbers
        }
        publicLines {
          lineNumber
          lineNames
          effectivePeriod {
            from
            to
          }
        }
      }
    }
`;

interface EffectivePeriodResponse {
  from: string;
  to: string;
}

interface PublicLineResponse {
  lineNumber: string;
  lineNames: string[];
  effectivePeriod: EffectivePeriodResponse | null;
}

interface ValidityCategoryResponse {
  name: Validity;
  lineNumbers: string[];
}

interface LineStatisticsForProviderResponse {
  providerId: number | string;
  providerName: string;
  startDate: string;
  days: number;
  validityCategories: ValidityCategoryResponse[];
  publicLines: PublicLineResponse[];
}

interface LineStatisticsForProviderQueryResponse {
  lineStatisticsForProvider: LineStatisticsForProviderResponse;
}

const mapLines = (lineStatisticsResponse: LineStatisticsForProviderResponse) => {
  const startDateLine: Date = parse(lineStatisticsResponse.startDate, 'yyyy-MM-dd', new Date());
  const endDateLine: Date = addDays(startDateLine, lineStatisticsResponse.days);
  const lines = lineStatisticsResponse.publicLines
    .map(publicLine => {
      let publicLineValidPeriod: Date | undefined = undefined;

      const effectivePeriodsFormatted: PeriodValidity[] = (
        [publicLine.effectivePeriod] as Array<EffectivePeriodResponse | null>
      )
        .filter((v): v is EffectivePeriodResponse => v !== null)
        .map(effectivePeriod => {
          const effectivePeriodFrom: Date = parse(effectivePeriod.from, 'yyyy-MM-dd', new Date());
          const effectivePeriodTo: Date = parse(effectivePeriod.to, 'yyyy-MM-dd', new Date());

          const timelineStartPosition: number = findTimeLineStartPositionForEffectivePeriod(
            effectivePeriodFrom,
            startDateLine,
            lineStatisticsResponse.days
          );

          const timelineEndPosition = findTimeLineEndPositionForEffectivePeriod(
            effectivePeriodTo,
            endDateLine,
            lineStatisticsResponse.days
          );

          publicLineValidPeriod = validPeriod(
            publicLineValidPeriod || startDateLine,
            effectivePeriodFrom,
            effectivePeriodTo
          );

          // findValidity is computed for side-effects of triggering bucket
          // selection in the calculator; the result is not stored, matching
          // the original ninsar behavior.
          findValidity((timelineEndPosition / 100) * lineStatisticsResponse.days);

          return {
            ...effectivePeriod,
            timelineStartPosition,
            timelineEndPosition,
          };
        });

      const daysValid: number = getDaysRange(startDateLine, publicLineValidPeriod) || 0;
      const lines: Line[] = [];

      return {
        [publicLine.lineNumber]: {
          ...publicLine,
          daysValid: daysValid,
          effectivePeriods: effectivePeriodsFormatted,
          lines: lines,
        },
      };
    })
    .reduce((result, obj) => ({ ...result, ...obj }), {});

  return {
    startDateLine,
    endDateLine,
    lines,
  };
};

export const useLineStatisticsForProvider = (
  providerId: string
): {
  lineStatistics: LineStatistics | undefined;
  loading: boolean;
  error: FetchError | null;
} => {
  const { getToken } = useAccessToken();
  const { kililiApiUrl } = useConfig();
  const [lineStatistics, setLineStatistics] = useState<LineStatistics | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FetchError | null>(null);

  useEffect(() => {
    const fetchLineStatistics = async () => {
      try {
        setLoading(true);
        const accessToken = await getToken();
        const data = await graphqlFetch<
          LineStatisticsForProviderQueryResponse,
          { providerId: number }
        >(
          kililiApiUrl ?? '',
          LINE_STATISTICS_QUERY,
          { providerId: Number(providerId) },
          accessToken
        );

        const {
          startDateLine,
          endDateLine,
          lines: linesMap,
        } = mapLines(data.lineStatisticsForProvider);

        const validityCategories = new Map<Validity, LineNumbers>();
        const allLineNumbers: LineNumbers = [];

        data.lineStatisticsForProvider.validityCategories.forEach(category => {
          validityCategories.set(category.name, category.lineNumbers);
          allLineNumbers.push(...category.lineNumbers);
        });

        validityCategories.set(Validity.ALL, allLineNumbers);

        const transformedData: LineStatistics = {
          providerName: data.lineStatisticsForProvider.providerName,
          startDate: format(startDateLine, 'yyyy-MM-dd'),
          endDate: format(endDateLine, 'yyyy-MM-dd'),
          requiredValidityDate: format(addDays(startDateLine, 120), 'yyyy-MM-dd'),
          linesMap,
          validityCategories,
        };
        setLineStatistics(transformedData);
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
  }, [providerId, getToken, kililiApiUrl]);

  return {
    lineStatistics,
    loading,
    error,
  };
};
