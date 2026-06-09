import { Box } from '@mui/material';
import type { LineStatisticsPerProviderId } from './apiHooks/lineStatistics.response.types';
import { Validity } from './lineStatistics.types';
import { PieStatistics } from './components/pieStatistics/pieStatistics';

interface Props {
  lineStatistics: LineStatisticsPerProviderId | undefined;
  handleShowAll: (providerId: string) => void;
  handlePieOnClick: (validity: Validity, providerId: string) => void;
}

export const PieStatisticsForAllProviders = ({
  lineStatistics,
  handleShowAll,
  handlePieOnClick,
}: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        '& > div': { m: '5px', p: '10px' },
      }}
    >
      {lineStatistics &&
        Object.keys(lineStatistics).map(providerId => (
          <PieStatistics
            showHeader={true}
            key={'provider-pie' + providerId}
            providerName={lineStatistics[providerId].providerName ?? ''}
            handleShowAllClick={() => handleShowAll(providerId)}
            handlePieOnClick={(label: Validity) => handlePieOnClick(label, providerId)}
            pieContainerWidth={235}
            numberOfLines={{
              numberOfExpiredLines:
                lineStatistics[providerId].validityCategoriesCount?.get(Validity.INVALID) ?? 0,
              numberOfValidLines:
                lineStatistics[providerId].validityCategoriesCount?.get(Validity.VALID) ?? 0,
              numberOfExpiringLines:
                lineStatistics[providerId].validityCategoriesCount?.get(Validity.EXPIRING) ?? 0,
              totalNumberOfLines:
                lineStatistics[providerId].validityCategoriesCount?.get(Validity.ALL) ?? 0,
            }}
            showLineButton={true}
          />
        ))}
    </Box>
  );
};
