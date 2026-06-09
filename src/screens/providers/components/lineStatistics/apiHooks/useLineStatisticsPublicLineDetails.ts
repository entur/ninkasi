import { useCallback, useState } from 'react';
import { addDays, parse } from 'date-fns';
import { useAccessToken } from '@/utils/useAccessToken';
import { useConfig } from '@/contexts/ConfigContext';
import { graphqlFetch } from '@/utils/graphqlFetch';
import type {
  Line,
  LineStatistics,
  PeriodValidity,
  PublicLineValidity,
} from '../lineStatistics.types';
import {
  findTimeLineEndPositionForEffectivePeriod,
  findTimeLineEndPositionForTimeTable,
  findTimeLineStartPositionForEffectivePeriod,
  findTimeLineStartPositionForTimeTable,
  findValidity,
  getDaysRange,
  validPeriod,
} from '../lineStatisticsCalculator/utilities';
import type { FetchError } from './lineStatistics.response.types';

const LINE_STATISTICS_QUERY = `
  query LineStatisticsForProvider($providerId: Int, $lineNumbers: [String!]) {
    lineStatisticsForProvider(providerId: $providerId) {
        startDate
        days
        providerId
        publicLines(lineNumbers: $lineNumbers) {
          lineNumber
          lineNames
          effectivePeriod {
            from
            to
          }
          lines {
            objectId
            name
            timetables {
              objectId
              periods {
                from
                to
              }
            }
          }
        }
      }
    }
`;

interface EffectivePeriodResponse {
  from: string;
  to: string;
}

interface PeriodResponse {
  from: string;
  to: string;
}

interface TimetableResponse {
  objectId: string;
  periods: PeriodResponse[];
}

interface LineResponse {
  objectId: string;
  name: string;
  timetables: TimetableResponse[];
}

interface PublicLineResponse {
  lineNumber: string;
  lineNames: string[];
  effectivePeriod: EffectivePeriodResponse;
  lines: LineResponse[];
}

interface LineStatisticsForProviderResponse {
  providerId: number | string;
  startDate: string;
  days: number;
  publicLines: PublicLineResponse[];
}

interface LineStatisticsQueryResponse {
  lineStatisticsForProvider: LineStatisticsForProviderResponse;
}

const mapPublicLineValidity = (
  lineStatisticsResponse: LineStatisticsForProviderResponse
): PublicLineValidity => {
  const startDateLine: Date = parse(lineStatisticsResponse.startDate, 'yyyy-MM-dd', new Date());
  const endDateLine: Date = addDays(startDateLine, lineStatisticsResponse.days);

  const publicLine = lineStatisticsResponse.publicLines[0];

  let publicLineValidPeriod: Date | undefined = undefined;

  const effectivePeriodsFormatted: PeriodValidity[] = [publicLine.effectivePeriod].map(
    effectivePeriod => {
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

      findValidity((timelineEndPosition / 100) * lineStatisticsResponse.days);

      return {
        ...effectivePeriod,
        timelineStartPosition,
        timelineEndPosition,
      };
    }
  );

  const daysValid: number = getDaysRange(startDateLine, publicLineValidPeriod) || 0;

  const lines: Line[] = publicLine.lines.map(line => ({
    ...line,
    timetables: line.timetables.map(timetable => ({
      ...timetable,
      periods: timetable.periods.map(period => ({
        ...period,
        timelineStartPosition: findTimeLineStartPositionForTimeTable(
          period.from,
          startDateLine,
          lineStatisticsResponse.days
        ),
        timelineEndPosition: findTimeLineEndPositionForTimeTable(
          period.to,
          endDateLine,
          lineStatisticsResponse.days
        ),
      })),
    })),
  }));

  return {
    ...publicLine,
    daysValid: daysValid,
    effectivePeriods: effectivePeriodsFormatted,
    lines: lines,
  };
};

export const useLineStatisticsPublicLineDetails = (
  providerId: string,
  lineStatistics: LineStatistics
): {
  fetchPublicLineValidity: (lineNumber: string) => void;
  mergedLineStatistics: LineStatistics;
  loading: boolean;
  error: FetchError | null;
} => {
  const { getToken } = useAccessToken();
  const { kililiApiUrl } = useConfig();
  const [mergedLineStatistics, setMergedLineStatistics] = useState<LineStatistics>(lineStatistics);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FetchError | null>(null);

  const fetchPublicLineValidity = useCallback(
    (lineNumber: string) => {
      const fetchLineStatistics = async () => {
        try {
          setLoading(true);
          const accessToken = await getToken();
          const data = await graphqlFetch<
            LineStatisticsQueryResponse,
            { providerId: number; lineNumbers: string[] }
          >(
            kililiApiUrl ?? '',
            LINE_STATISTICS_QUERY,
            {
              providerId: Number(providerId),
              lineNumbers: [lineNumber],
            },
            accessToken
          );

          const mappedPublicLineValidity = mapPublicLineValidity(data.lineStatisticsForProvider);

          setMergedLineStatistics({
            ...lineStatistics,
            linesMap: {
              ...lineStatistics.linesMap,
              [lineNumber]: mappedPublicLineValidity,
            },
          });
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
    },
    [providerId, getToken, kililiApiUrl, lineStatistics]
  );

  return {
    fetchPublicLineValidity,
    mergedLineStatistics,
    loading,
    error,
  };
};
