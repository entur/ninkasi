import { Box, CircularProgress, Typography } from '@mui/material';
import EventDetails from './EventDetails';
import { useEvents } from '../hooks/useEvents';
import type { Provider, ProviderMap } from '../types/provider';

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
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
        <CircularProgress size={20} />
        <Typography>Loading events...</Typography>
      </Box>
    );
  }

  if (isError) {
    return <Typography color="error">Error: {error?.message}</Typography>;
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
