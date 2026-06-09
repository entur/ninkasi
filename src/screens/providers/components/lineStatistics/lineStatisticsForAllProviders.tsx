import React from 'react';
import { Box } from '@mui/material';
import { useLineStatisticsForAllProviders } from './apiHooks/useLineStatisticsForAllProviders';
import { PieStatisticsForAllProviders } from './pieStatisticsForAllProviders';
import { LoadingLineStatistics } from './components/loadingLineStatistics';
import { IncompleteLineStatisticsError } from './components/incompleteLineStatisticsError/incompleteLineStatisticsError';
import { Validity } from './lineStatistics.types';

type Props = {
  setSelectedProvider: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSelectedValidity: React.Dispatch<React.SetStateAction<Validity>>;
};

export const LineStatisticsForAllProviders = ({
  setSelectedProvider,
  setSelectedValidity,
}: Props) => {
  const { lineStatisticsForAllProviders, loading, error } = useLineStatisticsForAllProviders();

  return (
    <LoadingLineStatistics isLoading={loading} lineStatisticsError={error}>
      <IncompleteLineStatisticsError lineStatisticsError={error} />
      <>
        {lineStatisticsForAllProviders && (
          <Box>
            <PieStatisticsForAllProviders
              lineStatistics={lineStatisticsForAllProviders}
              handlePieOnClick={(validity, providerId) => {
                setSelectedValidity(validity);
                setSelectedProvider(providerId);
              }}
              handleShowAll={providerId => {
                setSelectedValidity(Validity.ALL);
                setSelectedProvider(providerId);
              }}
            />
          </Box>
        )}
      </>
    </LoadingLineStatistics>
  );
};
