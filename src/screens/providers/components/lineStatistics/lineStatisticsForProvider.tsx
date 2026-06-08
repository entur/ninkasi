import React from 'react';
import { Box } from '@mui/material';
import { useLineStatisticsForProvider } from './apiHooks/useLineStatisticsForProvider';
import { Card } from './components/card/card';
import { LinesValidity } from './components/linesValidity/linesValidity';
import { Validity } from './lineStatistics.types';
import { LoadingLineStatistics } from './components/loadingLineStatistics';
import { PieStatistics } from './components/pieStatistics/pieStatistics';
import { getNumberOfLinesType } from './components/numberOfLines/numberOfLines.util';
import { useAppConfig } from './appContext';
import { NumberOfLines } from './components/numberOfLines/numberOfLines';
import { DaysToFirstExpiringLine } from './components/daysInFirstLineExpiration/daysToFirstExpiringLine';
import { LatestDeliveryDate } from './components/latestDeliveryDate/latestDeliveryDate';

type Props = {
  providerId: string;
  setSelectedProvider: React.Dispatch<React.SetStateAction<string | undefined>>;
  externalProviderId: boolean;
  selectedValidity: Validity;
  setSelectedValidity: React.Dispatch<React.SetStateAction<Validity>>;
};
export const LineStatisticsForProvider = ({
  providerId,
  setSelectedProvider,
  externalProviderId,
  selectedValidity,
  setSelectedValidity,
}: Props) => {
  const { lineStatistics, loading, error } = useLineStatisticsForProvider(providerId);

  const appConfig = useAppConfig();

  const numberOfLines = getNumberOfLinesType(lineStatistics);

  return (
    <LoadingLineStatistics isLoading={loading} lineStatisticsError={error}>
      <>
        {!loading && !error && (
          <Box sx={{ display: 'flex', m: '10px', flexDirection: { xs: 'column', md: 'row' } }}>
            <Card
              title={lineStatistics?.providerName}
              sx={{ flex: 4 }}
              handleClose={externalProviderId ? undefined : () => setSelectedProvider(undefined)}
            >
              <LinesValidity
                providerId={providerId}
                defaultSelectedValidity={selectedValidity}
                lineStatistics={lineStatistics}
              />
            </Card>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Card>
                <PieStatistics
                  handlePieOnClick={validity => setSelectedValidity(validity)}
                  handleShowAllClick={() => {}}
                  providerName={lineStatistics?.providerName ?? ''}
                  showHeader={false}
                  numberOfLines={numberOfLines}
                  pieContainerWidth={280}
                  showLineButton={false}
                />
              </Card>
              {appConfig.showNumberOfLinesCard && <NumberOfLines numberOfLines={numberOfLines} />}
              {appConfig.showExpiringDaysCard && lineStatistics && (
                <DaysToFirstExpiringLine lineStatistics={lineStatistics} />
              )}
              {appConfig.showDeliveryDateCard && <LatestDeliveryDate providerId={providerId} />}
            </Box>
          </Box>
        )}
      </>
    </LoadingLineStatistics>
  );
};
