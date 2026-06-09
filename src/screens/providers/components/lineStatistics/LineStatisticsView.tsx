import { useState } from 'react';
import { LineStatisticsForAllProviders } from './lineStatisticsForAllProviders';
import { LineStatisticsForProvider } from './lineStatisticsForProvider';
import { Validity } from './lineStatistics.types';

interface Props {
  /**
   * If provided, render the single-provider detail view (delivery date card,
   * expiring lines, pie chart, validity list, timeline).
   *
   * If undefined, render the all-providers grid of clickable pie charts.
   */
  providerId?: string;
}

const LineStatisticsView = ({ providerId }: Props) => {
  const [selectedProvider, setSelectedProvider] = useState<string | undefined>(providerId);
  const [selectedValidity, setSelectedValidity] = useState<Validity>(Validity.ALL);

  // `externalProviderId` controls whether the back/close button is rendered on
  // the per-provider card. When the caller passes a providerId we treat it as
  // fixed; otherwise the user got here by clicking a pie chart and should be
  // able to navigate back to the grid.
  const externalProviderId = providerId !== undefined;
  const activeProvider = externalProviderId ? providerId : selectedProvider;

  if (activeProvider) {
    return (
      <LineStatisticsForProvider
        providerId={activeProvider}
        setSelectedProvider={setSelectedProvider}
        externalProviderId={externalProviderId}
        selectedValidity={selectedValidity}
        setSelectedValidity={setSelectedValidity}
      />
    );
  }

  return (
    <LineStatisticsForAllProviders
      setSelectedProvider={setSelectedProvider}
      setSelectedValidity={setSelectedValidity}
    />
  );
};

export default LineStatisticsView;
