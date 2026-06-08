import { useCallback } from 'react';
import { Box, Stack } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { ConnectedEventDetails } from './components/ConnectedEventDetails';
import { UploadAndValidation } from './components/UploadAndValidation';
import type { Provider, ProviderMap } from './types/provider';

interface Props {
  /**
   * When set, the events view is scoped to a single provider (shows upload UI).
   * When undefined, the view shows all providers' events (no upload UI).
   */
  providerId?: string;
  /** Optional provider object, passed through to EventDetails / EventStepper. */
  provider?: Provider;
  /** Optional provider map (used in the all-providers view to label rows). */
  providers?: ProviderMap;
}

export const EventsView = ({ providerId, provider, providers }: Props) => {
  const history = useHistory();
  const navigate = useCallback(
    (url: string) => {
      history.push(url);
    },
    [history]
  );

  // Feature-flag defaults, hard-coded to match ninkasi's existing usage.
  const hideIgnoredExportNetexBlocks = true;
  const hideAntuValidationSteps = false;
  const hideFlexDataImport = false;

  return (
    <Stack direction="column" spacing={2} sx={{ p: 2 }}>
      <Box>
        <UploadAndValidation providerId={providerId} hideFlexDataImport={hideFlexDataImport} />
      </Box>
      <Box>
        <ConnectedEventDetails
          providerId={providerId}
          provider={provider}
          providers={providers}
          hideIgnoredExportNetexBlocks={hideIgnoredExportNetexBlocks}
          hideAntuValidationSteps={hideAntuValidationSteps}
          navigate={navigate}
        />
      </Box>
    </Stack>
  );
};

export default EventsView;
