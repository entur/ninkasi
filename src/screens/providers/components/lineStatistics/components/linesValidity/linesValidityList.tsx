/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 */

import { useEffect, useId, useState } from 'react';
import { Alert, Box, Typography } from '@mui/material';
import { Validity } from '../../lineStatistics.types';
import type { LineStatistics, PeriodValidity } from '../../lineStatistics.types';
import { useLocale } from '../../appContext';
import { sortLines } from './linesFilters/sortingUtilities';
import { Timeline } from '../timeline/timeline';
import { ValidityChips } from './linesFilters/validityChips';
import { infoText, validityCategoryLabel } from '../../lineStatistics.constants';
import { SortingChips } from './linesFilters/sortingChips';
import { ExpandableTimeline } from '../expandableTimeline/expandableTimeline';
import { ValidNumberOfDaysText } from './validNumberOfDaysText';
import { LinesValidityHeader } from './linesValidityHeader';
import { useLineStatisticsPublicLineDetails } from '../../apiHooks/useLineStatisticsPublicLineDetails';
import { LoadingLineStatistics } from '../loadingLineStatistics';

interface Props {
  providerId: string;
  defaultSelectedValidity: Validity;
  lineStatistics: LineStatistics;
  listTitle: string;
}

export const LinesValidityList = ({
  providerId,
  defaultSelectedValidity,
  lineStatistics,
  listTitle,
}: Props) => {
  const locale = useLocale();
  const randomId = useId();

  const { fetchPublicLineValidity, mergedLineStatistics, loading, error } =
    useLineStatisticsPublicLineDetails(providerId, lineStatistics);

  const [expandedLinesState, setExpandedLinesState] = useState<Map<string, boolean>>(
    new Map<string, boolean>()
  );

  const [sorting, setSorting] = useState<number>(1);
  const [sortedLineNumbers, setSortedLineNumbers] = useState<string[]>();

  const [selectedValidity, setSelectedValidity] = useState<Validity>(defaultSelectedValidity);

  const isLineOpen = (lineNumber: string) => {
    return !!expandedLinesState.get(lineNumber);
  };

  const toggleLineOpen = (lineNumber: string) => {
    fetchPublicLineValidity(lineNumber);
    const expandedLinesStateCopy = new Map<string, boolean>(expandedLinesState);
    expandedLinesStateCopy.set(lineNumber, !isLineOpen(lineNumber));
    setExpandedLinesState(expandedLinesStateCopy);
  };

  useEffect(() => {
    setSelectedValidity(defaultSelectedValidity);
  }, [defaultSelectedValidity]);

  useEffect(() => {
    if (mergedLineStatistics) {
      setSortedLineNumbers(sortLines(sorting, mergedLineStatistics, selectedValidity));
    }
  }, [mergedLineStatistics, selectedValidity, sorting]);

  const DayTypesValidity = ({ lineNumber }: { lineNumber: string }) => (
    <>
      {mergedLineStatistics.linesMap[lineNumber].lines.map(l => (
        <Timeline
          key={`Timeline${l.timetables.map(t => t.objectId).join('-')}`}
          timetables={l.timetables}
        />
      ))}
    </>
  );

  return (
    <>
      <Typography variant="h3">{listTitle}</Typography>
      <Box sx={{ m: '15px 15px 50px', p: '5px' }}>
        <ValidityChips
          selectedValidity={selectedValidity}
          setSelectedValidity={setSelectedValidity}
        />
        {!sortedLineNumbers || sortedLineNumbers.length === 0 ? (
          <Alert severity="info">
            {selectedValidity === Validity.ALL
              ? infoText(locale).noLinesFoundInfo
              : infoText(locale).foundNot(validityCategoryLabel(locale)[selectedValidity])}
          </Alert>
        ) : (
          <>
            {sortedLineNumbers.length > 1 && (
              <SortingChips sorting={sorting} setSorting={setSorting} />
            )}
            {sortedLineNumbers.map(lineNumber => (
              <ExpandableTimeline
                id={`${randomId}-${lineNumber}`}
                open={isLineOpen(lineNumber)}
                onToggle={() => toggleLineOpen(lineNumber)}
                effectivePeriodsForLineNumber={
                  mergedLineStatistics.linesMap[lineNumber]?.effectivePeriods as PeriodValidity[]
                }
                lineNumber={lineNumber}
                lineNames={mergedLineStatistics.linesMap[lineNumber]?.lineNames.join(', ') ?? ''}
                key={`LineItem${lineNumber}`}
                numberOfDaysHeader={
                  <ValidNumberOfDaysText
                    lineNumber={lineNumber}
                    numberOfDays={mergedLineStatistics.linesMap[lineNumber]?.daysValid ?? 0}
                  />
                }
                linesValidityListHeader={
                  <LinesValidityHeader
                    key={`LineItemHeader${lineNumber}`}
                    startDate={mergedLineStatistics.startDate}
                    validFromDate={mergedLineStatistics.requiredValidityDate}
                    endDate={mergedLineStatistics.endDate}
                  />
                }
              >
                <LoadingLineStatistics isLoading={loading} lineStatisticsError={error}>
                  <DayTypesValidity lineNumber={lineNumber} key={`DayTypesValidity${randomId}`} />
                </LoadingLineStatistics>
              </ExpandableTimeline>
            ))}
          </>
        )}
      </Box>
    </>
  );
};
