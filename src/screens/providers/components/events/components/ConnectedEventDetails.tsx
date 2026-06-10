import EventDetails from './EventDetails';
import { useEvents } from '../hooks/useEvents';
import type { Provider, ProviderMap } from '../types/provider';
import LoadingState from '@/app/components/LoadingState';
import ErrorState from '@/app/components/ErrorState';

interface Props {
  providerId?: string;
  provider?: Provider;
  providers?: ProviderMap;
  hideIgnoredExportNetexBlocks?: boolean;
  hideAntuValidationSteps?: boolean;
  navigate: (url: string) => void;
}

export const ConnectedEventDetails = ({
  providerId,
  provider,
  providers,
  hideIgnoredExportNetexBlocks,
  hideAntuValidationSteps,
  navigate,
}: Props) => {
  const { isLoading, isError, data, error } = useEvents({ providerId });

  if (isLoading) {
    return <LoadingState label="Loading events…" inline />;
  }

  if (isError) {
    return <ErrorState message={error?.message ?? 'Failed to load events'} />;
  }

  return (
    <EventDetails
      navigate={navigate}
      dataSource={data}
      hideIgnoredExportNetexBlocks={hideIgnoredExportNetexBlocks}
      hideAntuValidationSteps={hideAntuValidationSteps}
      providers={providers}
      provider={provider}
      providerId={providerId}
    />
  );
};
