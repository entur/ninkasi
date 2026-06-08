import { useEffect, useState } from 'react';
import moment from 'moment/moment';
import type { Moment } from 'moment/moment';
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
  const startDateLine: Moment = moment(lineStatisticsResponse.startDate, 'YYYY-MM-DD');
  const endDateLine: Moment = moment(startDateLine).add(lineStatisticsResponse.days, 'days');
  const lines = lineStatisticsResponse.publicLines
    .map(publicLine => {
      let publicLineValidPeriod: Moment | undefined = undefined;

      const effectivePeriodsFormatted: PeriodValidity[] = (
        [publicLine.effectivePeriod] as Array<EffectivePeriodResponse | null>
      )
        .filter((v): v is EffectivePeriodResponse => v !== null)
        .map(effectivePeriod => {
          const effectivePeriodFrom: Moment = moment(effectivePeriod.from, 'YYYY-MM-DD');
          const effectivePeriodTo: Moment = moment(effectivePeriod.to, 'YYYY-MM-DD');

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
          startDate: startDateLine.format('YYYY-MM-DD'),
          endDate: endDateLine.format('YYYY-MM-DD'),
          requiredValidityDate: moment(startDateLine).add(120, 'days').format('YYYY-MM-DD'),
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
