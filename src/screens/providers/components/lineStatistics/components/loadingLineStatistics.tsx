import type { ReactElement } from 'react';
import type { FetchError } from '../apiHooks/lineStatistics.response.types';
import { errorText } from '../lineStatistics.constants';
import { LoadingOrFailed } from './LoadingOrFailed';
import { useLocale } from '../appContext';

interface Props {
  lineStatisticsError: FetchError | null;
  children: ReactElement | ReactElement[];
  isLoading: boolean;
}

export const LoadingLineStatistics = ({ isLoading, lineStatisticsError, children }: Props) => {
  const locale = useLocale();
  return (
    <LoadingOrFailed
      errorText={errorText(locale).failedToLoadData}
      isLoading={isLoading}
      error={!!lineStatisticsError}
    >
      {children}
    </LoadingOrFailed>
  );
};
